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
            className="hover:opacity-80 transition cursor-pointer"
          >
            <img
              src="/assets/Container.svg"
              alt="Logo"
              style={{ width: '44px', height: '44px' }}
            />
          </button>
        </div>

        {/* Navigation Icons - Aligned with "All Message" */}
        <nav className="flex flex-col items-center space-y-6 absolute top-[88px]">
          {/* Home */}
          <button 
            className="transition"
            style={{
              width: '44px',
              height: '44px',
              minWidth: '44px',
              maxWidth: '44px',
              borderRadius: '8px',
              gap: '8px',
              paddingTop: '8px',
              paddingRight: '12px',
              paddingBottom: '8px',
              paddingLeft: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <img
              src="/assets/home.svg"
              alt="Home"
              style={{ width: '20px', height: '20px' }}
            />
          </button>

          {/* Messages - Active */}
          <button 
            className="transition relative"
            style={{
              width: '44px',
              height: '44px',
              minWidth: '44px',
              maxWidth: '44px',
              borderRadius: '8px',
              border: '1px solid #1E9A80',
              gap: '8px',
              paddingTop: '8px',
              paddingRight: '12px',
              paddingBottom: '8px',
              paddingLeft: '12px',
              backgroundColor: '#F0FDF4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <img
              src="/assets/Task Icon.svg"
              alt="Messages"
              style={{ width: '20px', height: '20px' }}
            />
          </button>

          {/* Compass/Explore */}
          <button 
            className="transition"
            style={{
              width: '44px',
              height: '44px',
              minWidth: '44px',
              maxWidth: '44px',
              borderRadius: '8px',
              gap: '8px',
              paddingTop: '8px',
              paddingRight: '12px',
              paddingBottom: '8px',
              paddingLeft: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <img
              src="/assets/Compass.svg"
              alt="Explore"
              style={{ width: '20px', height: '20px' }}
            />
          </button>

          {/* Folder/Files */}
          <button 
            className="transition"
            style={{
              width: '44px',
              height: '44px',
              minWidth: '44px',
              maxWidth: '44px',
              borderRadius: '8px',
              gap: '8px',
              paddingTop: '8px',
              paddingRight: '12px',
              paddingBottom: '8px',
              paddingLeft: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <img
              src="/assets/Folder.svg"
              alt="Folders"
              style={{ width: '20px', height: '20px' }}
            />
          </button>

          {/* Document/Notes */}
          <button 
            className="transition"
            style={{
              width: '44px',
              height: '44px',
              minWidth: '44px',
              maxWidth: '44px',
              borderRadius: '8px',
              gap: '8px',
              paddingTop: '8px',
              paddingRight: '12px',
              paddingBottom: '8px',
              paddingLeft: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <img
              src="/assets/image.svg"
              alt="Documents"
              style={{ width: '20px', height: '20px' }}
            />
          </button>
        </nav>

        {/* Bottom Icons */}
        <div className="flex flex-col items-center space-y-6 absolute bottom-6">
          {/* Sparkle/Star Icon */}
          <button className="p-2.5 hover:bg-gray-200/50 rounded-xl transition text-gray-600">
            <img
              src="/assets/StarFour.svg"
              alt="Star"
              style={{ width: '20px', height: '20px' }}
            />
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
              width: '307px',
              height: '428px',
              borderRadius: '16px',
              gap: '4px',
              paddingTop: '4px',
              paddingBottom: '0px'
            }}
          >
            {/* Go back to dashboard and Rename file section */}
            <div 
              style={{
                width: '307px',
                height: '92px',
                gap: '8px',
                paddingRight: '4px',
                paddingLeft: '4px',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Go back to dashboard */}
              <button 
                onClick={() => setShowProfileModal(false)}
                className="flex items-center transition"
                style={{
                  width: '287px',
                  height: '40px',
                  borderRadius: '8px',
                  padding: '6px',
                  gap: '8px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F3EE'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div 
                  style={{
                    width: '275px',
                    height: '28px',
                    gap: '8px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <div 
                    className="flex items-center justify-center"
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      backgroundColor: '#F3F3EE',
                      padding: '6px',
                      gap: '10px'
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
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
                </div>
              </button>

              {/* Rename file */}
              <button 
                className="flex items-center transition"
                style={{
                  width: '287px',
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
                  style={{
                    width: '275px',
                    height: '28px',
                    gap: '8px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <div 
                    className="flex items-center justify-center"
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      backgroundColor: '#FFFFFF',
                      padding: '6px',
                      gap: '10px'
                    }}
                  >
                    <img
                      src="/assets/Pencil.svg"
                      alt="Rename"
                      style={{ width: '16px', height: '16px' }}
                    />
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
                </div>
              </button>
            </div>

            {/* Separator Line */}
            <div 
              style={{
                width: '307px',
                height: '0px',
                gap: '8px',
                paddingRight: '10px',
                paddingLeft: '10px'
              }}
            >
              <div 
                style={{
                  width: '287px',
                  height: '1px',
                  backgroundColor: '#E8E5DF'
                }}
              ></div>
            </div>

            {/* Name and Email section */}
            <div 
              style={{
                width: '307px',
                height: '56px',
                gap: '8px',
                paddingRight: '4px',
                paddingLeft: '4px'
              }}
            >
              <div 
                className="flex items-center"
                style={{
                  width: '299px',
                  height: '56px',
                  borderRadius: '8px',
                  padding: '8px',
                  gap: '12px'
                }}
              >
                <div 
                  className="flex-1 min-w-0"
                  style={{
                    width: '283px',
                    height: '40px',
                    gap: '2px',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
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
            </div>

            {/* Credit section */}
            <div 
              style={{
                width: '307px',
                height: '108px',
                gap: '8px'
              }}
            >
              <div 
                style={{
                  width: '307px',
                  height: '100px',
                  gap: '8px',
                  paddingRight: '10px',
                  paddingLeft: '10px'
                }}
              >
                <div 
                  style={{
                    width: '287px',
                    height: '100px',
                    borderRadius: '8px',
                    padding: '8px',
                    gap: '8px',
                    backgroundColor: '#F8F8F5',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  {/* Credits, 20 left, Renews in, 6h 24m */}
                  <div 
                    style={{
                      width: '271px',
                      height: '40px',
                      gap: '8px',
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}
                  >
                    {/* Credits and 20 left */}
                    <div 
                      style={{
                        width: '131.5px',
                        height: '40px',
                        gap: '2px',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      <span 
                        style={{
                          fontWeight: 400,
                          fontSize: '12px',
                          lineHeight: '18px',
                          letterSpacing: '0%',
                          color: '#8B8B8B'
                        }}
                      >
                        Credits
                      </span>
                      <span 
                        style={{
                          fontWeight: 500,
                          fontSize: '14px',
                          lineHeight: '20px',
                          letterSpacing: '0%',
                          color: '#09090B'
                        }}
                      >
                        20 left
                      </span>
                    </div>

                    {/* Renews in and 6h 24m */}
                    <div 
                      style={{
                        width: '131.5px',
                        height: '40px',
                        gap: '2px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end'
                      }}
                    >
                      <span 
                        style={{
                          fontWeight: 400,
                          fontSize: '12px',
                          lineHeight: '18px',
                          letterSpacing: '0%',
                          textAlign: 'right',
                          color: '#8B8B8B'
                        }}
                      >
                        Renews in
                      </span>
                      <span 
                        style={{
                          fontWeight: 500,
                          fontSize: '14px',
                          lineHeight: '20px',
                          letterSpacing: '0%',
                          textAlign: 'right',
                          color: '#09090B'
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
                    {/* Progress bar itself */}
                    <div 
                      style={{
                        width: '271px',
                        height: '8px',
                        borderRadius: '4px',
                        backgroundColor: '#E8E5DF',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      <div 
                        style={{
                          width: '169px',
                          height: '8px',
                          borderRadius: '4px',
                          backgroundColor: '#1E9A80'
                        }}
                      ></div>
                    </div>

                    {/* 5 of 25 used today and +25 tomorrow */}
                    <div 
                      style={{
                        width: '271px',
                        height: '20px',
                        justifyContent: 'space-between',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <span 
                        style={{
                          fontWeight: 400,
                          fontSize: '12px',
                          lineHeight: '20px',
                          letterSpacing: '-0.01em',
                          color: '#5F5F5D'
                        }}
                      >
                        5 of 25 used today
                      </span>
                      <span 
                        style={{
                          fontWeight: 400,
                          fontSize: '12px',
                          lineHeight: '18px',
                          letterSpacing: '0%',
                          color: '#1E9A80'
                        }}
                      >
                        +25 tomorrow
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Separator Line */}
            <div 
              style={{
                width: '307px',
                height: '0px',
                gap: '8px',
                paddingRight: '10px',
                paddingLeft: '10px'
              }}
            >
              <div 
                style={{
                  width: '287px',
                  height: '1px',
                  backgroundColor: '#E8E5DF'
                }}
              ></div>
            </div>

            {/* Win Free Credits and Theme Style */}
            <div 
              style={{
                width: '307px',
                height: '92px',
                gap: '8px',
                paddingRight: '4px',
                paddingLeft: '4px'
              }}
            >
              <div 
                style={{
                  width: '299px',
                  height: '92px',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Win Free Credits */}
                <button 
                  className="transition flex items-center"
                  style={{
                    width: '287px',
                    height: '40px',
                    borderRadius: '8px',
                    padding: '6px',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F3EE'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div 
                    style={{
                      width: '275px',
                      height: '28px',
                      gap: '8px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <div 
                      className="flex items-center justify-center"
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        padding: '6px',
                        gap: '10px',
                        backgroundColor: '#F3F3EE'
                      }}
                    >
                      <img
                        src="/assets/gift.svg"
                        alt="Gift"
                        style={{ width: '16px', height: '16px' }}
                      />
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
                      Win free credits
                    </span>
                  </div>
                </button>

                {/* Theme Style */}
                <button 
                  className="transition flex items-center"
                  style={{
                    width: '287px',
                    height: '40px',
                    borderRadius: '8px',
                    padding: '6px',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F3EE'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div 
                    style={{
                      width: '275px',
                      height: '28px',
                      gap: '8px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <div 
                      className="flex items-center justify-center"
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        padding: '6px',
                        gap: '10px',
                        backgroundColor: '#F3F3EE'
                      }}
                    >
                      <img
                        src="/assets/theme.svg"
                        alt="Theme"
                        style={{ width: '16px', height: '16px' }}
                      />
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
                      Theme Style
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Separator below Theme Style */}
            <div 
              style={{
                width: '307px',
                height: '0px',
                gap: '8px',
                paddingRight: '10px',
                paddingLeft: '10px'
              }}
            >
              <div 
                style={{
                  width: '287px',
                  height: '1px',
                  backgroundColor: '#E8E5DF'
                }}
              ></div>
            </div>

            {/* Log Out */}
            <div 
              style={{
                width: '307px',
                height: '48px',
                gap: '8px',
                paddingRight: '4px',
                paddingLeft: '4px'
              }}
            >
              <div 
                style={{
                  width: '299px',
                  height: '48px'
                }}
              >
                <button 
                  onClick={() => {
                    useAuthStore.getState().logout()
                    window.location.href = '/auth'
                  }}
                  className="transition flex items-center"
                  style={{
                    width: '287px',
                    marginTop:"15px",
                    height: '40px',
                    borderRadius: '8px',
                    padding: '6px',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F3EE'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div 
                    style={{
                      width: '275px',
                      height: '28px',
                      
                      gap: '8px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <div 
                      className="flex items-center justify-center"
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        padding: '6px',
                        gap: '10px',
                        backgroundColor: '#F3F3EE'
                      }}
                    >
                      <img
                        src="/assets/logout.svg"
                        alt="Logout"
                        style={{ 
                          width: '16px', 
                          height: '16px',
                          filter: 'invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%)'
                        }}
                      />
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
                      Log out
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
