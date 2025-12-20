'use client'

import { useEffect, useState } from 'react'
import { useChatStore } from '@/store/useChatStore'
import { useAuthStore } from '@/store/useAuthStore'

export default function ContactInfo({ onClose }: { onClose: () => void }) {
  const { selectedUserId, onlineUsers } = useChatStore()
  const { token } = useAuthStore()
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'media' | 'link' | 'docs'>('media')

  useEffect(() => {
    if (selectedUserId && selectedUserId !== 'ai-assistant') {
      fetchUserDetails()
    } else if (selectedUserId === 'ai-assistant') {
      setUser({
        id: 'ai-assistant',
        name: 'AI Assistant',
        email: 'ai@assistant.com',
        picture: null,
      })
    }
  }, [selectedUserId])

  const fetchUserDetails = async () => {
    try {
      const res = await fetch('/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const users = await res.json()
        const foundUser = users.find((u: any) => u.id === selectedUserId)
        setUser(foundUser)
      }
    } catch (error) {
      console.error('Failed to fetch user details:', error)
    }
  }

  if (!user) return null

  const isOnline =
    selectedUserId === 'ai-assistant' || onlineUsers.has(selectedUserId!)

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full md:w-[450px] bg-white shadow-2xl z-50 flex flex-col animate-slide-in md:rounded-l-3xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Contact Info</h2>
          <button
            onClick={onClose}
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

      {/* User Info */}
      <div className="p-6 text-center border-b border-gray-200">
        <div className="relative inline-block mb-4">
          {user.picture ? (
            <img
              src={user.picture}
              alt={user.name || 'User'}
              className="w-24 h-24 rounded-full object-cover mx-auto"
            />
          ) : (
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-3xl font-semibold mx-auto">
              {user.name?.[0] || 'A'}
            </div>
          )}
          {isOnline && (
            <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
          )}
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-1">
          {user.name || 'User'}
        </h3>
        <p className="text-sm text-gray-500 mb-6">{user.email}</p>

        <div className="flex justify-center space-x-6">
          <button className="flex flex-col items-center space-y-2 hover:opacity-80 transition">
            <div className="w-14 h-14 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center hover:border-gray-300 transition">
              <svg
                className="w-6 h-6 text-gray-700"
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
            </div>
            <span className="text-sm text-gray-700 font-medium">Audio</span>
          </button>
          <button className="flex flex-col items-center space-y-2 hover:opacity-80 transition">
            <div className="w-14 h-14 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center hover:border-gray-300 transition">
              <svg
                className="w-6 h-6 text-gray-700"
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
            </div>
            <span className="text-sm text-gray-700 font-medium">Video</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        <button
          onClick={() => setActiveTab('media')}
          className={`flex-1 py-3 text-sm font-medium transition ${
            activeTab === 'media'
              ? 'text-gray-800 border-b-2 border-gray-800 bg-white'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Media
        </button>
        <button
          onClick={() => setActiveTab('link')}
          className={`flex-1 py-3 text-sm font-medium transition ${
            activeTab === 'link'
              ? 'text-gray-800 border-b-2 border-gray-800 bg-white'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Link
        </button>
        <button
          onClick={() => setActiveTab('docs')}
          className={`flex-1 py-3 text-sm font-medium transition ${
            activeTab === 'docs'
              ? 'text-gray-800 border-b-2 border-gray-800 bg-white'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Docs
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        {activeTab === 'media' && (
          <div className="space-y-4">
            <div className="text-xs text-gray-500 font-medium mb-3">May</div>
            <div className="grid grid-cols-3 gap-2">
              <div className="aspect-square bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 rounded-lg"></div>
              <div className="aspect-square bg-gradient-to-br from-blue-900 via-blue-800 to-teal-700 rounded-lg"></div>
              <div className="aspect-square bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 rounded-lg"></div>
              <div className="aspect-square bg-gradient-to-br from-pink-500 via-purple-600 to-purple-700 rounded-lg"></div>
              <div className="aspect-square bg-gradient-to-br from-orange-400 via-pink-400 to-pink-500 rounded-lg"></div>
              <div className="aspect-square bg-gradient-to-br from-pink-400 via-pink-500 to-red-500 rounded-lg"></div>
            </div>
            
            <div className="text-xs text-gray-500 font-medium mb-3 mt-6">April</div>
            <div className="grid grid-cols-3 gap-2">
              <div className="aspect-square bg-gradient-to-br from-blue-600 via-red-500 to-red-600 rounded-lg"></div>
              <div className="aspect-square bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 rounded-lg"></div>
              <div className="aspect-square bg-gradient-to-br from-cyan-400 via-blue-400 to-blue-500 rounded-lg"></div>
              <div className="aspect-square bg-gradient-to-br from-pink-200 via-pink-300 to-pink-400 rounded-lg"></div>
              <div className="aspect-square bg-gradient-to-br from-red-400 via-orange-400 to-yellow-400 rounded-lg"></div>
            </div>

            <div className="text-xs text-gray-500 font-medium mb-3 mt-6">March</div>
            <div className="grid grid-cols-3 gap-2">
              <div className="aspect-square bg-gradient-to-br from-gray-300 via-gray-400 to-gray-300 rounded-lg"></div>
              <div className="aspect-square bg-gradient-to-br from-yellow-300 via-orange-300 to-pink-300 rounded-lg"></div>
              <div className="aspect-square bg-gradient-to-br from-orange-500 via-yellow-500 to-orange-600 rounded-lg"></div>
              <div className="aspect-square bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-lg"></div>
            </div>
          </div>
        )}

        {activeTab === 'link' && (
          <div className="space-y-3">
            {[
              {
                title: 'https://basecamp.net/',
                desc: 'Discover thousands of premium UI kits, templates, and design resources tailored for modern...',
                color: 'bg-gray-900',
              },
              {
                title: 'https://notion.com/',
                desc: 'A new tool that blends your everyday work apps into one. It\'s the all-in-one workspace for you...',
                color: 'bg-black',
              },
              {
                title: 'https://asana.com/',
                desc: 'Work anytime, anywhere with Asana. Keep remote and distributed teams, and your entire organization, focused...',
                color: 'bg-pink-500',
              },
              {
                title: 'https://trello.com/',
                desc: 'Make the impossible, possible with Trello. The ultimate teamwork project management tool. Start up board in se...',
                color: 'bg-blue-500',
              },
            ].map((link, i) => (
              <div
                key={i}
                className="flex items-start space-x-3 p-3 bg-white rounded-lg hover:bg-gray-100 transition cursor-pointer border border-gray-200"
              >
                <div className={`w-12 h-12 ${link.color} rounded-lg flex-shrink-0 flex items-center justify-center text-white font-bold text-xs`}>
                  {link.title.includes('basecamp') && '⛺'}
                  {link.title.includes('notion') && 'N'}
                  {link.title.includes('asana') && '◉'}
                  {link.title.includes('trello') && '▦'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate mb-1">
                    {link.title}
                  </p>
                  <p className="text-xs text-gray-500 line-clamp-2">{link.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'docs' && (
          <div className="space-y-3">
            {[
              { name: 'Document Requirement.pdf', size: '16 MB', pages: 10, type: 'pdf', color: 'bg-red-500' },
              { name: 'User Flow.pdf', size: '32 MB', pages: 7, type: 'pdf', color: 'bg-red-500' },
              { name: 'Existing App.fig', size: '213 MB', pages: null, type: 'fig', color: 'bg-purple-500' },
              { name: 'Product Illustrations.ai', size: '72 MB', pages: null, type: 'ai', color: 'bg-orange-500' },
              { name: 'Quotation-Hikariworks-May.pdf', size: '329 KB', pages: 2, type: 'pdf', color: 'bg-red-500' },
            ].map((doc, i) => (
              <div
                key={i}
                className="flex items-center space-x-3 p-3 bg-white rounded-lg hover:bg-gray-100 transition cursor-pointer border border-gray-200"
              >
                <div className={`w-12 h-12 ${doc.color} rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                  {doc.type.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate mb-1">
                    {doc.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {doc.pages && `${doc.pages} pages • `}
                    {doc.size} • {doc.type}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  )
}
