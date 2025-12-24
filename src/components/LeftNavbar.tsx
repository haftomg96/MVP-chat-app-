'use client'

import { useState } from 'react'
import { useAuthStore } from '@/store/useAuthStore'

export default function LeftNavbar() {
  const { user } = useAuthStore()
  const [showProfileModal, setShowProfileModal] = useState(false)

  return (
    <>
      <div className="w-20 bg-[#F5F5F0] flex flex-col items-center h-screen relative">
        {/* Logo - Top */}
        <div className="pt-6">
          <button 
            onClick={() => setShowProfileModal(!showProfileModal)}
            className="w-12 h-12 bg-[#1E9A80] rounded-full flex items-center justify-center hover:bg-[#1E9A80] transition cursor-pointer shadow-sm"
          >
            <svg
              className="w-7 h-7 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </button>
        </div>

        {/* Navigation Icons - Aligned with "All Message" */}
        <nav className="flex flex-col items-center space-y-6 absolute top-[88px]">
          {/* Home */}
          <button className="p-2.5 hover:bg-gray-200/50 rounded-xl transition text-gray-700">
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
          </button>

          {/* Messages - Active */}
          <button className="p-3 bg-white border-2 border-primary rounded-xl transition text-primary relative shadow-sm">
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
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </button>

          {/* Compass/Explore */}
          <button className="p-2.5 hover:bg-gray-200/50 rounded-xl transition text-gray-600">
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
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>

          {/* Folder/Files */}
          <button className="p-2.5 hover:bg-gray-200/50 rounded-xl transition text-gray-600">
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

          {/* Document/Notes */}
          <button className="p-2.5 hover:bg-gray-200/50 rounded-xl transition text-gray-600">
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </button>
        </nav>

        {/* Bottom Icons */}
        <div className="flex flex-col items-center space-y-6 absolute bottom-6">
          {/* Sparkle/Star Icon */}
          <button className="p-2.5 hover:bg-gray-200/50 rounded-xl transition text-gray-600">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
              />
            </svg>
          </button>

          {/* User Avatar */}
          <div className="relative">
            {user?.picture ? (
              <img
                src={user.picture}
                alt={user.name || 'User'}
                className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm"
              />
            ) : (
              <div className="w-11 h-11 bg-[#1E9A80] rounded-full flex items-center justify-center text-white text-sm font-semibold border-2 border-white shadow-sm">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : user?.email?.slice(0, 2).toUpperCase() || 'U'}
              </div>
            )}
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-[#F5F5F0] rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-20 z-40"
            onClick={() => setShowProfileModal(false)}
          ></div>

          {/* Modal */}
          <div 
            className="fixed bg-white shadow-2xl border border-gray-100 z-50"
            style={{
              left: '12px',
              top: '74px',
              width: '297px',
              borderRadius: '16px',
              gap: '4px',
              padding:"12px"
            }}
          >
            {/* Go back to dashboard and Rename file section */}
            <div 
              style={{
                width: '287px',
                height: '92px',
                gap: '8px',
                paddingRight: '10px',
                paddingLeft: '10px',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Go back to dashboard */}
              <button 
                onClick={() => setShowProfileModal(false)}
                className="flex items-center transition"
                style={{
                  borderRadius: '8px',
                  padding: '6px',
                  gap: '8px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F3EE'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div 
                  className="flex items-center justify-center"
                  style={{
                    borderRadius: '6px',
                    backgroundColor: '#F3F3EE',
                    padding: '6px'
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </div>
                <span 
                  style={{
                    fontWeight: 500,
                    fontSize: '14px',
                    lineHeight: '20px',
                    letterSpacing: '-0.01em',
                    color: '#09090B'
                  }}
                >
                  Go back to dashboard
                </span>
              </button>

              {/* Rename file */}
              <button 
                className="flex items-center transition"
                style={{
                  width: '267px',
                  height: '40px',
                  borderRadius: '8px',
                  padding: '6px',
                  gap: '8px',
                  backgroundColor: '#F8F8F5'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F3EE'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F8F8F5'}
              >
                <div 
                  className="flex items-center justify-center"
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    backgroundColor: '#F3F3EE',
                    padding: '6px'
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <span 
                  style={{
                    fontWeight: 500,
                    fontSize: '14px',
                    lineHeight: '20px',
                    letterSpacing: '-0.01em',
                    color: '#09090B'
                  }}
                >
                  Rename file
                </span>
              </button>
            </div>

            {/* Name and Email section */}
            <div 
              className="flex items-center"
              style={{
                width: '307px',
                height: '56px',
                gap: '8px',
                paddingRight: '4px',
                paddingLeft: '4px'
              }}
            >
              {user?.picture ? (
                <img
                  src={user.picture}
                  alt={user.name || 'User'}
                  className="rounded-full object-cover"
                  style={{
                    width: '40px',
                    height: '40px'
                  }}
                />
              ) : (
                <div 
                  className="bg-[#1E9A80] flex items-center justify-center text-white font-semibold"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    fontSize: '14px'
                  }}
                >
                  {user?.name ? user.name.slice(0, 2).toUpperCase() : user?.email?.slice(0, 2).toUpperCase() || 'U'}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p 
                  className="truncate"
                  style={{
                    fontWeight: 600,
                    fontSize: '14px',
                    lineHeight: '20px',
                    letterSpacing: '-0.01em',
                    color: '#1C1C1C'
                  }}
                >
                  {user?.name || 'User'}
                </p>
                <p 
                  className="truncate"
                  style={{
                    fontWeight: 400,
                    fontSize: '12px',
                    lineHeight: '150%',
                    letterSpacing: '-0.01em',
                    color: '#8B8B8B'
                  }}
                >
                  {user?.email}
                </p>
              </div>
            </div>

            {/* Credit section */}
            <div 
              style={{
                width: '307px',
                height: '108px',
                gap: '8px',
                paddingRight: '4px',
                paddingLeft: '4px',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Credits and Renews */}
              <div 
                style={{
                  width: '271px',
                  height: '40px',
                  gap: '8px',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div className="flex justify-between items-center">
                  <span 
                    style={{
                      fontWeight: 400,
                      fontSize: '12px',
                      color: '#8B8B8B'
                    }}
                  >
                    Credits
                  </span>
                  <span 
                    style={{
                      fontWeight: 400,
                      fontSize: '12px',
                      color: '#8B8B8B'
                    }}
                  >
                    Renews in
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span 
                    style={{
                      fontWeight: 700,
                      fontSize: '16px',
                      color: '#1C1C1C'
                    }}
                  >
                    20 left
                  </span>
                  <span 
                    style={{
                      fontWeight: 700,
                      fontSize: '16px',
                      color: '#1C1C1C'
                    }}
                  >
                    6h 24m
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div 
                style={{
                  width: '271px',
                  height: '36px',
                  gap: '8px',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div className="w-full bg-gray-200 rounded-full" style={{ height: '8px' }}>
                  <div 
                    className="rounded-full transition-all" 
                    style={{ 
                      width: '80%',
                      height: '8px',
                      backgroundColor: '#1E9A80'
                    }}
                  ></div>
                </div>
                <div className="flex justify-between items-center">
                  <span 
                    style={{
                      fontWeight: 400,
                      fontSize: '12px',
                      color: '#8B8B8B'
                    }}
                  >
                    5 of 25 used today
                  </span>
                  <span 
                    style={{
                      fontWeight: 500,
                      fontSize: '12px',
                      color: '#1E9A80'
                    }}
                  >
                    +25 tomorrow
                  </span>
                </div>
              </div>
            </div>

            {/* Win Free Credits */}
            <button 
              className="w-full text-left px-3 py-2.5 rounded-xl transition flex items-center space-x-3 text-sm text-gray-700 mb-2"
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F3EE'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
              <span>Win free credits</span>
            </button>

            {/* Theme Style */}
            <button 
              className="w-full text-left px-3 py-2.5 rounded-xl transition flex items-center space-x-3 text-sm text-gray-700 mb-2"
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F3EE'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              <span>Theme Style</span>
            </button>

            {/* Log Out */}
            <div className="border-t border-gray-200 pt-3 mt-3">
              <button 
                onClick={() => {
                  useAuthStore.getState().logout()
                  window.location.href = '/auth'
                }}
                className="w-full text-left px-3 py-2.5 hover:bg-red-50 rounded-xl transition flex items-center space-x-3 text-sm text-red-600 font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Log out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}
