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
      markMessagesAsRead()
    } else if (selectedUserId === 'ai-assistant') {
      setMessages([])
      setSelectedUser({
        id: 'ai-assistant',
        name: 'AI Assistant',
        email: 'ai@assistant.com',
        picture: null,
      })
    }
    
    // Reset typing indicator when switching conversations
    setIsTyping(false)
    
    // Clear any pending typing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout)
      setTypingTimeout(null)
    }
  }, [selectedUserId])

  const markMessagesAsRead = async () => {
    if (!selectedUserId || selectedUserId === 'ai-assistant') return
    
    try {
      await fetch('/api/messages/mark-read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: selectedUserId }),
      })
    } catch (error) {
      console.error('Failed to mark messages as read:', error)
    }
  }

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
        
        // If we received a message (not sent by us), mark it as read and notify sender
        if (message.senderId === selectedUserId && socket) {
          markMessagesAsRead()
          // Emit read receipt to sender
          socket.emit('message-read', {
            messageId: message.id,
            senderId: message.senderId,
            receiverId: user?.id
          })
        }
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

    const handleMessageRead = (data: { messageId: string; receiverId: string }) => {
      console.log('✅ Message read receipt received:', data)
      // Update the message status to read in the UI
      setMessages(
        messages.map((msg) =>
          msg.id === data.messageId ? { ...msg, isRead: true } : msg
        )
      )
    }

    socket.on('receive-message', handleReceiveMessage)
    socket.on('user-typing', handleUserTyping)
    socket.on('message-read', handleMessageRead)

    return () => {
      console.log('🧹 Cleaning up socket listeners')
      socket.off('receive-message', handleReceiveMessage)
      socket.off('user-typing', handleUserTyping)
      socket.off('message-read', handleMessageRead)
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
        if (socket && selectedUserId) {
          socket.emit('typing', {
            senderId: user?.id,
            receiverId: selectedUserId,
            isTyping: false,
          })
        }
      }, 2000)

      setTypingTimeout(timeout)
    }
  }

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout)
      }
    }
  }, [typingTimeout])

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

    // Clear typing timeout and send stop typing event immediately
    if (typingTimeout) {
      clearTimeout(typingTimeout)
      setTypingTimeout(null)
    }
    if (socket && selectedUserId && selectedUserId !== 'ai-assistant') {
      socket.emit('typing', {
        senderId: user?.id,
        receiverId: selectedUserId,
        isTyping: false,
      })
    }

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

  // Helper function to check if message is from today
  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  // Helper function to format date for separator
  const formatDateSeparator = (date: Date) => {
    if (isToday(date)) return 'Today'
    
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    if (
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()
    ) {
      return 'Yesterday'
    }
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  // Group messages by date
  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { date: string; messages: Message[] }[] = []
    let currentDate = ''
    
    messages.forEach((message) => {
      const messageDate = new Date(message.createdAt)
      const dateStr = messageDate.toDateString()
      
      if (dateStr !== currentDate) {
        currentDate = dateStr
        groups.push({
          date: formatDateSeparator(messageDate),
          messages: [message],
        })
      } else {
        groups[groups.length - 1].messages.push(message)
      }
    })
    
    return groups
  }

  if (!selectedUserId) {
    return (
      <div className="flex-1 bg-white rounded-2xl p-4 flex items-center justify-center bg-gray-50">
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
    <div className="flex-1 flex flex-col bg-white rounded-2xl md:p-2 shadow-sm overflow-hidden h-full">
      {/* Chat Header */}
      <div 
        className="flex items-center justify-between bg-white"
        style={{
          height: '60px',
          gap: '12px',
          paddingTop: '4px',
          paddingRight: '12px',
          paddingBottom: '16px',
          paddingLeft: '12px',
          borderBottom: '1px solid transparent'
        }}
      >
        <div className="flex items-center" style={{ gap: '12px' }}>
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
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '1000px',
                  objectFit: 'cover'
                }}
              />
            ) : (
              <div 
                className="bg-[#1E9A80] flex items-center justify-center text-white font-semibold"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '1000px',
                  fontSize: '14px'
                }}
              >
                {selectedUser?.name?.[0] || 'A'}
              </div>
            )}
            {isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>
          <div 
            className="flex flex-col justify-center"
            style={{
              height: '40px',
              gap: '4px'
            }}
          >
            <h2 
              style={{
                fontWeight: 500,
                fontSize: '14px',
                lineHeight: '20px',
                letterSpacing: '-0.006em',
                color: '#111625'
              }}
            >
              {selectedUser?.name || 'User'}
            </h2>
            <p 
              style={{
                fontWeight: 500,
                fontSize: '12px',
                lineHeight: '16px',
                letterSpacing: '0px',
                color: '#38C793'
              }}
            >
              {isOnline ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>

        <div 
          className="flex items-center"
          style={{
            height: '32px',
            gap: '12px'
          }}
        >
          <button 
            className="hidden md:flex items-center justify-center"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: '1px solid #E8E5DF',
              gap: '4px'
            }}
          >
            <svg
              style={{ width: '20px', height: '20px' }}
              className="text-gray-600"
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
          <button 
            className="hidden md:flex items-center justify-center"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: '1px solid #E8E5DF',
              gap: '4px'
            }}
          >
            <svg
              style={{ width: '20px', height: '20px' }}
              className="text-gray-600"
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
          <button 
            className="hidden md:flex items-center justify-center"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: '1px solid #E8E5DF',
              gap: '4px'
            }}
          >
            <svg
              style={{ width: '20px', height: '20px' }}
              className="text-gray-600"
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
            className="flex items-center justify-center"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: '1px solid #E8E5DF',
              gap: '4px'
            }}
          >
            <svg
              style={{ width: '20px', height: '20px' }}
              className="text-gray-600"
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
      <div 
        className="flex-1 overflow-y-auto" 
        style={{ 
          backgroundColor: '#F3F3EE',
          borderRadius: '16px',
          padding: '12px',
          gap: '12px'
        }}
      >
        {groupMessagesByDate(messages).map((group, groupIndex) => (
          <div key={groupIndex}>
            {/* Date Separator */}
            <div className="flex justify-center my-4">
              <div className="px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full text-xs text-gray-600 font-medium shadow-sm">
                {group.date}
              </div>
            </div>

            {/* Messages for this date */}
            {group.messages.map((message, messageIndex) => {
              const isSent = message.senderId === user?.id
              const showTime = messageIndex === group.messages.length - 1 || 
                (messageIndex < group.messages.length - 1 && 
                 new Date(group.messages[messageIndex + 1].createdAt).getTime() - new Date(message.createdAt).getTime() > 300000)
              
              return (
                <div
                  key={message.id}
                  className={`flex flex-col ${isSent ? 'items-end' : 'items-start'} mb-2`}
                >
                  <div
                    className={`max-w-[70%] ${
                      isSent
                        ? ''
                        : 'bg-white text-[#111625] shadow-sm'
                    }`}
                    style={{
                      padding: '12px',
                      borderTopLeftRadius: '12px',
                      borderTopRightRadius: '12px',
                      borderBottomRightRadius: isSent ? '4px' : '12px',
                      borderBottomLeftRadius: isSent ? '12px' : '4px',
                      backgroundColor: isSent ? '#F0FDF4' : undefined,
                    }}
                  >
                    <p 
                      className="whitespace-pre-wrap break-words"
                      style={{
                        fontSize: '12px',
                        lineHeight: '16px',
                        fontWeight: 400,
                        color: isSent ? '#111625' : '#111625',
                        letterSpacing: '0px'
                      }}
                    >
                      {message.content}
                    </p>
                  </div>
                  {showTime && (
                    <div
                      className={`mt-1 flex items-center gap-1.5`}
                      style={{ 
                        fontSize: '12px',
                        lineHeight: '16px',
                        color: '#8B8B8B',
                        fontWeight: 400
                      }}
                    >
                      {isSent && (
                        <span className="inline-flex items-center">
                          {message.isRead ? (
                            // Double checkmark (read) - #1E9A80
                            <svg
                              width="14"
                              height="10"
                              viewBox="0 0 16 15"
                              fill="none"
                              style={{ color: '#1E9A80' }}
                            >
                              <path
                                d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"
                                fill="currentColor"
                              />
                            </svg>
                          ) : (
                            // Single checkmark (sent) - #8B8B8B
                            <svg
                              width="12"
                              height="10"
                              viewBox="0 0 12 11"
                              fill="none"
                              style={{ color: '#8B8B8B' }}
                            >
                              <path
                                d="M11.01 2.316l-.478-.372a.365.365 0 0 0-.51.063L4.566 8.879a.32.32 0 0 1-.484.033L1.891 6.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"
                                fill="currentColor"
                              />
                            </svg>
                          )}
                        </span>
                      )}
                      <span>
                        {new Date(message.createdAt).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true,
                        })}
                      </span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}
        
        {/* Typing Indicator (for regular users) */}
        {isTyping && selectedUserId !== 'ai-assistant' && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 rounded-lg rounded-bl-none shadow-sm px-4 py-3">
              <div className="flex space-x-1.5">
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
            <div className="bg-white text-gray-800 rounded-lg rounded-bl-none shadow-sm px-4 py-3">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1.5">
                  <div className="w-2 h-2 bg-[#1E9A80] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-[#1E9A80] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-[#1E9A80] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
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
        className="bg-white"
        style={{
          height: '48px',
          gap: '12px',
          paddingTop: '8px',
          borderBottom: '1px solid transparent'
        }}
      >
        <div 
          className="flex items-center"
          style={{
            height: '40px',
            borderRadius: '100px',
            border: '1px solid #E8E5DF',
            gap: '4px',
            paddingTop: '12px',
            paddingRight: '4px',
            paddingBottom: '12px',
            paddingLeft: '16px'
          }}
        >
          <input
            type="text"
            value={newMessage}
            onChange={handleInputChange}
            placeholder="Type any message..."
            className="flex-1 outline-none bg-transparent text-sm"
            style={{
              fontSize: '14px',
              color: '#111625'
            }}
            disabled={loading}
          />
          
          {/* Icons Container */}
          <div 
            className="flex items-center flex-shrink-0"
            style={{
              height: '32px',
              gap: '8px'
            }}
          >
            {/* Microphone Icon */}
            <button
              type="button"
              className="hidden sm:flex items-center justify-center flex-shrink-0"
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '100px',
                padding: '0'
              }}
              title="Voice record"
            >
              <img
                src="/assets/voice_record.svg"
                alt="Voice record"
                style={{ width: '20px', height: '20px' }}
              />
            </button>

            {/* Emoji Icon */}
            <button
              type="button"
              className="hidden sm:flex items-center justify-center flex-shrink-0"
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '100px',
                padding: '0'
              }}
              title="Emoji"
            >
              <img
                src="/assets/happy_mood.svg"
                alt="Emoji"
                style={{ width: '20px', height: '20px' }}
              />
            </button>

            {/* Attachment Icon */}
            <button
              type="button"
              className="hidden md:flex items-center justify-center flex-shrink-0"
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '100px',
                padding: '0'
              }}
              title="Attach file"
            >
              <img
                src="/assets/file.svg"
                alt="Attach file"
                style={{ width: '20px', height: '20px' }}
              />
            </button>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!newMessage.trim() || loading}
              className="flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '100px',
                backgroundColor: '#1E9A80',
                padding: '0',
                gap: '10px'
              }}
              title="Send message"
            >
              <svg
                style={{ width: '20px', height: '20px', transform: 'rotate(45deg)' }}
                className="text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
