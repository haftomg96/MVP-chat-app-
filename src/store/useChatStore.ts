import { create } from 'zustand'

interface Message {
  id: string
  content: string
  senderId: string
  receiverId: string
  createdAt: string
  isRead: boolean
}

interface ChatState {
  selectedUserId: string | null
  messages: Message[]
  onlineUsers: Set<string>
  setSelectedUser: (userId: string | null) => void
  addMessage: (message: Message) => void
  setMessages: (messages: Message[]) => void
  setUserOnline: (userId: string, online: boolean) => void
  setOnlineUsers: (users: string[]) => void
}

export const useChatStore = create<ChatState>((set) => ({
  selectedUserId: null,
  messages: [],
  onlineUsers: new Set(),
  setSelectedUser: (userId) => set({ selectedUserId: userId }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setMessages: (messages) => set({ messages }),
  setUserOnline: (userId, online) =>
    set((state) => {
      const newOnlineUsers = new Set(state.onlineUsers)
      if (online) {
        newOnlineUsers.add(userId)
      } else {
        newOnlineUsers.delete(userId)
      }
      return { onlineUsers: newOnlineUsers }
    }),
  setOnlineUsers: (users) => set({ onlineUsers: new Set(users) }),
}))
