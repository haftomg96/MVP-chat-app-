'use client'

import { useState } from 'react'
import { useAuthStore } from '@/store/useAuthStore'

export default function LeftNavbar() {
  const { user } = useAuthStore()
  const [showProfileModal, setShowProfileModal] = useState(false)

  return (
    <>
      <div className="w-[76px] bg-[#F3F3EE] flex flex-col items-center py-6 px-4 justify-between">
        {/* Logo - Click to open profile modal */}
        <button 
          onClick={() => setShowProfileModal(!showProfileModal)}
          className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary-dark transition cursor-pointer"
        >
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
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </button>

      {/* Navigation Icons */}
      <nav className="flex-1 flex flex-col items-center space-y-4 mt-4">
        {/* Home */}
        <button className="p-3 hover:bg-gray-200 rounded-lg transition text-gray-700">
          <svg
            className="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
        </button>

        {/* Messages - Active */}
        <button className="p-3 bg-teal-50 rounded-lg transition text-primary relative">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </button>

        {/* Compass/Explore */}
        <button className="p-3 hover:bg-gray-200 rounded-lg transition text-gray-600">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
            />
          </svg>
        </button>

        {/* Folder/Files */}
        <button className="p-3 hover:bg-gray-200 rounded-lg transition text-gray-600">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
            />
          </svg>
        </button>

        {/* Settings */}
        <button className="p-3 hover:bg-gray-200 rounded-lg transition text-gray-600">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
      </nav>

      {/* Bottom Icons */}
      <div className="flex flex-col items-center space-y-4">
        {/* Expand */}
        <button className="p-3 hover:bg-gray-200 rounded-lg transition text-gray-600">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
            />
          </svg>
        </button>

        {/* User Avatar - Display only */}
        <div className="relative">
          {user?.picture ? (
            <img
              src={user.picture}
              alt={user.name || 'User'}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white text-xs font-semibold">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : user?.email?.slice(0, 2).toUpperCase() || 'U'}
            </div>
          )}
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
        </div>
      </div>
    </div>

    {/* Profile Modal */}
    {showProfileModal && (
      <div className="fixed left-[76px] top-6 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 z-50 max-h-[calc(100vh-3rem)] overflow-y-auto">
        {/* Back to Dashboard */}
        <button className="w-full text-left px-3 py-2.5 hover:bg-gray-50 rounded-lg transition flex items-center space-x-3 text-sm text-gray-700 mb-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Go back to dashboard</span>
        </button>

        {/* Rename File */}
        <button className="w-full text-left px-3 py-2.5 hover:bg-gray-50 rounded-lg transition flex items-center space-x-3 text-sm text-gray-700 mb-4">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span>Rename file</span>
        </button>

        {/* User Info */}
        <div className="border-t border-gray-200 pt-4 mb-4">
          <div className="flex items-center space-x-3 mb-3">
            {user?.picture ? (
              <img
                src={user.picture}
                alt={user.name || 'User'}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white text-xs font-semibold">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : user?.email?.slice(0, 2).toUpperCase() || 'U'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">
                {user?.name || 'testing2'}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>

          {/* Credits */}
          <div className="bg-gray-50 rounded-lg p-3 mb-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-500">Credits</span>
              <span className="text-xs text-gray-500">Renews in</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-gray-800">20 left</span>
              <span className="text-sm font-bold text-gray-800">6h 24m</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: '80%' }}></div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">5 of 25 used today</span>
              <span className="text-xs text-primary">+25 tomorrow</span>
            </div>
          </div>
        </div>

        {/* Win Free Credits */}
        <button className="w-full text-left px-3 py-2.5 hover:bg-gray-50 rounded-lg transition flex items-center space-x-3 text-sm text-gray-700 mb-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
          </svg>
          <span>Win free credits</span>
        </button>

        {/* Theme Style */}
        <button className="w-full text-left px-3 py-2.5 hover:bg-gray-50 rounded-lg transition flex items-center space-x-3 text-sm text-gray-700 mb-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
          <span>Theme Style</span>
        </button>

        {/* Log Out */}
        <div className="border-t border-gray-200 pt-2 mt-2">
          <button 
            onClick={() => {
              useAuthStore.getState().logout()
              window.location.href = '/auth'
            }}
            className="w-full text-left px-3 py-2.5 hover:bg-red-50 rounded-lg transition flex items-center space-x-3 text-sm text-red-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Log out</span>
          </button>
        </div>
      </div>
    )}
    </>
  )
}
