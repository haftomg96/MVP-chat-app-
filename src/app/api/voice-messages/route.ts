import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    })

    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    const formData = await request.formData()
    const audioFile = formData.get('audio') as File
    const receiverId = formData.get('receiverId') as string
    const duration = formData.get('duration') as string

    if (!audioFile || !receiverId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'voice')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const filename = `voice_${session.userId}_${timestamp}.webm`
    const filepath = join(uploadsDir, filename)

    // Save audio file
    const bytes = await audioFile.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    // Create message in database
    const message = await prisma.message.create({
      data: {
        content: `/uploads/voice/${filename}`,
        senderId: session.userId,
        receiverId,
        type: 'voice',
        metadata: {
          duration: parseInt(duration) || 0,
        },
      },
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error('Voice message error:', error)
    return NextResponse.json(
      { error: 'Failed to send voice message' },
      { status: 500 }
    )
  }
}
