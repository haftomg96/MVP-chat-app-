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
  const [showMobileSidebar, setShowMobileSidebar] = useState(true)
  const socket = useSocket()

  useEffect(() => {
    hydrate()
  }, [hydrate])

  useEffect(() => {
    if (isHydrated && !token) {
      router.push('/auth')
    }
  }, [token, isHydrated, router])

  // On mobile, when a user is selected, hide sidebar and show chat
  useEffect(() => {
    if (selectedUserId && window.innerWidth < 768) {
      setShowMobileSidebar(false)
    }
  }, [selectedUserId])

  if (!isHydrated || !token || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-[#F3F3EE]">
      {/* Left Navigation Bar - Hidden on mobile */}
      <div className="hidden md:block">
        <LeftNavbar />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header - Hidden on mobile when chat is open */}
        <div className={`${selectedUserId && !showMobileSidebar ? 'hidden md:block' : 'block'}`}>
          <TopHeader />
        </div>
        
        {/* Chat Area */}
        <div className="flex-1 flex overflow-hidden md:p-3 md:gap-3 bg-[#F3F3EE]">
          {/* Sidebar - Full screen on mobile, side panel on desktop */}
          <div className={`${
            showMobileSidebar ? 'flex' : 'hidden'
          } md:flex w-full md:w-auto`}>
            <Sidebar 
              onMobileUserSelect={() => setShowMobileSidebar(false)}
              onShowContactInfo={() => setShowContactInfo(true)}
            />
          </div>
          
          {/* Chat Window - Full screen on mobile, side panel on desktop */}
          <div className={`${
            !showMobileSidebar && selectedUserId ? 'flex' : 'hidden'
          } md:flex flex-1`}>
            <ChatWindow 
              onShowContactInfo={() => setShowContactInfo(true)}
              onMobileBack={() => setShowMobileSidebar(true)}
            />
          </div>
        </div>
      </div>
      
      {showContactInfo && selectedUserId && (
        <ContactInfo onClose={() => setShowContactInfo(false)} />
      )}
    </div>
  )
}
