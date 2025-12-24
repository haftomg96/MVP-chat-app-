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
      <div 
        className="fixed bg-white shadow-2xl z-50 flex flex-col animate-slide-in"
        style={{
          right: '12px',
          top: '12px',
          height: 'calc(100vh - 24px)',
          width: '450px',
          borderTopLeftRadius: '24px',
          borderBottomLeftRadius: '24px',
          borderTopRightRadius: '24px',
          borderBottomRightRadius: '24px',
          padding: '24px',
          gap: '24px',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between"
          style={{
            width: '402px',
            height: '28px',
            gap: '10px'
          }}
        >
          <h2 
            style={{
              fontWeight: 600,
              fontSize: '20px',
              lineHeight: '28px',
              letterSpacing: '0px',
              color: '#111625'
            }}
          >
            Contact Info
          </h2>
          <button
            onClick={onClose}
            className="hover:bg-gray-100 rounded-lg transition"
            style={{
              width: '24px',
              height: '24px',
              padding: '0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
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
      <div 
        className="flex flex-col items-center"
        style={{
          width: '402px',
          height: '132px',
          gap: '16px'
        }}
      >
        <div className="relative">
          {user.picture ? (
            <img
              src={user.picture}
              alt={user.name || 'User'}
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '1798.2px',
                objectFit: 'cover'
              }}
            />
          ) : (
            <div 
              className="bg-[#1E9A80] flex items-center justify-center text-white font-semibold"
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '1798.2px',
                fontSize: '24px'
              }}
            >
              {user.name?.[0] || 'A'}
            </div>
          )}
          {isOnline && (
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
          )}
        </div>
        
        <div 
          className="flex flex-col items-center"
          style={{
            width: '402px',
            height: '44px',
            gap: '4px'
          }}
        >
          <h3 
            style={{
              fontWeight: 500,
              fontSize: '16px',
              lineHeight: '24px',
              letterSpacing: '-0.011em',
              textAlign: 'center',
              color: '#111625'
            }}
          >
            {user.name || 'User'}
          </h3>
          <p 
            style={{
              fontWeight: 400,
              fontSize: '12px',
              lineHeight: '16px',
              letterSpacing: '0px',
              color: '#8B8B8B'
            }}
          >
            {user.email}
          </p>
        </div>
      </div>

      {/* Audio and Video Buttons */}
      <div 
        className="flex"
        style={{
          width: '402px',
          height: '32px',
          gap: '16px'
        }}
      >
        <button 
          className="flex items-center justify-center transition hover:bg-gray-50"
          style={{
            width: '193px',
            height: '32px',
            borderRadius: '8px',
            border: '1px solid #E8E5DF',
            padding: '8px',
            gap: '6px'
          }}
        >
          <svg
            className="w-5 h-5 text-gray-700"
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
          <span 
            style={{
              fontWeight: 500,
              fontSize: '14px',
              lineHeight: '20px',
              letterSpacing: '-0.006em',
              textAlign: 'center'
            }}
          >
            Audio
          </span>
        </button>
        
        <button 
          className="flex items-center justify-center transition hover:bg-gray-50"
          style={{
            width: '193px',
            height: '32px',
            borderRadius: '8px',
            border: '1px solid #E8E5DF',
            padding: '8px',
            gap: '6px'
          }}
        >
          <svg
            className="w-5 h-5 text-gray-700"
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
          <span 
            style={{
              fontWeight: 500,
              fontSize: '14px',
              lineHeight: '20px',
              letterSpacing: '-0.006em',
              textAlign: 'center'
            }}
          >
            Video
          </span>
        </button>
      </div>

      {/* Tabs Section */}
      <div 
        className="flex flex-col"
        style={{
          width: '402px',
          height: '688px',
          gap: '12px'
        }}
      >
        {/* Tabs */}
        <div 
          className="flex"
          style={{
            width: '167px',
            height: '40px',
            borderRadius: '12px',
            padding: '2px',
            backgroundColor: '#F3F3EE'
          }}
        >
          <button
            onClick={() => setActiveTab('media')}
            className="transition"
            style={{
              width: activeTab === 'media' ? '61px' : 'auto',
              height: '36px',
              borderRadius: '10px',
              gap: '8px',
              paddingTop: '8px',
              paddingRight: '10px',
              paddingBottom: '8px',
              paddingLeft: '10px',
              backgroundColor: activeTab === 'media' ? '#FFFFFF' : 'transparent',
              fontWeight: 500,
              fontSize: '14px',
              lineHeight: '20px',
              letterSpacing: '-0.006em',
              textAlign: 'center',
              color: activeTab === 'media' ? '#111625' : '#8B8B8B'
            }}
          >
            Media
          </button>
          <button
            onClick={() => setActiveTab('link')}
            className="transition"
            style={{
              width: activeTab === 'link' ? '61px' : 'auto',
              height: '36px',
              borderRadius: '10px',
              gap: '8px',
              paddingTop: '8px',
              paddingRight: '10px',
              paddingBottom: '8px',
              paddingLeft: '10px',
              backgroundColor: activeTab === 'link' ? '#FFFFFF' : 'transparent',
              fontWeight: 500,
              fontSize: '14px',
              lineHeight: '20px',
              letterSpacing: '-0.006em',
              textAlign: 'center',
              color: activeTab === 'link' ? '#111625' : '#8B8B8B'
            }}
          >
            Link
          </button>
          <button
            onClick={() => setActiveTab('docs')}
            className="transition"
            style={{
              width: activeTab === 'docs' ? '61px' : 'auto',
              height: '36px',
              borderRadius: '10px',
              gap: '8px',
              paddingTop: '8px',
              paddingRight: '10px',
              paddingBottom: '8px',
              paddingLeft: '10px',
              backgroundColor: activeTab === 'docs' ? '#FFFFFF' : 'transparent',
              fontWeight: 500,
              fontSize: '14px',
              lineHeight: '20px',
              letterSpacing: '-0.006em',
              textAlign: 'center',
              color: activeTab === 'docs' ? '#111625' : '#8B8B8B'
            }}
          >
            Docs
          </button>
        </div>

        {/* Content */}
        <div 
          className="flex-1 overflow-y-auto"
          style={{
            width: '402px',
            gap: '8px',
            borderBottomRightRadius: '12px',
            borderBottomLeftRadius: '12px',
            minHeight: 0,
            paddingBottom: '48px'
          }}
        >
        {activeTab === 'media' && (
          <div className="space-y-2">
            {/* May */}
            <div 
              style={{
                width: '402px',
                gap: '4px'
              }}
            >
              <div 
                className="flex items-center"
                style={{
                  width: '402px',
                  height: '32px',
                  borderRadius: '8px',
                  gap: '12px',
                  paddingTop: '8px',
                  paddingRight: '12px',
                  paddingBottom: '8px',
                  paddingLeft: '12px',
                  backgroundColor: '#F3F3EE'
                }}
              >
                <span 
                  style={{
                    fontWeight: 500,
                    fontSize: '12px',
                    lineHeight: '16px',
                    color: '#8B8B8B'
                  }}
                >
                  May
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <div className="aspect-square bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 rounded-lg"></div>
                <div className="aspect-square bg-gradient-to-br from-blue-900 via-blue-800 to-teal-700 rounded-lg"></div>
                <div className="aspect-square bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 rounded-lg"></div>
                <div className="aspect-square bg-gradient-to-br from-pink-500 via-purple-600 to-purple-700 rounded-lg"></div>
                <div className="aspect-square bg-gradient-to-br from-orange-400 via-pink-400 to-pink-500 rounded-lg"></div>
                <div className="aspect-square bg-gradient-to-br from-pink-400 via-pink-500 to-red-500 rounded-lg"></div>
              </div>
            </div>
            
            {/* April */}
            <div 
              style={{
                width: '402px',
                gap: '4px'
              }}
            >
              <div 
                className="flex items-center"
                style={{
                  width: '402px',
                  height: '32px',
                  borderRadius: '8px',
                  gap: '12px',
                  paddingTop: '8px',
                  paddingRight: '12px',
                  paddingBottom: '8px',
                  paddingLeft: '12px',
                  backgroundColor: '#F3F3EE'
                }}
              >
                <span 
                  style={{
                    fontWeight: 500,
                    fontSize: '12px',
                    lineHeight: '16px',
                    color: '#8B8B8B'
                  }}
                >
                  April
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <div className="aspect-square bg-gradient-to-br from-blue-600 via-red-500 to-red-600 rounded-lg"></div>
                <div className="aspect-square bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 rounded-lg"></div>
                <div className="aspect-square bg-gradient-to-br from-cyan-400 via-blue-400 to-blue-500 rounded-lg"></div>
                <div className="aspect-square bg-gradient-to-br from-pink-200 via-pink-300 to-pink-400 rounded-lg"></div>
                <div className="aspect-square bg-gradient-to-br from-red-400 via-orange-400 to-yellow-400 rounded-lg"></div>
              </div>
            </div>

            {/* March */}
            <div 
              style={{
                width: '402px',
                gap: '4px'
              }}
            >
              <div 
                className="flex items-center"
                style={{
                  width: '402px',
                  height: '32px',
                  borderRadius: '8px',
                  gap: '12px',
                  paddingTop: '8px',
                  paddingRight: '12px',
                  paddingBottom: '8px',
                  paddingLeft: '12px',
                  backgroundColor: '#F3F3EE'
                }}
              >
                <span 
                  style={{
                    fontWeight: 500,
                    fontSize: '12px',
                    lineHeight: '16px',
                    color: '#8B8B8B'
                  }}
                >
                  March
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <div className="aspect-square bg-gradient-to-br from-gray-300 via-gray-400 to-gray-300 rounded-lg"></div>
                <div className="aspect-square bg-gradient-to-br from-yellow-300 via-orange-300 to-pink-300 rounded-lg"></div>
                <div className="aspect-square bg-gradient-to-br from-orange-500 via-yellow-500 to-orange-600 rounded-lg"></div>
                <div className="aspect-square bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-lg"></div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'link' && (
          <div 
            style={{
              width: '402px',
              gap: '12px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* May */}
            <div>
              <div 
                className="flex items-center"
                style={{
                  width: '402px',
                  height: '32px',
                  borderRadius: '8px',
                  gap: '12px',
                  paddingTop: '8px',
                  paddingRight: '12px',
                  paddingBottom: '8px',
                  paddingLeft: '12px',
                  backgroundColor: '#F8F8F5'
                }}
              >
                <span 
                  style={{
                    fontWeight: 500,
                    fontSize: '12px',
                    lineHeight: '16px',
                    color: '#8B8B8B'
                  }}
                >
                  May
                </span>
              </div>
              
              {/* Links for May */}
              <div 
                className="mt-3"
                style={{
                  gap: '16px',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
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
                ].map((link, i) => (
                  <div
                    key={i}
                    className="flex items-start cursor-pointer hover:opacity-80 transition"
                    style={{
                      width: '402px',
                      height: '60px',
                      gap: '12px'
                    }}
                  >
                    <div 
                      className={`${link.color} flex-shrink-0 flex items-center justify-center text-white font-bold text-xs`}
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '12px',
                        gap: '10px'
                      }}
                    >
                      {link.title.includes('basecamp') && '⛺'}
                      {link.title.includes('notion') && 'N'}
                    </div>
                    <div 
                      className="flex flex-col"
                      style={{
                        width: '330px',
                        height: '56px',
                        gap: '4px'
                      }}
                    >
                      <div 
                        style={{
                          width: '330px',
                          height: '20px'
                        }}
                      >
                        <p 
                          className="truncate"
                          style={{
                            fontWeight: 500,
                            fontSize: '14px',
                            lineHeight: '20px',
                            letterSpacing: '-0.006em',
                            color: '#111625'
                          }}
                        >
                          {link.title}
                        </p>
                      </div>
                      <p 
                        className="line-clamp-2"
                        style={{
                          fontWeight: 400,
                          fontSize: '12px',
                          lineHeight: '16px',
                          letterSpacing: '0px',
                          color: '#8B8B8B'
                        }}
                      >
                        {link.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* April */}
            <div className="mt-3">
              <div 
                className="flex items-center"
                style={{
                  width: '402px',
                  height: '32px',
                  borderRadius: '8px',
                  gap: '12px',
                  paddingTop: '8px',
                  paddingRight: '12px',
                  paddingBottom: '8px',
                  paddingLeft: '12px',
                  backgroundColor: '#F8F8F5'
                }}
              >
                <span 
                  style={{
                    fontWeight: 500,
                    fontSize: '12px',
                    lineHeight: '16px',
                    color: '#8B8B8B'
                  }}
                >
                  April
                </span>
              </div>
              
              {/* Links for April */}
              <div 
                className="mt-3"
                style={{
                  gap: '16px',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {[
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
                    className="flex items-start cursor-pointer hover:opacity-80 transition"
                    style={{
                      width: '402px',
                      height: '60px',
                      gap: '12px'
                    }}
                  >
                    <div 
                      className={`${link.color} flex-shrink-0 flex items-center justify-center text-white font-bold text-xs`}
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '12px',
                        gap: '10px'
                      }}
                    >
                      {link.title.includes('asana') && '◉'}
                      {link.title.includes('trello') && '▦'}
                    </div>
                    <div 
                      className="flex flex-col"
                      style={{
                        width: '330px',
                        height: '56px',
                        gap: '4px'
                      }}
                    >
                      <div 
                        style={{
                          width: '330px',
                          height: '20px'
                        }}
                      >
                        <p 
                          className="truncate"
                          style={{
                            fontWeight: 500,
                            fontSize: '14px',
                            lineHeight: '20px',
                            letterSpacing: '-0.006em',
                            color: '#111625'
                          }}
                        >
                          {link.title}
                        </p>
                      </div>
                      <p 
                        className="line-clamp-2"
                        style={{
                          fontWeight: 400,
                          fontSize: '12px',
                          lineHeight: '16px',
                          letterSpacing: '0px',
                          color: '#8B8B8B'
                        }}
                      >
                        {link.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'docs' && (
          <div 
            style={{
              width: '402px',
              gap: '12px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* May */}
            <div>
              <div 
                className="flex items-center"
                style={{
                  width: '402px',
                  height: '32px',
                  borderRadius: '8px',
                  gap: '12px',
                  paddingTop: '8px',
                  paddingRight: '12px',
                  paddingBottom: '8px',
                  paddingLeft: '12px',
                  backgroundColor: '#F8F8F5'
                }}
              >
                <span 
                  style={{
                    fontWeight: 500,
                    fontSize: '12px',
                    lineHeight: '16px',
                    color: '#8B8B8B'
                  }}
                >
                  May
                </span>
              </div>
              
              {/* Docs for May */}
              <div 
                className="mt-3"
                style={{
                  gap: '12px',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {[
                  { name: 'Document Requirement.pdf', size: '16 MB', pages: 10, type: 'pdf' },
                  { name: 'User Flow.pdf', size: '32 MB', pages: 7, type: 'pdf' },
                  { name: 'Existing App.fig', size: '213 MB', pages: null, type: 'fig' },
                  { name: 'Product Illustrations.ai', size: '72 MB', pages: null, type: 'ai' },
                  { name: 'Quotation-Hikariworks-May.pdf', size: '329 KB', pages: 2, type: 'pdf' },
                ].map((doc, i) => (
                  <div
                    key={i}
                    className="flex items-center cursor-pointer hover:opacity-80 transition"
                    style={{
                      width: '402px',
                      height: '60px',
                      gap: '12px'
                    }}
                  >
                    <div 
                      className="flex-shrink-0 flex flex-col items-center justify-center"
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '12px',
                        backgroundColor: '#F3F3EE',
                        gap: '10px'
                      }}
                    >
                      <svg 
                        style={{
                          width: '31.5px',
                          height: '36px'
                        }}
                        viewBox="0 0 32 36" 
                        fill="none"
                      >
                        <path 
                          d="M2 0C0.895431 0 0 0.895431 0 2V34C0 35.1046 0.895431 36 2 36H30C31.1046 36 32 35.1046 32 34V8L24 0H2Z" 
                          fill="white"
                        />
                        <path 
                          d="M24 0V6C24 7.10457 24.8954 8 26 8H32L24 0Z" 
                          fill="#E5E7EB"
                        />
                        <text 
                          x="16" 
                          y="24" 
                          textAnchor="middle" 
                          style={{
                            fontSize: '8px',
                            fontWeight: 'bold',
                            fill: doc.type === 'pdf' ? '#DC2626' : doc.type === 'fig' ? '#8B5CF6' : '#F97316'
                          }}
                        >
                          {doc.type.toUpperCase()}
                        </text>
                      </svg>
                    </div>
                    <div 
                      className="flex flex-col"
                      style={{
                        width: '330px',
                        height: '42px',
                        gap: '6px'
                      }}
                    >
                      <p 
                        className="truncate"
                        style={{
                          fontWeight: 500,
                          fontSize: '14px',
                          lineHeight: '20px',
                          letterSpacing: '-0.006em',
                          color: '#1C1C1C'
                        }}
                      >
                        {doc.name}
                      </p>
                      <div 
                        className="flex items-center"
                        style={{
                          width: '330px',
                          height: '16px',
                          gap: '8px'
                        }}
                      >
                        {doc.pages && (
                          <>
                            <span 
                              style={{
                                fontWeight: 400,
                                fontSize: '12px',
                                lineHeight: '16px',
                                letterSpacing: '0px',
                                color: '#8B8B8B'
                              }}
                            >
                              {doc.pages} pages
                            </span>
                            <span style={{ color: '#8B8B8B' }}>•</span>
                          </>
                        )}
                        <span 
                          style={{
                            fontWeight: 400,
                            fontSize: '12px',
                            lineHeight: '16px',
                            letterSpacing: '0px',
                            color: '#8B8B8B'
                          }}
                        >
                          {doc.size}
                        </span>
                        <span style={{ color: '#8B8B8B' }}>•</span>
                        <span 
                          style={{
                            fontWeight: 400,
                            fontSize: '12px',
                            lineHeight: '16px',
                            letterSpacing: '0px',
                            color: '#8B8B8B'
                          }}
                        >
                          {doc.type}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
    </>
  )
}
