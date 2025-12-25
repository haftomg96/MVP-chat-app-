import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuthStore } from '@/store/useAuthStore'
import { useChatStore } from '@/store/useChatStore'

export function useSocket() {
  const socketRef = useRef<Socket | null>(null)
  const { token } = useAuthStore()
  const { addMessage, setUserOnline, setOnlineUsers } = useChatStore()

  useEffect(() => {
    if (!token) return

    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000', {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    })

    socketRef.current = socket

    socket.on('connect', () => {
      socket.emit('authenticate', token)
    })

    socket.on('receive-message', (message) => {
      addMessage(message)
    })

    socket.on('user-status', ({ userId, online }) => {
      setUserOnline(userId, online)
    })

    socket.on('online-users', (users) => {
      setOnlineUsers(users)
    })

    socket.on('disconnect', () => {
      // Handle disconnect
    })

    socket.on('connect_error', (error) => {
      console.error('🔴 Socket connection error:', error)
    })

    return () => {
      socket.disconnect()
    }
  }, [token, addMessage, setUserOnline, setOnlineUsers])

  return socketRef.current
}
