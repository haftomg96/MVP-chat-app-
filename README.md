# Chat App MVP

A modern, real-time chat application built with Next.js, WebSocket, Prisma, and PostgreSQL.

## Features

✅ **Authentication**
- Google OAuth integration
- JWT-based authentication
- Email/password registration and login

✅ **Real-time Messaging**
- WebSocket-powered instant messaging
- Online/offline user status
- Message read receipts
- Typing indicators

✅ **User Management**
- User list with online/offline status
- User profiles with avatars
- Search functionality

✅ **Chat Features**
- One-on-one messaging
- Message history stored in database
- Persistent chat sessions
- Contact information panel

✅ **BONUS: AI Chat**
- Chat with AI assistant
- OpenAI integration (optional)
- Fallback to simple responses

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, WebSocket (Socket.io)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Google OAuth, JWT
- **State Management**: Zustand
- **Real-time**: Socket.io

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database
- Google OAuth credentials (optional)
- OpenAI API key (optional, for AI chat)

### Installation

1. **Clone and install dependencies**

```bash
npm install
```

2. **Set up environment variables**

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/chatapp?schema=public"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
JWT_SECRET="your-jwt-secret-here"
OPENAI_API_KEY="your-openai-api-key" # Optional
```

3. **Set up the database**

```bash
npx prisma migrate dev --name init
npx prisma generate
```

4. **Run the development server**

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── messages/      # Message endpoints
│   │   │   ├── users/         # User endpoints
│   │   │   └── ai-chat/       # AI chat endpoint
│   │   ├── auth/              # Auth page
│   │   ├── chat/              # Chat page
│   │   └── layout.tsx         # Root layout
│   ├── components/
│   │   ├── Sidebar.tsx        # User list sidebar
│   │   ├── ChatWindow.tsx     # Main chat interface
│   │   └── ContactInfo.tsx    # Contact info panel
│   ├── hooks/
│   │   └── useSocket.ts       # WebSocket hook
│   ├── lib/
│   │   ├── auth.ts            # Auth utilities
│   │   ├── prisma.ts          # Prisma client
│   │   └── socket.ts          # Socket.io setup
│   └── store/
│       ├── useAuthStore.ts    # Auth state
│       └── useChatStore.ts    # Chat state
└── server.js                  # Custom server with WebSocket
```

## Features Implemented

### Core Requirements ✅

1. **Authentication Page**
   - Conversion-focused design
   - Google OAuth integration
   - JWT-based email/password auth
   - Smooth transitions and error handling

2. **User List**
   - Display all users
   - Online/offline status indicators
   - Real-time status updates via WebSocket
   - Search functionality

3. **Chat Sessions**
   - Click user to start chat
   - Real-time messaging
   - Message history
   - Read receipts

4. **User Information**
   - Display name and picture
   - Google profile pictures
   - Placeholder avatars for JWT users
   - Contact info panel

5. **Database Storage**
   - All messages saved to PostgreSQL
   - User profiles stored
   - Session management
   - Chat history persistence

### Bonus Features ✅

1. **AI Chat Assistant**
   - Dedicated AI chat option
   - OpenAI integration (optional)
   - Fallback responses
   - Same interface as regular chat

2. **Additional Features**
   - Typing indicators
   - Message timestamps
   - User search
   - Responsive design
   - Contact info panel with tabs
   - Archive/mute options
   - New message modal

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/google` - Google OAuth login

### Users
- `GET /api/users` - Get all users (except current user)

### Messages
- `GET /api/messages?userId={id}` - Get messages with specific user
- `POST /api/messages` - Send a message

### AI Chat
- `POST /api/ai-chat` - Send message to AI assistant

## WebSocket Events

### Client → Server
- `authenticate` - Authenticate user with token
- `send-message` - Send a message
- `typing` - Notify typing status

### Server → Client
- `user-status` - User online/offline status change
- `receive-message` - Receive a new message
- `user-typing` - User typing notification
- `online-users` - List of currently online users

## Database Schema

### User
- id, email, name, picture
- password (for JWT auth)
- googleId (for Google OAuth)
- timestamps

### Session
- id, userId, token, expiresAt
- Used for JWT session management

### Message
- id, content, senderId, receiverId
- isRead, createdAt
- Stores all chat messages

## Design Highlights

- Clean, modern UI matching the provided Figma design
- Teal/cyan color scheme (#2DD4BF primary color)
- Smooth transitions and hover effects
- Responsive layout
- Intuitive user experience
- Conversion-focused auth page

## Future Enhancements

- Group chat support
- File/image sharing
- Voice/video calls
- Message reactions
- Push notifications
- Message search
- User blocking
- Chat themes
- Message encryption

## License

MIT
