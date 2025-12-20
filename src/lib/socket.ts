import { Server as HTTPServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import { validateSession } from './auth'

export const onlineUsers = new Map<string, string>() // userId -> socketId

export function initializeSocket(httpServer: HTTPServer) {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.NEXTAUTH_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  })

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id)

    socket.on('authenticate', async (token: string) => {
      const user = await validateSession(token)
      if (user) {
        onlineUsers.set(user.id, socket.id)
        socket.data.userId = user.id
        io.emit('user-status', { userId: user.id, online: true })
        console.log('User authenticated:', user.email)
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

    socket.on('disconnect', () => {
      const userId = socket.data.userId
      if (userId) {
        onlineUsers.delete(userId)
        io.emit('user-status', { userId, online: false })
        console.log('User disconnected:', userId)
      }
    })
  })

  return io
}
