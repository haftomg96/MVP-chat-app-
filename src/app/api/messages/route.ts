import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const currentUser = await validateSession(token)
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const otherUserId = searchParams.get('userId')
    const limit = parseInt(searchParams.get('limit') || '30')
    const before = searchParams.get('before') // cursor for pagination

    if (!otherUserId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const whereClause: any = {
      OR: [
        { senderId: currentUser.id, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: currentUser.id },
      ],
      // Exclude messages that are deleted or cleared by current user
      NOT: {
        OR: [
          { deletedBy: { has: currentUser.id } },
          { clearedBy: { has: currentUser.id } },
        ],
      },
    }

    // Add cursor for pagination
    if (before) {
      whereClause.createdAt = { lt: new Date(before) }
    }

    const messages = await prisma.message.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc', // Get newest first for pagination
      },
      take: limit,
    })

    // Reverse to show oldest first in UI
    const reversedMessages = messages.reverse()

    // Mark messages as read
    await prisma.message.updateMany({
      where: {
        senderId: otherUserId,
        receiverId: currentUser.id,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    })

    return NextResponse.json({
      messages: reversedMessages,
      hasMore: messages.length === limit,
    })
  } catch (error) {
    console.error('Get messages error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const currentUser = await validateSession(token)
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { content, receiverId } = await req.json()

    if (!content || !receiverId) {
      return NextResponse.json(
        { error: 'Content and receiver ID are required' },
        { status: 400 }
      )
    }

    const message = await prisma.message.create({
      data: {
        content,
        senderId: currentUser.id,
        receiverId,
      },
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error('Send message error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
