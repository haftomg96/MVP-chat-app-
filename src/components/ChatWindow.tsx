'use client'

import { useEffect, useState, useRef } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { useChatStore } from '@/store/useChatStore'
import { useSocket } from '@/hooks/useSocket'

interface Message {
  id: string
  content: string
  senderId: string
  receiverId: string
  createdAt: string
  isRead: boolean
}

export default function ChatWindow({
  onShowContactInfo,
  onMobileBack,
}: {
  onShowContactInfo: () => void
  onMobileBack?: () => void
}) {
  const { token, user } = useAuthStore()
  const { selectedUserId, messages, setMessages, addMessage, onlineUsers } =
    useChatStore()
  const [newMessage, setNewMessage] = useState('')
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const socket = useSocket()

  useEffect(() => {
    if (selectedUserId && selectedUserId !== 'ai-assistant') {
      fetchMessages()
      fetchUserDetails()
    } else if (selectedUserId === 'ai-assistant') {
      setMessages([])
      setSelectedUser({
        id: 'ai-assistant',
        name: 'AI Assistant',
        email: 'ai@assistant.com',
        picture: null,
      })
    }
  }, [selectedUserId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Listen for incoming messages and typing events
  useEffect(() => {
    if (!socket) {
      console.log('⚠️ Socket not initialized yet')
      return
    }

    console.log('🎧 Setting up socket listeners for user:', selectedUserId)

    const handleReceiveMessage = (message: any) => {
      console.log('📨 Received message via socket:', message)
      // Only add message if it's for the current conversation
      if (
        (message.senderId === selectedUserId && message.receiverId === user?.id) ||
        (message.senderId === user?.id && message.receiverId === selectedUserId)
      ) {
        console.log('✅ Message is for current conversation, adding to chat')
        addMessage(message)
      } else {
        console.log('⚠️ Message is for different conversation, ignoring')
      }
    }

    const handleUserTyping = (data: { senderId: string; isTyping: boolean }) => {
      console.log('⌨️ Received typing event:', data)
      if (data.senderId === selectedUserId) {
        console.log('✅ Setting typing indicator:', data.isTyping)
        setIsTyping(data.isTyping)
      }
    }

    socket.on('receive-message', handleReceiveMessage)
    socket.on('user-typing', handleUserTyping)

    return () => {
      console.log('🧹 Cleaning up socket listeners')
      socket.off('receive-message', handleReceiveMessage)
      socket.off('user-typing', handleUserTyping)
    }
  }, [socket, selectedUserId, user?.id, addMessage])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value)

    // Emit typing event
    if (socket && selectedUserId && selectedUserId !== 'ai-assistant') {
      console.log('⌨️ Emitting typing event to:', selectedUserId)
      socket.emit('typing', {
        senderId: user?.id,
        receiverId: selectedUserId,
        isTyping: true,
      })

      // Clear previous timeout
      if (typingTimeout) {
        clearTimeout(typingTimeout)
      }

      // Set new timeout to stop typing indicator
      const timeout = setTimeout(() => {
        console.log('⌨️ Stopping typing indicator')
        socket.emit('typing', {
          senderId: user?.id,
          receiverId: selectedUserId,
          isTyping: false,
        })
      }, 2000)

      setTypingTimeout(timeout)
    }
  }

  const fetchMessages = async () => {
    if (!selectedUserId || selectedUserId === 'ai-assistant') return

    try {
      const res = await fetch(`/api/messages?userId=${selectedUserId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setMessages(data)
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    }
  }

  const fetchUserDetails = async () => {
    try {
      const res = await fetch('/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const users = await res.json()
        const foundUser = users.find((u: any) => u.id === selectedUserId)
        setSelectedUser(foundUser)
      }
    } catch (error) {
      console.error('Failed to fetch user details:', error)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedUserId || loading) return

    const messageContent = newMessage.trim()
    setNewMessage('')
    setLoading(true)

    try {
      if (selectedUserId === 'ai-assistant') {
        // AI Chat
        const userMsg = {
          id: Date.now().toString(),
          content: messageContent,
          senderId: user!.id,
          receiverId: 'ai-assistant',
          createdAt: new Date().toISOString(),
          isRead: true,
        }
        addMessage(userMsg)

        // Show AI loading indicator
        setAiLoading(true)

        const res = await fetch('/api/ai-chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ message: messageContent }),
        })

        setAiLoading(false)

        if (res.ok) {
          const data = await res.json()
          const aiMsg = {
            id: (Date.now() + 1).toString(),
            content: data.response,
            senderId: 'ai-assistant',
            receiverId: user!.id,
            createdAt: new Date().toISOString(),
            isRead: true,
          }
          addMessage(aiMsg)
        }
      } else {
        // Regular chat
        const res = await fetch('/api/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            content: messageContent,
            receiverId: selectedUserId,
          }),
        })

        if (res.ok) {
          const message = await res.json()
          console.log('✅ Message saved to DB:', message)
          addMessage(message)

          // Send via WebSocket
          if (socket) {
            console.log('📤 Emitting message via socket:', message)
            socket.emit('send-message', message)
          } else {
            console.log('⚠️ Socket not available, message not sent in real-time')
          }
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!selectedUserId) {
    return (
      <div className="flex-1 bg-white p-4 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Select a conversation
          </h3>
          <p className="text-gray-500">
            Choose a user from the sidebar to start chatting
          </p>
        </div>
      </div>
    )
  }

  const isOnline =
    selectedUserId === 'ai-assistant' || onlineUsers.has(selectedUserId)

  return (
    <div className="flex-1 flex flex-col bg-white md:rounded-2xl md:p-2 shadow-sm overflow-hidden h-full">
      {/* Chat Header */}
      <div className="flex items-center justify-between h-[60px] pt-1 px-3 pb-4 gap-3 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          {/* Mobile Back Button */}
          {onMobileBack && (
            <button
              onClick={onMobileBack}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition -ml-2"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}
          
          <div className="relative">
            {selectedUser?.picture ? (
              <img
                src={selectedUser.picture}
                alt={selectedUser.name || 'User'}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                {selectedUser?.name?.[0] || 'A'}
              </div>
            )}
            {isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-900">
              {selectedUser?.name || 'User'}
            </h2>
            <p className="text-xs text-green-500">
              {isOnline ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1 md:space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition hidden md:block">
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition hidden md:block">
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition hidden md:block">
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </button>
          <button
            onClick={onShowContactInfo}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ backgroundColor: '#F3F3EE' }}>
        {messages.map((message) => {
          const isSent = message.senderId === user?.id
          return (
            <div
              key={message.id}
              className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-md px-3.5 py-2.5 rounded-2xl ${
                  isSent
                    ? 'bg-primary text-white rounded-br-none'
                    : 'bg-white text-gray-900 rounded-bl-none shadow-sm'
                }`}
              >
                <p className="text-[13px] leading-relaxed">{message.content}</p>
                <p
                  className={`text-[10px] mt-1 ${
                    isSent ? 'text-teal-100' : 'text-gray-500'
                  }`}
                >
                  {new Date(message.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  {isSent && message.isRead && (
                    <svg
                      className="w-4 h-4 inline ml-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </p>
              </div>
            </div>
          )
        })}
        
        {/* Typing Indicator (for regular users) */}
        {isTyping && selectedUserId !== 'ai-assistant' && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 rounded-2xl rounded-bl-none shadow-sm px-4 py-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        {/* AI Loading Indicator */}
        {aiLoading && selectedUserId === 'ai-assistant' && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 rounded-2xl rounded-bl-none shadow-sm px-4 py-3">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1.5">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="text-xs text-gray-500">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSendMessage}
        className="p-3 md:p-4 border-t border-gray-200 bg-white"
      >
        <div className="flex items-center space-x-2 md:space-x-3">
          <input
            type="text"
            value={newMessage}
            onChange={handleInputChange}
            placeholder="Type any message..."
            className="flex-1 px-3 md:px-4 py-2 md:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-[13px]"
            disabled={loading}
          />
          
          {/* Microphone Icon - Hidden on small mobile */}
          <button
            type="button"
            className="p-2 hover:bg-gray-100 rounded-lg transition hidden sm:block"
            title="Voice record"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>
          </button>

          {/* Emoji Icon - Hidden on small mobile */}
          <button
            type="button"
            className="p-2 hover:bg-gray-100 rounded-lg transition hidden sm:block"
            title="Emoji"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>

          {/* Attachment Icon - Hidden on small mobile */}
          <button
            type="button"
            className="p-2 hover:bg-gray-100 rounded-lg transition hidden md:block"
            title="Attach file"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
              />
            </svg>
          </button>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!newMessage.trim() || loading}
            className="p-2 md:p-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
            title="Send message"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  )
}
