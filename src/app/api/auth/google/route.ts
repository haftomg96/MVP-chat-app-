import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { credential } = await req.json()

    // Decode Google JWT (in production, verify with Google's API)
    const payload = JSON.parse(
      Buffer.from(credential.split('.')[1], 'base64').toString()
    )

    const { sub: googleId, email, name, picture } = payload

    let user = await prisma.user.findUnique({ where: { googleId } })

    if (!user) {
      user = await prisma.user.findUnique({ where: { email } })
      if (user) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { googleId, picture, name },
        })
      } else {
        user = await prisma.user.create({
          data: { googleId, email, name, picture },
        })
      }
    }

    const token = await createSession(user.id)

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
      },
      token,
    })
  } catch (error) {
    // console.error('Google auth error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}
