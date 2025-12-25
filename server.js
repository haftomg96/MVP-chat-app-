const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const { Server } = require('socket.io')
const { PrismaClient } = require('@prisma/client')
const jwt = require('jsonwebtoken')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = 9080
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const onlineUsers = new Map()

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })

  const io = new Server(httpServer, {
    cors: {
      origin: process.env.NEXTAUTH_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  })

  io.on('connection', (socket) => {
    socket.on('authenticate', async (token) => {
      try {
        const session = await prisma.session.findUnique({
          where: { token },
          include: { user: true },
        })

        if (session && session.expiresAt > new Date()) {
          const user = session.user
          onlineUsers.set(user.id, socket.id)
          socket.data.userId = user.id

          // Broadcast user online status
          io.emit('user-status', { userId: user.id, online: true })

          // Send list of online users to the newly connected user
          const onlineUserIds = Array.from(onlineUsers.keys())
          socket.emit('online-users', onlineUserIds)
        }
      } catch (error) {
        console.error('🔴 Authentication error:', error)
      }
    })

    socket.on('send-message', (data) => {
      const receiverSocketId = onlineUsers.get(data.receiverId)
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receive-message', data)
      }
    })

    socket.on('typing', (data) => {
      const receiverSocketId = onlineUsers.get(data.receiverId)
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('user-typing', {
          senderId: data.senderId,
          isTyping: data.isTyping,
        })
      }
    })

    socket.on('message-read', (data) => {
      const senderSocketId = onlineUsers.get(data.senderId)
      if (senderSocketId) {
        io.to(senderSocketId).emit('message-read', {
          messageId: data.messageId,
          receiverId: data.receiverId,
        })
      }
    })

    socket.on('message-reaction', (data) => {
      const receiverSocketId = onlineUsers.get(data.receiverId)
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('message-reaction', {
          messageId: data.messageId,
          reactions: data.reactions,
        })
      }
    })

    socket.on('disconnect', () => {
      const userId = socket.data.userId
      if (userId) {
        onlineUsers.delete(userId)
        io.emit('user-status', { userId, online: false })
      }
    })
  })

  httpServer
    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`)
    })
})
