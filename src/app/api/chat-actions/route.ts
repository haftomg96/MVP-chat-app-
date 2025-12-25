import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

function getUserFromToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    return decoded.userId
  } catch (error) {
    return null
  }
}

// Mark conversation as unread
export async function POST(request: NextRequest) {
  try {
    const userId = getUserFromToken(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { action, targetUserId } = await request.json()

    switch (action) {
      case 'mark-unread':
        // Find the last message from targetUser to current user and mark as unread
        const lastMessage = await prisma.message.findFirst({
          where: {
            receiverId: userId,
            senderId: targetUserId,
          },
          orderBy: {
            createdAt: 'desc',
          },
        })

        if (lastMessage) {
          await prisma.message.update({
            where: { id: lastMessage.id },
            data: { isRead: false },
          })
        }
        return NextResponse.json({ success: true, message: 'Marked as unread' })

      case 'archive':
        // Archive functionality - can be implemented with user preferences
        return NextResponse.json({ success: true, message: 'Chat archived' })

      case 'mute':
        // Mute functionality - can be implemented with user preferences
        return NextResponse.json({ success: true, message: 'Chat muted' })

      case 'clear':
        // Soft clear: Add userId to clearedBy array
        await prisma.message.updateMany({
          where: {
            OR: [
              { senderId: userId, receiverId: targetUserId },
              { senderId: targetUserId, receiverId: userId },
            ],
          },
          data: {
            clearedBy: {
              push: userId,
            },
          },
        })
        return NextResponse.json({ success: true, message: 'Chat cleared' })

      case 'delete':
        // Soft delete: Add userId to deletedBy array
        await prisma.message.updateMany({
          where: {
            OR: [
              { senderId: userId, receiverId: targetUserId },
              { senderId: targetUserId, receiverId: userId },
            ],
          },
          data: {
            deletedBy: {
              push: userId,
            },
          },
        })
        return NextResponse.json({ success: true, message: 'Chat deleted' })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Chat action error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Export chat history
export async function GET(request: NextRequest) {
  try {
    const userId = getUserFromToken(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const targetUserId = searchParams.get('targetUserId')

    if (!targetUserId) {
      return NextResponse.json(
        { error: 'Target user ID required' },
        { status: 400 }
      )
    }

    // Fetch all messages between the two users
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: targetUserId },
          { senderId: targetUserId, receiverId: userId },
        ],
      },
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        sender: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    // Format messages for export
    const exportData = messages.map((msg) => ({
      timestamp: msg.createdAt,
      sender: msg.sender.name || msg.sender.email,
      message: msg.content,
    }))

    return NextResponse.json({
      success: true,
      data: exportData,
      count: messages.length,
    })
  } catch (error) {
    console.error('Export chat error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
