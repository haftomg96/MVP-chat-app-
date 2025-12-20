import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Chat App - Connect with Friends',
  description: 'Real-time chat application with WebSocket support',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
