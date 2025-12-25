import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { messageId, emoji } = await req.json()

    if (!messageId || !emoji) {
      return NextResponse.json(
        { error: 'Message ID and emoji are required' },
        { status: 400 }
      )
    }

    // Get the message
    const message = await prisma.message.findUnique({
      where: { id: messageId },
    })

    if (!message) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 })
    }

    // Parse existing reactions
    const reactions = (message.reactions as any) || {}
    
    // First, remove user's existing reaction from any emoji
    for (const existingEmoji in reactions) {
      const users = reactions[existingEmoji] as string[]
      if (users.includes(decoded.userId)) {
        reactions[existingEmoji] = users.filter((id: string) => id !== decoded.userId)
        if (reactions[existingEmoji].length === 0) {
          delete reactions[existingEmoji]
        }
      }
    }
    
    // Now check if user is clicking the same emoji (to remove) or a different one (to add)
    if (reactions[emoji] && reactions[emoji].includes(decoded.userId)) {
      // User clicked same emoji again - already removed above, so do nothing
    } else {
      // Add new reaction
      if (reactions[emoji]) {
        reactions[emoji].push(decoded.userId)
      } else {
        reactions[emoji] = [decoded.userId]
      }
    }

    // Update message
    const updatedMessage = await prisma.message.update({
      where: { id: messageId },
      data: { reactions },
    })

    return NextResponse.json({
      success: true,
      reactions: updatedMessage.reactions,
    })
  } catch (error) {
    console.error('Add reaction error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
