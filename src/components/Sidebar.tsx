'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { useChatStore } from '@/store/useChatStore'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface User {
  id: string
  email: string
  name: string | null
  picture: string | null
}

export default function Sidebar() {
  const { token, user, logout } = useAuthStore()
  const { selectedUserId, setSelectedUser, onlineUsers } = useChatStore()
  const [users, setUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showMenu, setShowMenu] = useState(false)
  const [showNewMessage, setShowNewMessage] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (token) {
      fetchUsers()
    }
  }, [token])

  const fetchUsers = async () => {
    try {
      console.log('🔍 Fetching users with token:', token ? 'Token exists' : 'No token')
      const res = await fetch('/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      })
      console.log('📡 Response status:', res.status)
      if (res.ok) {
        const data = await res.json()
        console.log('✅ Fetched users:', data)
        setUsers(data)
      } else {
        console.error('❌ Failed to fetch users:', res.status, res.statusText)
      }
    } catch (error) {
      console.error('❌ Failed to fetch users:', error)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/auth')
  }

  const filteredUsers = users.filter((u) =>
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const onlineUsersList = filteredUsers.filter((u) => onlineUsers.has(u.id))
  const offlineUsersList = filteredUsers.filter((u) => !onlineUsers.has(u.id))

  return (
    <div className="w-[400px] bg-white flex flex-col rounded-3xl ml-0 mr-3 my-3 shadow-sm relative">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">All Message</h2>
          <button
            onClick={() => setShowNewMessage(!showNewMessage)}
            className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-dark transition flex items-center space-x-1.5"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>New Message</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="relative flex items-center space-x-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search in message"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
            />
            <svg
              className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
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
          <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
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
          onClick={() => setSelectedUser('ai-assistant')}
          className={`flex items-center space-x-3 p-4 cursor-pointer hover:bg-gray-50 transition ${
            selectedUserId === 'ai-assistant' ? 'bg-teal-50' : ''
          }`}
        >
          <div className="relative">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
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
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900 truncate">
                AI Assistant
              </h3>
              <span className="text-[11px] text-gray-500">Online</span>
            </div>
            <p className="text-[13px] text-gray-500 truncate leading-relaxed">
              Chat with AI for help
            </p>
          </div>
        </div>

        {/* Online Users */}
        {onlineUsersList.length > 0 && (
          <>
            <div className="px-4 py-2 bg-gray-50">
              <span className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">
                Online ({onlineUsersList.length})
              </span>
            </div>
            {onlineUsersList.map((u) => (
              <UserItem
                key={u.id}
                user={u}
                isOnline={true}
                isSelected={selectedUserId === u.id}
                onClick={() => setSelectedUser(u.id)}
              />
            ))}
          </>
        )}

        {/* Offline Users */}
        {offlineUsersList.length > 0 && (
          <>
            <div className="px-4 py-2 bg-gray-50">
              <span className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">
                Offline ({offlineUsersList.length})
              </span>
            </div>
            {offlineUsersList.map((u) => (
              <UserItem
                key={u.id}
                user={u}
                isOnline={false}
                isSelected={selectedUserId === u.id}
                onClick={() => setSelectedUser(u.id)}
              />
            ))}
          </>
        )}
      </div>

      {/* New Message Modal - Dropdown style */}
      {showNewMessage && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-20 z-40"
            onClick={() => setShowNewMessage(false)}
          ></div>
          
          {/* Modal positioned at top of sidebar */}
          <div className="absolute top-[88px] left-6 right-6 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 max-h-[500px] flex flex-col">
            {/* New Message Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900">New Message</h3>
              <button
                onClick={() => setShowNewMessage(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Search in New Message */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search name or email"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                />
                <svg
                  className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
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
            </div>

            {/* User List for New Message */}
            <div className="flex-1 overflow-y-auto">
              {filteredUsers.map((u) => (
                <button
                  key={u.id}
                  onClick={() => {
                    setSelectedUser(u.id)
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
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {u.name?.[0] || u.email[0]}
                      </div>
                    )}
                    {onlineUsers.has(u.id) && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
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
        </>
      )}
    </div>
  )
}

function UserItem({
  user,
  isOnline,
  isSelected,
  onClick,
}: {
  user: User
  isOnline: boolean
  isSelected: boolean
  onClick: () => void
}) {
  const [showContextMenu, setShowContextMenu] = useState(false)
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    setContextMenuPosition({ x: e.clientX, y: e.clientY })
    setShowContextMenu(true)
  }

  useEffect(() => {
    const handleClickOutside = () => setShowContextMenu(false)
    if (showContextMenu) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showContextMenu])

  return (
    <>
      <div
        onClick={onClick}
        onContextMenu={handleContextMenu}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`flex items-center space-x-3 p-4 cursor-pointer hover:bg-gray-50 transition relative ${
          isSelected ? 'bg-teal-50' : ''
        }`}
      >
        {/* Unread Badge - appears on hover on the LEFT */}
        {isHovered && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-primary text-white px-2 py-1 rounded-md text-xs font-medium z-10">
            Unread
          </div>
        )}

        <div className={`relative ${isHovered ? 'opacity-0' : 'opacity-100'} transition-opacity`}>
          {user.picture ? (
            <img
              src={user.picture}
              alt={user.name || 'User'}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
              {user.name?.[0] || user.email[0]}
            </div>
          )}
          {isOnline && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 truncate">
              {user.name || user.email}
            </h3>
            {!isHovered && (
              <span className="text-[11px] text-gray-500">
                3 mins ago
              </span>
            )}
          </div>
          <p className="text-[13px] text-gray-500 truncate leading-relaxed">Last message preview...</p>
        </div>

        {/* Archive Button - appears on hover on the RIGHT */}
        {isHovered && (
          <button 
            onClick={(e) => {
              e.stopPropagation()
              // Archive action
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-primary text-white p-2 rounded-lg hover:bg-primary-dark transition z-10"
            title="Archive"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </button>
        )}
      </div>

      {/* Context Menu */}
      {showContextMenu && (
        <div
          className="fixed bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 min-w-[200px]"
          style={{
            top: `${contextMenuPosition.y}px`,
            left: `${contextMenuPosition.x}px`,
          }}
        >
          <button className="w-full text-left px-4 py-2.5 hover:bg-gray-50 transition flex items-center space-x-3 text-[13px] text-gray-700">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>Mark as unread</span>
          </button>
          
          <button className="w-full text-left px-4 py-2.5 hover:bg-gray-50 transition flex items-center space-x-3 text-[13px] text-gray-700">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            <span>Archive</span>
          </button>

          <button className="w-full text-left px-4 py-2.5 hover:bg-gray-50 transition flex items-center space-x-3 text-[13px] text-gray-700">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
            <span>Mute</span>
            <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button className="w-full text-left px-4 py-2.5 hover:bg-gray-50 transition flex items-center space-x-3 text-[13px] text-gray-700">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Contact info</span>
          </button>

          <div className="my-1 border-t border-gray-200"></div>

          <button className="w-full text-left px-4 py-2.5 hover:bg-gray-50 transition flex items-center space-x-3 text-[13px] text-gray-700">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span>Export chat</span>
          </button>

          <button className="w-full text-left px-4 py-2.5 hover:bg-gray-50 transition flex items-center space-x-3 text-[13px] text-gray-700">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>Clear chat</span>
          </button>

          <div className="my-1 border-t border-gray-200"></div>

          <button className="w-full text-left px-4 py-2.5 hover:bg-red-50 transition flex items-center space-x-3 text-[13px] text-red-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Delete chat</span>
          </button>
        </div>
      )}
    </>
  )
}
