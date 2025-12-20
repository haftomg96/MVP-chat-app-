'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { useChatStore } from '@/store/useChatStore'
import { useSocket } from '@/hooks/useSocket'
import LeftNavbar from '@/components/LeftNavbar'
import TopHeader from '@/components/TopHeader'
import Sidebar from '@/components/Sidebar'
import ChatWindow from '@/components/ChatWindow'
import ContactInfo from '@/components/ContactInfo'

export default function ChatPage() {
  const router = useRouter()
  const { token, user, isHydrated, hydrate } = useAuthStore()
  const { selectedUserId } = useChatStore()
  const [showContactInfo, setShowContactInfo] = useState(false)
  const socket = useSocket()

  useEffect(() => {
    hydrate()
  }, [hydrate])

  useEffect(() => {
    if (isHydrated && !token) {
      router.push('/auth')
    }
  }, [token, isHydrated, router])

  if (!isHydrated || !token || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-[#F3F3EE]">
      {/* Left Navigation Bar */}
      <LeftNavbar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <TopHeader />
        
        {/* Chat Area */}
        <div className="flex-1 flex overflow-hidden p-3 gap-3 bg-[#F3F3EE]">
          <Sidebar />
          <ChatWindow onShowContactInfo={() => setShowContactInfo(true)} />
        </div>
      </div>
      
      {showContactInfo && selectedUserId && (
        <ContactInfo onClose={() => setShowContactInfo(false)} />
      )}
    </div>
  )
}
