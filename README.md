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
- WhatsApp-style message read receipts (single tick = sent, double tick = read)
- Real-time typing indicators

✅ **User Management**
- User list with online/offline status
- User profiles with avatars
- Search functionality
- Archive button on hover

✅ **Chat Features**
- One-on-one messaging
- Message history stored in database
- Persistent chat sessions
- Contact information panel
- Mobile responsive design

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
- PostgreSQL database running
- Google OAuth credentials (optional, for Google login)
- OpenAI API key (optional, for AI chat feature)

### Installation

1. **Clone and install dependencies**

```bash
npm install
```

2. **Set up environment variables**

Create a `.env` file in the root directory (see `.env.example` for reference):

```env
DATABASE_URL="postgresql://user:password@localhost:5432/chatapp?schema=public"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
JWT_SECRET="your-jwt-secret-here"
OPENAI_API_KEY="your-openai-api-key" # Optional
```

**Note**: Replace the database credentials with your actual PostgreSQL connection details.

3. **Set up the database**

```bash
npx prisma migrate dev --name init
npx prisma generate
```

4. **Seed the database (optional)**

```bash
node scripts/seed.js
```

This will create sample users for testing.

5. **Run the development server**

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

### Production Deployment

For production deployment:

```bash
# Build the application
npm run build

# Start the production server
npm start
```

**Note**: Make sure to set `NODE_ENV=production` in your production environment.

### Quick Fix Scripts

If you encounter deployment issues, use these helper scripts:

**Quick Fix (rebuilds and restarts everything)**:
```bash
./QUICK_FIX.sh
```

**Database Connection Issues**:
```bash
./DATABASE_FIX.sh
```

See `DEPLOYMENT.md` for detailed troubleshooting guide.

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
   - JWT-based email/password authentication
   - Smooth transitions and error handling

2. **User List**
   - Display all users
   - Online/offline status indicators
   - Real-time status updates via WebSocket
   - Search functionality
   - Archive button on hover (Figma design)

3. **Chat Sessions**
   - Click user to start chat
   - Real-time messaging
   - Message history
   - WhatsApp-style read receipts (✓ = sent, ✓✓ = read)
   - Typing indicators

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
   - Real-time typing indicators
   - Message timestamps with "time ago" format
   - User search functionality
   - Fully mobile responsive design (without affecting desktop layout)
   - Contact info panel with tabs
   - Archive button on hover
   - New message modal
   - Last message preview in sidebar
   - Custom primary color (#1E9A80)

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
- Custom teal color scheme (#1E9A80 primary color)
- Smooth transitions and hover effects
- Fully responsive layout (mobile and desktop)
- Intuitive user experience
- Conversion-focused authentication page
- WhatsApp-style read receipts
- Archive button with icon and text on hover

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
