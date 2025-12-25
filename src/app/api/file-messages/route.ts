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
    const file = formData.get('file') as File
    const receiverId = formData.get('receiverId') as string

    if (!file || !receiverId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'files')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const originalName = file.name
    const extension = originalName.split('.').pop()
    const filename = `file_${session.userId}_${timestamp}.${extension}`
    const filepath = join(uploadsDir, filename)

    // Save file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    // Create message in database
    const message = await prisma.message.create({
      data: {
        content: `/uploads/files/${filename}`,
        senderId: session.userId,
        receiverId,
        type: 'file',
        metadata: {
          fileName: originalName,
          fileSize: file.size,
          fileType: file.type,
        },
      },
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error('File message error:', error)
    return NextResponse.json(
      { error: 'Failed to send file' },
      { status: 500 }
    )
  }
}
