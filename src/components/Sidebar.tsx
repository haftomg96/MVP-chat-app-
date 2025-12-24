'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { useChatStore } from '@/store/useChatStore'

interface User {
  id: string
  email: string
  name: string | null
  picture: string | null
}

interface LastMessage {
  content: string
  createdAt: string
  isRead: boolean
  senderId: string
}

export default function Sidebar({ onMobileUserSelect }: { onMobileUserSelect?: () => void }) {
  const { token, user } = useAuthStore()
  const { selectedUserId, setSelectedUser, onlineUsers } = useChatStore()
  const [users, setUsers] = useState<User[]>([])
  const [lastMessages, setLastMessages] = useState<Record<string, LastMessage>>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [showNewMessage, setShowNewMessage] = useState(false)
  const [hoveredUserId, setHoveredUserId] = useState<string | null>(null)
  const [contextMenu, setContextMenu] = useState<{ userId: string; x: number; y: number } | null>(null)

  useEffect(() => {
    if (token) {
      fetchUsers()
      fetchLastMessages()
    }
  }, [token])

  // Close context menu on click outside
  useEffect(() => {
    const handleClick = () => setContextMenu(null)
    if (contextMenu) {
      document.addEventListener('click', handleClick)
      return () => document.removeEventListener('click', handleClick)
    }
  }, [contextMenu])

  // Refresh last messages when selected user changes (after sending a message)
  useEffect(() => {
    if (token && selectedUserId) {
      // Small delay to ensure message is saved
      const timer = setTimeout(() => {
        fetchLastMessages()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [selectedUserId, token])

  const fetchLastMessages = async () => {
    try {
      console.log('📨 Fetching last messages...')
      const res = await fetch('/api/messages/last', {
        headers: { Authorization: `Bearer ${token}` },
      })
      console.log('📨 Last messages response status:', res.status)
      if (res.ok) {
        const data = await res.json()
        console.log('📨 Last messages data:', data)
        setLastMessages(data)
      } else {
        console.error('❌ Failed to fetch last messages:', res.status)
      }
    } catch (error) {
      console.error('❌ Failed to fetch last messages:', error)
    }
  }

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setUsers(data)
      }
    } catch (error) {
      console.error('❌ Failed to fetch users:', error)
    }
  }

  const filteredUsers = users.filter((u) =>
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleUserSelect = (userId: string) => {
    setSelectedUser(userId)
    onMobileUserSelect?.()
  }

  return (
    <div 
      className="w-full md:w-[400px] bg-white flex flex-col md:rounded-3xl md:ml-0 md:mr-3 md:mb-3 shadow-sm relative h-full"
      onContextMenu={(e) => {
        // Only prevent default if not clicking on a user item (let UserItem handle it)
        const target = e.target as HTMLElement
        if (!target.closest('[data-user-item]')) {
          e.preventDefault()
        }
      }}
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold text-gray-900">All Message</h2>
          <button
            onClick={() => setShowNewMessage(!showNewMessage)}
            className="px-4 py-2 bg-[#1E9A80] text-white rounded-xl text-sm font-medium hover:bg-[#1E9A80] transition flex items-center space-x-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
            <span>New Message</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative flex items-center space-x-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search in message"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-white outline-none text-sm text-gray-600 placeholder:text-gray-400"
            />
            <svg
              className="w-5 h-5 text-gray-400 absolute left-3 top-3"
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
          </div>
          <button className="p-2.5 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
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
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto">
        {/* AI Chat Option */}
        <div
          onClick={() => handleUserSelect('ai-assistant')}
          onMouseEnter={() => setHoveredUserId('ai-assistant')}
          onMouseLeave={() => setHoveredUserId(null)}
          className={`relative flex items-center space-x-3 px-6 py-4 cursor-pointer transition ${
            selectedUserId === 'ai-assistant' ? 'bg-gray-50' : 'hover:bg-gray-50'
          }`}
        >
          <div className="relative flex-shrink-0">
            <div className="w-12 h-12 bg-[#1E9A80] rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-semibold text-gray-900 truncate">
                AI Assistant
              </h3>
              {!hoveredUserId && (
                <span className="text-xs text-gray-400">Online</span>
              )}
            </div>
            <p className="text-sm text-gray-500 truncate">
              Chat with AI for help
            </p>
          </div>
          {hoveredUserId === 'ai-assistant' && (
            <button 
              onClick={(e) => {
                e.stopPropagation()
              }}
              className="absolute right-6 top-1/2 -translate-y-1/2 px-3 py-2 bg-[#1E9A80] text-white rounded-lg hover:bg-[#1E9A80] transition flex flex-col items-center justify-center gap-1"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-xs font-medium">Archive</span>
            </button>
          )}
        </div>

        {/* Regular Users */}
        {filteredUsers.map((u) => (
          <UserItem
            key={u.id}
            user={u}
            currentUserId={user?.id || ''}
            lastMessage={lastMessages[u.id]}
            isSelected={selectedUserId === u.id}
            isHovered={hoveredUserId === u.id}
            onHover={() => setHoveredUserId(u.id)}
            onLeave={() => setHoveredUserId(null)}
            onClick={() => handleUserSelect(u.id)}
            onContextMenu={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setContextMenu({ userId: u.id, x: e.clientX, y: e.clientY })
            }}
          />
        ))}
      </div>

      {/* New Message Modal */}
      {showNewMessage && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-20 z-40"
            onClick={() => setShowNewMessage(false)}
          ></div>
          
          <div 
            className="absolute bg-white shadow-2xl z-50 flex flex-col"
            style={{
              top: '70px',
              left: '34px',
              width: '293px',
              height: '440px',
              borderRadius: '16px',
              border: '1px solid #E5E7EB',
              padding: '12px'
            }}
          >
            <div 
              className="flex flex-col"
              style={{
                width: '249px',
                height: '416px',
                gap: '16px'
              }}
            >
              {/* Header */}
              <div 
                className="flex items-center justify-between"
                style={{
                  width: '249px',
                  height: '24px',
                  gap: '10px'
                }}
              >
                <h3 
                  style={{
                    fontWeight: 500,
                    fontSize: '16px',
                    lineHeight: '24px',
                    letterSpacing: '-0.011em',
                    color: '#111625'
                  }}
                >
                  New Message
                </h3>
                <button
                  onClick={() => setShowNewMessage(false)}
                  className="hover:bg-gray-100 rounded-lg transition"
                  style={{
                    width: '20px',
                    height: '20px',
                    padding: '0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Search */}
              <div 
                className="relative flex items-center"
                style={{
                  width: '249px',
                  height: '32px',
                  borderRadius: '10px',
                  border: '1px solid #F3F3EE',
                  gap: '8px',
                  paddingTop: '10px',
                  paddingRight: '4px',
                  paddingBottom: '10px',
                  paddingLeft: '10px'
                }}
              >
                <svg
                  className="w-4 h-4 text-gray-400 flex-shrink-0"
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
                <input
                  type="text"
                  placeholder="Search name or email"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent border-0 outline-none text-sm"
                  style={{
                    fontSize: '12px',
                    padding: '0'
                  }}
                />
              </div>

              {/* Chat Lists */}
              <div 
                className="flex-1 overflow-y-auto"
                style={{
                  width: '249px',
                  gap: '12px'
                }}
              >
              {filteredUsers.map((u) => (
                <button
                  key={u.id}
                  onClick={() => {
                    handleUserSelect(u.id)
                    setShowNewMessage(false)
                  }}
                  className="w-full flex items-center space-x-3 px-6 py-3 hover:bg-gray-50 transition"
                >
                  <div className="relative">
                    {u.picture ? (
                      <img
                        src={u.picture}
                        alt={u.name || 'User'}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-[#1E9A80] rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {u.name?.[0] || u.email[0]}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {u.name || u.email}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{u.email}</p>
                  </div>
                </button>
              ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="fixed bg-white shadow-2xl border border-gray-100 z-50"
          style={{
            left: `${contextMenu.x}px`,
            top: `${contextMenu.y}px`,
            width: '184px',
            borderRadius: '12px',
            padding: '4px',
            gap: '4px',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="w-full text-left transition flex items-center text-sm text-gray-700"
            style={{
              height: '32px',
              borderRadius: '8px',
              gap: '10px',
              paddingTop: '6px',
              paddingRight: '8px',
              paddingBottom: '6px',
              paddingLeft: '8px',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F3EE'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            onClick={() => {
              // Mark as unread logic
              setContextMenu(null)
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Mark as unread
          </button>
          
          <button
            className="w-full text-left transition flex items-center text-sm text-gray-700"
            style={{
              height: '32px',
              borderRadius: '8px',
              gap: '10px',
              paddingTop: '6px',
              paddingRight: '8px',
              paddingBottom: '6px',
              paddingLeft: '8px',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F3EE'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            onClick={() => {
              // Archive logic
              setContextMenu(null)
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            Archive
          </button>
          
          <button
            className="w-full text-left transition flex items-center text-sm text-gray-700"
            style={{
              height: '32px',
              borderRadius: '8px',
              gap: '10px',
              paddingTop: '6px',
              paddingRight: '8px',
              paddingBottom: '6px',
              paddingLeft: '8px',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F3EE'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            onClick={() => {
              // Mute logic
              setContextMenu(null)
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
            Mute
            <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <button
            className="w-full text-left transition flex items-center text-sm text-gray-700"
            style={{
              height: '32px',
              borderRadius: '8px',
              gap: '10px',
              paddingTop: '6px',
              paddingRight: '8px',
              paddingBottom: '6px',
              paddingLeft: '8px',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F3EE'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            onClick={() => {
              // Contact info logic
              setContextMenu(null)
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Contact info
          </button>
          
          <button
            className="w-full text-left transition flex items-center text-sm text-gray-700"
            style={{
              height: '32px',
              borderRadius: '8px',
              gap: '10px',
              paddingTop: '6px',
              paddingRight: '8px',
              paddingBottom: '6px',
              paddingLeft: '8px',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F3EE'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            onClick={() => {
              // Export chat logic
              setContextMenu(null)
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Export chat
          </button>
          
          <div style={{ borderTop: '1px solid #E5E7EB', margin: '4px 0' }}></div>
          
          <button
            className="w-full text-left transition flex items-center text-sm text-gray-700"
            style={{
              height: '32px',
              borderRadius: '8px',
              gap: '10px',
              paddingTop: '6px',
              paddingRight: '8px',
              paddingBottom: '6px',
              paddingLeft: '8px',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F3EE'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            onClick={() => {
              // Clear chat logic
              setContextMenu(null)
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear chat
          </button>
          
          <button
            className="w-full text-left transition flex items-center text-sm text-red-600"
            style={{
              height: '32px',
              borderRadius: '8px',
              gap: '10px',
              paddingTop: '6px',
              paddingRight: '8px',
              paddingBottom: '6px',
              paddingLeft: '8px',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F3EE'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            onClick={() => {
              // Delete chat logic
              setContextMenu(null)
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete chat
          </button>
        </div>
      )}
    </div>
  )
}

function UserItem({
  user,
  currentUserId,
  lastMessage,
  isSelected,
  isHovered,
  onHover,
  onLeave,
  onClick,
  onContextMenu,
}: {
  user: User
  currentUserId: string
  lastMessage?: LastMessage
  isSelected: boolean
  isHovered: boolean
  onHover: () => void
  onLeave: () => void
  onClick: () => void
  onContextMenu: (e: React.MouseEvent) => void
}) {
  const isSentByMe = lastMessage?.senderId === currentUserId
  const hasUnreadMessage = lastMessage && !lastMessage.isRead && !isSentByMe
  const timeAgo = lastMessage ? getTimeAgo(new Date(lastMessage.createdAt)) : '3 mins ago'

  // Debug logging
  if (lastMessage) {
    console.log(`👤 User ${user.name}:`, {
      senderId: lastMessage.senderId,
      currentUserId,
      isSentByMe,
      isRead: lastMessage.isRead,
      hasUnreadMessage,
    })
  }

  return (
    <div
      data-user-item
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onContextMenu={onContextMenu}
      className={`relative flex items-center space-x-3 px-6 py-4 cursor-pointer transition ${
        isSelected ? 'bg-gray-50' : 'hover:bg-gray-50'
      }`}
    >
      {/* Unread Badge - Left Side */}
      {hasUnreadMessage && !isHovered && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#1E9A80] text-white px-3 py-6 rounded-r-xl flex flex-col items-center justify-center gap-1 shadow-md z-10">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
          <span className="text-xs font-medium">Unread</span>
        </div>
      )}

      <div className="relative flex-shrink-0">
        {user.picture ? (
            <img
            src={user.picture}
            alt={user.name || 'User'}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 bg-[#1E9A80] rounded-full flex items-center justify-center text-white font-semibold">
            {user.name?.[0] || user.email[0]} 
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-semibold text-gray-900 truncate">
            {user.name || user.email}
          </h3>
          {!isHovered && (
            <span className="text-xs text-gray-400">{timeAgo}</span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <p className={`text-sm truncate flex-1 ${hasUnreadMessage ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
            {lastMessage?.content || 'No messages yet'}
          </p>
          {!isHovered && isSentByMe && lastMessage && (
            <span className="flex-shrink-0">
              {lastMessage.isRead ? (
                // Double checkmark (read) - colored
                <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M14.707 5.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L8 10.586l5.293-5.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                    opacity="0.6"
                  />
                </svg>
              ) : (
                // Single checkmark (sent) - gray
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </span>
          )}
        </div>
      </div>

      {/* Archive Button - Right Side (shows on hover) */}
      {isHovered && (
        <button 
          onClick={(e) => {
            e.stopPropagation()
          }}
          className="absolute right-6 top-1/2 -translate-y-1/2 px-3 py-2 bg-[#1E9A80] text-white rounded-lg hover:bg-[#1E9A80] transition flex flex-col items-center justify-center gap-1 shadow-md z-10"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
            <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
          <span className="text-xs font-medium">Archive</span>
        </button>
      )}
    </div>
  )
}

function getTimeAgo(date: Date): string {
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInMins = Math.floor(diffInMs / 60000)
  const diffInHours = Math.floor(diffInMs / 3600000)
  const diffInDays = Math.floor(diffInMs / 86400000)

  if (diffInMins < 1) return 'Just now'
  if (diffInMins < 60) return `${diffInMins} mins ago`
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
  return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
}
