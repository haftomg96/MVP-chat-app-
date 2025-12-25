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

    // Get all users except current user
    const users = await prisma.user.findMany({
      where: {
        id: { not: decoded.userId },
      },
      select: { id: true },
    })

    // For each user, get the last message in conversation
    const lastMessages: Record<string, any> = {}

    for (const user of users) {
      const lastMessage = await prisma.message.findFirst({
        where: {
          OR: [
            { senderId: decoded.userId, receiverId: user.id },
            { senderId: user.id, receiverId: decoded.userId },
          ],
          // Exclude messages that are deleted or cleared by current user
          NOT: {
            OR: [
              { deletedBy: { has: decoded.userId } },
              { clearedBy: { has: decoded.userId } },
            ],
          },
        },
        orderBy: { createdAt: 'desc' },
        select: {
          content: true,
          createdAt: true,
          isRead: true,
          senderId: true,
          type: true,
          metadata: true,
        },
      })

      if (lastMessage) {
        lastMessages[user.id] = lastMessage
        // console.log(`📨 Last message with ${user.id}:`, lastMessage.content.substring(0, 30))
      }
    }

    // console.log('📨 Returning last messages for', Object.keys(lastMessages).length, 'conversations')

    return NextResponse.json(lastMessages)
  } catch (error) {
    console.error('Get last messages error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch last messages' },
      { status: 500 }
    )
  }
}
