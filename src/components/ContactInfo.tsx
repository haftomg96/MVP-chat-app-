'use client'

import { useEffect, useState } from 'react'
import { useChatStore } from '@/store/useChatStore'
import { useAuthStore } from '@/store/useAuthStore'
import SkeletonLoader from '@/components/SkeletonLoader'

export default function ContactInfo({ onClose }: { onClose: () => void }) {
  const { selectedUserId, onlineUsers, messages } = useChatStore()
  const { token } = useAuthStore()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [contentLoading, setContentLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'media' | 'link' | 'docs'>('media')
  const [mediaFiles, setMediaFiles] = useState<any[]>([])
  const [linkMessages, setLinkMessages] = useState<any[]>([])
  const [docFiles, setDocFiles] = useState<any[]>([])

  useEffect(() => {
    if (selectedUserId && selectedUserId !== 'ai-assistant') {
      fetchUserDetails()
      setContentLoading(true)
      // Small delay to simulate loading
      setTimeout(() => {
        filterMessages()
        setContentLoading(false)
      }, 300)
    } else if (selectedUserId === 'ai-assistant') {
      setUser({
        id: 'ai-assistant',
        name: 'AI Assistant',
        email: 'ai@assistant.com',
        picture: null,
      })
      setContentLoading(false)
    }
  }, [selectedUserId])

  // Filter messages when they change
  useEffect(() => {
    if (messages.length > 0) {
      setContentLoading(true)
      // Small delay to simulate loading
      setTimeout(() => {
        filterMessages()
        setContentLoading(false)
      }, 300)
    }
  }, [messages])

  const fetchUserDetails = async () => {
    try {
      const res = await fetch('/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const users = await res.json()
        const foundUser = users.find((u: any) => u.id === selectedUserId)
        setUser(foundUser)
        setLoading(false)
      }
    } catch (error) {
      console.error('Failed to fetch user details:', error)
      setLoading(false)
    }
  }

  const filterMessages = () => {
    // Filter media files (images and videos)
    const media = messages
      .filter((msg: any) => msg.type === 'file' && msg.metadata?.fileType?.startsWith('image/'))
      .map((msg: any) => ({
        url: msg.content,
        date: new Date(msg.createdAt),
        type: msg.metadata?.fileType,
      }))

    // Filter links from text messages
    const urlRegex = /(https?:\/\/[^\s]+)/g
    const links = messages
      .filter((msg: any) => msg.type !== 'file' && msg.type !== 'voice')
      .map((msg: any) => {
        const urls = msg.content.match(urlRegex)
        if (urls) {
          return urls.map((url: string) => ({
            url,
            content: msg.content,
            date: new Date(msg.createdAt),
          }))
        }
        return null
      })
      .filter(Boolean)
      .flat()

    // Filter document files (non-image files)
    const docs = messages
      .filter((msg: any) => msg.type === 'file' && !msg.metadata?.fileType?.startsWith('image/'))
      .map((msg: any) => ({
        url: msg.content,
        name: msg.metadata?.fileName || 'File',
        size: msg.metadata?.fileSize || 0,
        type: msg.metadata?.fileType || '',
        date: new Date(msg.createdAt),
      }))

    setMediaFiles(media)
    setLinkMessages(links)
    setDocFiles(docs)
  }

  const groupByMonth = (items: any[]) => {
    const groups: Record<string, any[]> = {}
    items.forEach((item) => {
      const monthYear = item.date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      if (!groups[monthYear]) {
        groups[monthYear] = []
      }
      groups[monthYear].push(item)
    })
    return groups
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getFileExtension = (filename: string) => {
    return filename.split('.').pop()?.toUpperCase() || 'FILE'
  }

  if (loading || !user) {
    return null
  }

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
        className="fixed bg-white shadow-2xl z-50 flex flex-col animate-slide-in inset-0 md:inset-auto md:right-3 md:top-3 md:h-[calc(100vh-24px)] md:w-[450px] md:rounded-3xl p-4 md:p-6"
        style={{ gap: '24px', overflow: 'hidden' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between w-full" style={{ maxWidth: '402px', height: '28px', gap: '10px' }}>
          <h2 style={{ fontWeight: 600, fontSize: '20px', lineHeight: '28px', letterSpacing: '0px', color: '#111625' }}>
            Contact Info
          </h2>
          <button
            onClick={onClose}
            className="hover:bg-gray-100 rounded-lg transition"
            style={{ width: '24px', height: '24px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User Info */}
        <div className="flex flex-col items-center" style={{ width: '402px', height: '132px', gap: '16px' }}>
          <div className="relative">
            {user.picture ? (
              <img src={user.picture} alt={user.name || 'User'} style={{ width: '72px', height: '72px', borderRadius: '1798.2px', objectFit: 'cover' }} />
            ) : (
              <div className="bg-[#1E9A80] flex items-center justify-center text-white font-semibold" style={{ width: '72px', height: '72px', borderRadius: '1798.2px', fontSize: '24px' }}>
                {user.name?.[0] || 'A'}
              </div>
            )}
            {isOnline && (
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>
          
          <div className="flex flex-col items-center" style={{ width: '402px', height: '44px', gap: '4px' }}>
            <h3 style={{ fontWeight: 500, fontSize: '16px', lineHeight: '24px', letterSpacing: '-0.011em', textAlign: 'center', color: '#111625' }}>
              {user.name || 'User'}
            </h3>
            <p style={{ fontWeight: 400, fontSize: '12px', lineHeight: '16px', letterSpacing: '0px', color: '#8B8B8B' }}>
              {user.email}
            </p>
          </div>
        </div>

        {/* Audio and Video Buttons */}
        <div className="flex" style={{ width: '402px', height: '32px', gap: '16px' }}>
          <button className="flex items-center justify-center transition hover:bg-gray-50" style={{ width: '193px', height: '32px', borderRadius: '8px', border: '1px solid #E8E5DF', padding: '8px', gap: '6px' }}>
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span style={{ fontWeight: 500, fontSize: '14px', lineHeight: '20px', letterSpacing: '-0.006em', textAlign: 'center' }}>Audio</span>
          </button>
          
          <button className="flex items-center justify-center transition hover:bg-gray-50" style={{ width: '193px', height: '32px', borderRadius: '8px', border: '1px solid #E8E5DF', padding: '8px', gap: '6px' }}>
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span style={{ fontWeight: 500, fontSize: '14px', lineHeight: '20px', letterSpacing: '-0.006em', textAlign: 'center' }}>Video</span>
          </button>
        </div>

        {/* Tabs Section */}
        <div className="flex flex-col" style={{ width: '402px', height: '688px', gap: '12px' }}>
          {/* Tabs */}
          <div className="flex" style={{ width: '167px', height: '40px', borderRadius: '12px', padding: '2px', backgroundColor: '#F3F3EE' }}>
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
          <div className="flex-1 overflow-y-auto" style={{ width: '402px', gap: '8px', borderBottomRightRadius: '12px', borderBottomLeftRadius: '12px', minHeight: 0, paddingBottom: '48px' }}>
            {/* Media Tab */}
            {activeTab === 'media' && (
              <div className="space-y-2">
                {contentLoading ? (
                  <div className="space-y-4 animate-pulse">
                    {[...Array(3)].map((_, i) => (
                      <div key={i}>
                        <div className="h-8 bg-gray-200 rounded-lg w-24 mb-2"></div>
                        <div className="grid grid-cols-3 gap-2">
                          {[...Array(6)].map((_, j) => (
                            <div key={j} className="aspect-square bg-gray-200 rounded-lg"></div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : mediaFiles.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <p>No media files yet</p>
                  </div>
                ) : (
                  Object.entries(groupByMonth(mediaFiles)).map(([month, files]) => (
                    <div key={month} style={{ width: '402px', gap: '4px' }}>
                      <div className="flex items-center" style={{ width: '402px', height: '32px', borderRadius: '8px', gap: '12px', paddingTop: '8px', paddingRight: '12px', paddingBottom: '8px', paddingLeft: '12px', backgroundColor: '#F3F3EE' }}>
                        <span style={{ fontWeight: 500, fontSize: '12px', lineHeight: '16px', color: '#8B8B8B' }}>{month}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {files.map((file: any, i: number) => (
                          <a key={i} href={file.url} target="_blank" rel="noopener noreferrer" className="aspect-square rounded-lg overflow-hidden hover:opacity-90 transition">
                            <img src={file.url} alt="Media" className="w-full h-full object-cover" />
                          </a>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Links Tab */}
            {activeTab === 'link' && (
              <div style={{ width: '402px', gap: '12px', display: 'flex', flexDirection: 'column' }}>
                {contentLoading ? (
                  <div className="space-y-4 animate-pulse">
                    {[...Array(2)].map((_, i) => (
                      <div key={i}>
                        <div className="h-8 bg-gray-200 rounded-lg w-24 mb-3"></div>
                        <div className="space-y-3">
                          {[...Array(3)].map((_, j) => (
                            <div key={j} className="flex gap-3">
                              <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                              <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-200 rounded w-full"></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : linkMessages.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <p>No links shared yet</p>
                  </div>
                ) : (
                  Object.entries(groupByMonth(linkMessages)).map(([month, links]) => (
                    <div key={month}>
                      <div className="flex items-center" style={{ width: '402px', height: '32px', borderRadius: '8px', gap: '12px', paddingTop: '8px', paddingRight: '12px', paddingBottom: '8px', paddingLeft: '12px', backgroundColor: '#F8F8F5' }}>
                        <span style={{ fontWeight: 500, fontSize: '12px', lineHeight: '16px', color: '#8B8B8B' }}>{month}</span>
                      </div>
                      
                      <div className="mt-3" style={{ gap: '16px', display: 'flex', flexDirection: 'column' }}>
                        {links.map((link: any, i: number) => (
                          <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-start cursor-pointer hover:opacity-80 transition" style={{ width: '402px', minHeight: '60px', gap: '12px' }}>
                            <div className="bg-gray-900 flex-shrink-0 flex items-center justify-center text-white font-bold text-xs" style={{ width: '60px', height: '60px', borderRadius: '12px', gap: '10px' }}>
                              🔗
                            </div>
                            <div className="flex flex-col" style={{ width: '330px', gap: '4px' }}>
                              <p className="truncate" style={{ fontWeight: 500, fontSize: '14px', lineHeight: '20px', letterSpacing: '-0.006em', color: '#111625' }}>
                                {link.url}
                              </p>
                              <p className="line-clamp-2" style={{ fontWeight: 400, fontSize: '12px', lineHeight: '16px', letterSpacing: '0px', color: '#8B8B8B' }}>
                                {link.content.substring(0, 100)}...
                              </p>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Docs Tab */}
            {activeTab === 'docs' && (
              <div style={{ width: '402px', gap: '12px', display: 'flex', flexDirection: 'column' }}>
                {contentLoading ? (
                  <div className="space-y-4 animate-pulse">
                    {[...Array(2)].map((_, i) => (
                      <div key={i}>
                        <div className="h-8 bg-gray-200 rounded-lg w-24 mb-3"></div>
                        <div className="space-y-3">
                          {[...Array(4)].map((_, j) => (
                            <div key={j} className="flex gap-3">
                              <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                              <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : docFiles.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <p>No documents yet</p>
                  </div>
                ) : (
                  Object.entries(groupByMonth(docFiles)).map(([month, docs]) => (
                    <div key={month}>
                      <div className="flex items-center" style={{ width: '402px', height: '32px', borderRadius: '8px', gap: '12px', paddingTop: '8px', paddingRight: '12px', paddingBottom: '8px', paddingLeft: '12px', backgroundColor: '#F8F8F5' }}>
                        <span style={{ fontWeight: 500, fontSize: '12px', lineHeight: '16px', color: '#8B8B8B' }}>{month}</span>
                      </div>
                      
                      <div className="mt-3" style={{ gap: '12px', display: 'flex', flexDirection: 'column' }}>
                        {docs.map((doc: any, i: number) => (
                          <a key={i} href={doc.url} target="_blank" rel="noopener noreferrer" className="flex items-center cursor-pointer hover:opacity-80 transition" style={{ width: '402px', height: '60px', gap: '12px' }}>
                            <div className="flex-shrink-0 flex flex-col items-center justify-center" style={{ width: '60px', height: '60px', borderRadius: '12px', backgroundColor: '#F3F3EE', gap: '10px' }}>
                              <span className="text-xs font-bold text-gray-700">{getFileExtension(doc.name)}</span>
                            </div>
                            <div className="flex flex-col" style={{ width: '330px', height: '42px', gap: '6px' }}>
                              <p className="truncate" style={{ fontWeight: 500, fontSize: '14px', lineHeight: '20px', letterSpacing: '-0.006em', color: '#1C1C1C' }}>
                                {doc.name}
                              </p>
                              <div className="flex items-center" style={{ width: '330px', height: '16px', gap: '8px' }}>
                                <span style={{ fontWeight: 400, fontSize: '12px', lineHeight: '16px', letterSpacing: '0px', color: '#8B8B8B' }}>
                                  {formatFileSize(doc.size)}
                                </span>
                                <span style={{ color: '#8B8B8B' }}>•</span>
                                <span style={{ fontWeight: 400, fontSize: '12px', lineHeight: '16px', letterSpacing: '0px', color: '#8B8B8B' }}>
                                  {getFileExtension(doc.name)}
                                </span>
                              </div>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
