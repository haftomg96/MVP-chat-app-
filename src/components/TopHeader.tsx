'use client'

import { useState } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { useRouter } from 'next/navigation'

export default function TopHeader() {
  const { user, logout } = useAuthStore()
  const [showMenu, setShowMenu] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/auth')
  }

  return (
    <div className="h-16 bg-white md:rounded-2xl md:mx-3 md:mt-3 flex items-center justify-between px-6 gap-6 shadow-sm border-b border-gray-100">
      {/* Left - Message Title */}
      <div className="flex items-center space-x-2.5">
        <img
          src="/assets/message_header.svg"
          alt="Message"
          style={{ width: '20px', height: '20px' }}
        />
        <h1 className="text-base font-medium text-gray-900">Message</h1>
      </div>

      {/* Right - Search Bar, Icons and Profile */}
      <div className="flex items-center space-x-3">
        {/* Search Bar */}
        <div className="relative hidden lg:block">
          <svg
            className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search"
            className="outline-none text-sm text-gray-700 placeholder:text-gray-400"
            style={{
              width: '300px',
              height: '32px',
              borderRadius: '10px',
              border: '1px solid #E8E5DF',
              gap: '8px',
              paddingTop: '10px',
              paddingRight: '50px',
              paddingBottom: '10px',
              paddingLeft: '32px'
            }}
          />
          <div 
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-600 font-medium pointer-events-none"
            style={{
              width: '40px',
              height: '24px',
              borderRadius: '6px',
              gap: '4px',
              paddingTop: '5px',
              paddingRight: '6px',
              paddingBottom: '5px',
              paddingLeft: '6px',
              backgroundColor: '#F3F3EE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ⌘+K
          </div>
        </div>

        {/* Search Icon - Hidden on mobile */}
        <button className="hidden md:flex p-2 hover:bg-gray-50 rounded-lg transition">
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>

        {/* Notification */}
        <button 
          className="hidden md:flex items-center justify-center transition hover:bg-gray-50 relative"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            border: '1px solid #E8E5DF',
            gap: '4px'
          }}
        >
          <svg
            className="w-5 h-5 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </button>

        {/* Settings */}
        <button 
          className="hidden md:flex items-center justify-center transition hover:bg-gray-50"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            border: '1px solid #E8E5DF',
            gap: '4px'
          }}
        >
          <svg
            className="w-5 h-5 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>

        {/* Vertical Separator */}
        <div 
          className="hidden md:block"
          style={{
            width: '0px',
            height: '20px',
            borderLeft: '1px solid #E8E5DF'
          }}
        ></div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center hover:bg-gray-50 rounded-lg transition"
            style={{
              width: '56px',
              height: '32px',
              gap: '8px',
              padding: '0'
            }}
          >
            {user?.picture ? (
              <img
                src={user.picture}
                alt={user.name || 'User'}
                className="object-cover"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '1000px'
                }}
              />
            ) : (
              <div 
                className="bg-[#1E9A80] flex items-center justify-center text-white text-sm font-semibold"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '1000px'
                }}
              >
                {user?.name?.[0] || user?.email?.[0] || 'U'}
              </div>
            )}
            <svg
              className="block"
              style={{
                width: '16px',
                height: '16px',
                color: '#262626'
              }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {showMenu && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 z-40"
                onClick={() => setShowMenu(false)}
              ></div>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
                <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">
                  Profile Settings
                </button>
                <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">
                  Preferences
                </button>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition font-medium"
                >
                  Log out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
