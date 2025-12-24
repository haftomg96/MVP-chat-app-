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
            <img
              src="/assets/pencil-plus.svg"
              alt="New Message"
              style={{ width: '18px', height: '18px' }}
            />
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
          className="relative cursor-pointer transition"
          style={{
            height: '80px',
            display: 'flex',
            alignItems: 'center',
            paddingLeft: '24px',
            paddingRight: '24px',
            gap: '12px'
          }}
        >
          {/* Avatar, Name, and Message Container */}
          <div 
            className="flex items-center flex-1"
            style={{
              height: '64px',
              borderRadius: '12px',
              padding: '12px',
              gap: '12px',
              backgroundColor: selectedUserId === 'ai-assistant' ? '#F3F3EE' : (hoveredUserId === 'ai-assistant' ? '#F8F8F5' : 'transparent'),
              transition: 'background-color 0.2s ease',
              minWidth: 0,
              maxWidth: '100%',
              overflow: 'hidden'
            }}
          >
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div 
                className="bg-[#1E9A80] flex items-center justify-center"
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%'
                }}
              >
                <svg
                  className="text-white"
                  style={{ width: '24px', height: '24px' }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
            </div>
            
            {/* Name, Message, and Timestamp */}
            <div 
              className="flex flex-col flex-1 min-w-0"
              style={{
                gap: '4px',
                overflow: 'hidden',
                maxWidth: '100%'
              }}
            >
              {/* Name and Timestamp Row */}
              <div 
                className="flex items-center"
                style={{
                  height: '20px',
                  gap: '8px'
                }}
              >
                <h3 
                  className="truncate flex-1"
                  style={{
                    fontWeight: 500,
                    fontSize: '16px',
                    lineHeight: '20px',
                    letterSpacing: '-0.006em',
                    color: '#09090B'
                  }}
                >
                  AI Assistant
                </h3>
                <span 
                  style={{
                    fontWeight: 400,
                    fontSize: '12px',
                    lineHeight: '16px',
                    letterSpacing: '0px',
                    color: '#A1A1AA',
                    flexShrink: 0
                  }}
                >
                  Online
                </span>
              </div>
              
              {/* Message Row */}
              <div 
                className="flex items-center min-w-0"
                style={{
                  gap: '8px',
                  overflow: 'hidden'
                }}
              >
                <p 
                  style={{
                    fontSize: '14px',
                    lineHeight: '20px',
                    letterSpacing: '0px',
                    color: '#A1A1AA',
                    fontWeight: 400,
                    flex: 1,
                    minWidth: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Chat with AI for help
                </p>
              </div>
            </div>
          </div>

          {/* Archive Button - Right Side (shows on hover) */}
          {hoveredUserId === 'ai-assistant' && (
            <button 
              onClick={(e) => {
                e.stopPropagation()
              }}
              className="bg-[#1E9A80] text-white transition flex flex-col items-center justify-center shadow-lg"
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '12px',
                padding: '12px',
                gap: '8px',
                flexShrink: 0
              }}
            >
              <svg 
                style={{ width: '20px', height: '20px' }}
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              <span 
                style={{
                  fontWeight: 500,
                  fontSize: '12px',
                  lineHeight: '16px',
                  letterSpacing: '0px'
                }}
              >
                Archive
              </span>
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
                  className="w-4 h-4 flex-shrink-0"
                  fill="none"
                  stroke="#404040"
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
                  className="w-full flex items-center space-x-3 px-6 py-3 hover:bg-[#F3F3EE] transition rounded-lg"
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
          className="fixed bg-white shadow-2xl z-50"
          style={{
            left: `${contextMenu.x}px`,
            top: `${contextMenu.y}px`,
            width: '200px',
            height: '264px',
            borderRadius: '16px',
            border: '1px solid #E5E7EB',
            padding: '8px'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="w-full text-left transition flex items-center"
            style={{
              width: '184px',
              height: '32px',
              borderRadius: '8px',
              gap: '10px',
              paddingTop: '6px',
              paddingRight: '8px',
              paddingBottom: '6px',
              paddingLeft: '8px',
              fontWeight: 500,
              fontSize: '14px',
              lineHeight: '20px',
              letterSpacing: '-0.006em',
              color: '#111625'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F3EE'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            onClick={() => {
              // Mark as unread logic
              setContextMenu(null)
            }}
          >
            <div style={{ width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="/assets/mark_as_read.svg" alt="Mark as unread" style={{ width: '12px', height: '12px' }} />
            </div>
            Mark as unread
          </button>
          
          <button
            className="w-full text-left transition flex items-center"
            style={{
              width: '184px',
              height: '32px',
              borderRadius: '8px',
              gap: '10px',
              paddingTop: '6px',
              paddingRight: '8px',
              paddingBottom: '6px',
              paddingLeft: '8px',
              fontWeight: 500,
              fontSize: '14px',
              lineHeight: '20px',
              letterSpacing: '-0.006em',
              color: '#111625'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F3EE'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            onClick={() => {
              // Archive logic
              setContextMenu(null)
            }}
          >
            <div style={{ width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="/assets/archive.svg" alt="Archive" style={{ width: '12px', height: '12px' }} />
            </div>
            Archive
          </button>
          
          <button
            className="w-full text-left transition flex items-center"
            style={{
              width: '184px',
              height: '32px',
              borderRadius: '8px',
              gap: '10px',
              paddingTop: '6px',
              paddingRight: '8px',
              paddingBottom: '6px',
              paddingLeft: '8px',
              fontWeight: 500,
              fontSize: '14px',
              lineHeight: '20px',
              letterSpacing: '-0.006em',
              color: '#111625'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F3EE'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            onClick={() => {
              // Mute logic
              setContextMenu(null)
            }}
          >
            <div style={{ width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="/assets/mute.svg" alt="Mute" style={{ width: '12px', height: '12px' }} />
            </div>
            Mute
            <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <button
            className="w-full text-left transition flex items-center"
            style={{
              width: '184px',
              height: '32px',
              borderRadius: '8px',
              gap: '10px',
              paddingTop: '6px',
              paddingRight: '8px',
              paddingBottom: '6px',
              paddingLeft: '8px',
              fontWeight: 500,
              fontSize: '14px',
              lineHeight: '20px',
              letterSpacing: '-0.006em',
              color: '#111625'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F3EE'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            onClick={() => {
              // Contact info logic
              setContextMenu(null)
            }}
          >
            <div style={{ width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="/assets/contact.svg" alt="Contact info" style={{ width: '12px', height: '12px' }} />
            </div>
            Contact info
          </button>
          
          <button
            className="w-full text-left transition flex items-center"
            style={{
              width: '184px',
              height: '32px',
              borderRadius: '8px',
              gap: '10px',
              paddingTop: '6px',
              paddingRight: '8px',
              paddingBottom: '6px',
              paddingLeft: '8px',
              fontWeight: 500,
              fontSize: '14px',
              lineHeight: '20px',
              letterSpacing: '-0.006em',
              color: '#111625'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F3EE'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            onClick={() => {
              // Export chat logic
              setContextMenu(null)
            }}
          >
            <div style={{ width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="/assets/export.svg" alt="Export chat" style={{ width: '12px', height: '12px' }} />
            </div>
            Export chat
          </button>
          
          <div style={{ borderTop: '1px solid #E5E7EB', margin: '4px 0' }}></div>
          
          <button
            className="w-full text-left transition flex items-center"
            style={{
              width: '184px',
              height: '32px',
              borderRadius: '8px',
              gap: '10px',
              paddingTop: '6px',
              paddingRight: '8px',
              paddingBottom: '6px',
              paddingLeft: '8px',
              fontWeight: 500,
              fontSize: '14px',
              lineHeight: '20px',
              letterSpacing: '-0.006em',
              color: '#111625'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F3EE'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            onClick={() => {
              // Clear chat logic
              setContextMenu(null)
            }}
          >
            <div style={{ width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="/assets/clear.svg" alt="Clear chat" style={{ width: '12px', height: '12px' }} />
            </div>
            Clear chat
          </button>
          
          <button
            className="w-full text-left transition flex items-center"
            style={{
              width: '184px',
              height: '32px',
              borderRadius: '8px',
              gap: '10px',
              paddingTop: '6px',
              paddingRight: '8px',
              paddingBottom: '6px',
              paddingLeft: '8px',
              fontWeight: 500,
              fontSize: '14px',
              lineHeight: '20px',
              letterSpacing: '-0.006em',
              color: '#EF4444'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F3EE'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            onClick={() => {
              // Delete chat logic
              setContextMenu(null)
            }}
          >
            <div style={{ width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="/assets/delete.svg" alt="Delete chat" style={{ width: '12px', height: '12px' }} />
            </div>
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
      className="relative cursor-pointer transition"
      style={{
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '24px',
        paddingRight: '24px',
        gap: '12px'
      }}
    >
      {/* Avatar, Name, and Message Container */}
      <div 
        className="flex items-center flex-1"
        style={{
          height: '64px',
          borderRadius: '12px',
          padding: '12px',
          gap: '12px',
          backgroundColor: isSelected ? '#F3F3EE' : (isHovered ? '#F8F8F5' : 'transparent'),
          transition: 'background-color 0.2s ease',
          minWidth: 0,
          maxWidth: '100%',
          overflow: 'hidden'
        }}
      >
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          {user.picture ? (
            <img
              src={user.picture}
              alt={user.name || 'User'}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                objectFit: 'cover'
              }}
            />
          ) : (
            <div 
              className="bg-[#1E9A80] flex items-center justify-center text-white font-semibold"
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                fontSize: '16px'
              }}
            >
              {user.name?.[0] || user.email[0]} 
            </div>
          )}
        </div>
        
        {/* Name, Message, and Timestamp */}
        <div 
          className="flex flex-col flex-1 min-w-0"
          style={{
            gap: '4px',
            overflow: 'hidden',
            maxWidth: '100%'
          }}
        >
          {/* Name and Timestamp Row */}
          <div 
            className="flex items-center"
            style={{
              height: '20px',
              gap: '8px'
            }}
          >
            <h3 
              className="truncate flex-1"
              style={{
                fontWeight: 500,
                fontSize: '16px',
                lineHeight: '20px',
                letterSpacing: '-0.006em',
                color: '#09090B'
              }}
            >
              {user.name || user.email}
            </h3>
            <span 
              style={{
                fontWeight: 400,
                fontSize: '12px',
                lineHeight: '16px',
                letterSpacing: '0px',
                color: '#A1A1AA',
                flexShrink: 0
              }}
            >
              {timeAgo}
            </span>
          </div>
          
          {/* Message and Check Icon Row */}
          <div 
            className="flex items-center min-w-0"
            style={{
              gap: '8px',
              overflow: 'hidden'
            }}
          >
            <p 
              style={{
                fontSize: '14px',
                lineHeight: '20px',
                letterSpacing: '0px',
                color: '#A1A1AA',
                fontWeight: 400,
                flex: 1,
                minWidth: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {lastMessage?.content || 'No messages yet'}
            </p>
            {isSentByMe && lastMessage && (
              <span 
                className="flex-shrink-0"
                style={{
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {lastMessage.isRead ? (
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
          </div>
        </div>
      </div>

      {/* Archive Button - Right Side (shows on hover) */}
      {isHovered && (
        <button 
          onClick={(e) => {
            e.stopPropagation()
          }}
          className="bg-[#1E9A80] text-white transition flex flex-col items-center justify-center shadow-lg"
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '12px',
            padding: '12px',
            gap: '8px',
            flexShrink: 0
          }}
        >
          <svg 
            style={{ width: '20px', height: '20px' }}
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M5 4a2 2 0 100 4h14a2 2 0 100-4H5z" />
            <path fillRule="evenodd" d="M4 9h16v9a2 2 0 01-2 2H6a2 2 0 01-2-2V9zm6 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
          <span 
            style={{
              fontWeight: 500,
              fontSize: '12px',
              lineHeight: '16px',
              letterSpacing: '0px'
            }}
          >
            Archive
          </span>
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
