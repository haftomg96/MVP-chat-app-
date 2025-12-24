import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    console.log('📨 Fetching last messages for user:', decoded.userId)

    // Get all users except current user
    const users = await prisma.user.findMany({
      where: {
        id: { not: decoded.userId },
      },
      select: { id: true },
    })

    console.log('📨 Found users:', users.length)

    // For each user, get the last message in conversation
    const lastMessages: Record<string, any> = {}

    for (const user of users) {
      const lastMessage = await prisma.message.findFirst({
        where: {
          OR: [
            { senderId: decoded.userId, receiverId: user.id },
            { senderId: user.id, receiverId: decoded.userId },
          ],
        },
        orderBy: { createdAt: 'desc' },
        select: {
          content: true,
          createdAt: true,
          isRead: true,
          senderId: true,
        },
      })

      if (lastMessage) {
        lastMessages[user.id] = lastMessage
        console.log(`📨 Last message with ${user.id}:`, lastMessage.content.substring(0, 30))
      }
    }

    console.log('📨 Returning last messages for', Object.keys(lastMessages).length, 'conversations')

    return NextResponse.json(lastMessages)
  } catch (error) {
    console.error('Get last messages error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch last messages' },
      { status: 500 }
    )
  }
}
