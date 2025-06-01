# Project Tracker

A modern social media platform built with React, TypeScript, and Firebase. Features real-time messaging, user authentication, post creation, and user search functionality.

## 🚀 Features

### 📱 Core Features
- **User Authentication** - Secure login/signup with Google OAuth and email/password
- **Social Posts** - Create, read, and interact with posts in a Twitter-like feed
- **Real-time Chat** - Direct messaging system with live message updates
- **User Search** - Find and connect with other users
- **Profile Management** - Customizable user profiles with bio and profile pictures

### 🛠️ Technical Features
- **Real-time Updates** - Firestore real-time listeners for instant data sync
- **Responsive Design** - Mobile-first CSS with modern layouts
- **Type Safety** - Full TypeScript implementation
- **Security** - Comprehensive Firestore security rules
- **Performance** - Optimized queries with proper indexing

## 🏗️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **CSS3** - Modern styling with Flexbox and Grid

### Backend & Database
- **Firebase Authentication** - User management and OAuth
- **Cloud Firestore** - NoSQL real-time database
- **Firebase Storage** - File and image storage
- **Firestore Security Rules** - Database access control

### Development Tools
- **ESLint** - Code linting and quality
- **Git** - Version control
- **VS Code** - Recommended IDE setup

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase project

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd project-tracker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

4. **Set up Firebase:**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password and Google providers)
   - Create a Firestore database
   - Deploy the security rules from `firestore.rules`

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   ```
   http://localhost:5173
   ```

## 📁 Project Structure

```
project-tracker/
├── public/                     # Static assets
├── src/
│   ├── components/            # React components
│   │   ├── ChatMain.tsx      # Chat message interface
│   │   ├── ChatSidebar.tsx   # Chat room list
│   │   ├── CreatePost.tsx    # Post creation form
│   │   ├── Navbar.tsx        # Navigation bar
│   │   └── PostCard.tsx      # Individual post display
│   ├── pages/                # Page components
│   │   ├── Chat.tsx          # Chat page layout
│   │   ├── HomeFeed.tsx      # Main feed page
│   │   ├── Login.tsx         # Login page
│   │   ├── Profile.tsx       # User profile page
│   │   ├── Search.tsx        # User search page
│   │   └── SignUp.tsx        # Registration page
│   ├── services/             # API and Firebase services
│   │   ├── chatService.ts    # Chat functionality
│   │   ├── postService.ts    # Post operations
│   │   └── userService.ts    # User management
│   ├── types/                # TypeScript type definitions
│   │   ├── Chat.ts           # Chat-related types
│   │   ├── Post.ts           # Post types
│   │   └── User.ts           # User types
│   ├── styles/               # CSS stylesheets
│   ├── utils/                # Utility functions
│   └── firebaseConfig.ts     # Firebase configuration
├── firestore.rules           # Firestore security rules
├── .env.example              # Environment variables template
└── package.json              # Dependencies and scripts
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking

# Database
npm run populate     # Populate database with sample data
```

## 🗄️ Database Schema

### Collections

#### `users`
```typescript
{
  uid: string;           // User ID
  email: string;         // Email address
  username: string;      // Display name
  bio?: string;          // User bio
  profilePicture?: string; // Profile image URL
  createdAt: Date;       // Account creation date
}
```

#### `posts`
```typescript
{
  id: string;            // Post ID
  authorId: string;      // User ID of author
  content: string;       // Post content
  timestamp: Date;       // Creation date
  isPublic: boolean;     // Visibility setting
  isDeleted: boolean;    // Soft delete flag
}
```

#### `chats`
```typescript
{
  id: string;                    // Chat room ID
  participants: string[];        // Array of user IDs
  participantDetails?: object;   // Cached user info
  lastMessage?: {               // Most recent message
    content: string;
    senderId: string;
    timestamp: Date;
  };
  lastActivity: Date;           // Last message time
  createdAt: Date;              // Chat creation date
}
```

#### `messages`
```typescript
{
  id: string;            // Message ID
  chatRoomId: string;    // Reference to chat room
  senderId: string;      // Message sender
  receiverId: string;    // Message recipient
  content: string;       // Message text
  timestamp: Date;       // Send time
  read: boolean;         // Read status
  type: 'text';          // Message type
}
```

## 🔒 Security

### Firestore Rules
The app implements comprehensive security rules:
- **Posts**: Public read access, author-only write access
- **Users**: Authenticated read access, self-only write access
- **Chats**: Participant-only access
- **Messages**: Sender/receiver-only access

### Authentication
- Firebase Authentication handles user management
- Google OAuth and email/password providers
- Protected routes requiring authentication

## 🎨 Features Walkthrough

### 1. **Authentication Flow**
- Users can sign up with email/password or Google
- Automatic profile creation on registration
- Persistent login sessions

### 2. **Home Feed**
- Real-time post updates
- Create new posts with rich content
- Responsive card-based layout

### 3. **Chat System**
- Real-time messaging with Firestore listeners
- Chat room creation between users
- Message read receipts
- Responsive sidebar and main chat layout

### 4. **User Search**
- Search users by username or email
- Start conversations directly from search
- Cached user data for performance

### 5. **Profile Management**
- Editable user profiles
- Profile picture upload
- Bio and personal information

## 🚀 Deployment

### Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize hosting
firebase init hosting

# Deploy
npm run build
firebase deploy
```

### Vercel/Netlify
1. Connect your repository
2. Set environment variables in the dashboard
3. Deploy automatically on push

## 🔧 Development

### Environment Setup
1. Copy `.env.example` to `.env`
2. Configure Firebase credentials
3. Install recommended VS Code extensions
4. Run `npm run dev` to start development

### Code Quality
- ESLint configuration for React and TypeScript
- Prettier for code formatting
- TypeScript strict mode enabled
- Git hooks for pre-commit linting

### Testing Database
Use the populate scripts to add sample data:
```bash
# Add sample users
npm run populate-users

# Add sample posts
npm run populate-posts
```

## 📚 API Reference

### Chat Service
```typescript
// Create or get chat room
createOrGetChatRoom(currentUserId: string, otherUserId: string): Promise<string>

// Send message
sendMessage(chatRoomId: string, senderId: string, receiverId: string, content: string): Promise<void>

// Subscribe to messages
subscribeToMessages(chatRoomId: string, callback: (messages: Message[]) => void): Unsubscribe

// Subscribe to chat rooms
subscribeToUserChatRooms(userId: string, callback: (chatRooms: ChatRoom[]) => void): Unsubscribe
```

### User Service
```typescript
// Search users
searchUsers(searchTerm: string): Promise<User[]>

// Get user by ID
getUserById(userId: string): Promise<User | null>

// Update user profile
updateUserProfile(userId: string, updates: Partial<User>): Promise<void>
```

### Post Service
```typescript
// Create post
createPost(authorId: string, content: string): Promise<void>

// Get posts
getPosts(limit?: number): Promise<Post[]>

// Subscribe to posts
subscribeToposts(callback: (posts: Post[]) => void): Unsubscribe
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:
1. Check the [Issues](../../issues) page
2. Review the Firebase Console for errors
3. Ensure environment variables are properly set
4. Verify Firestore security rules are deployed

## 🗺️ Roadmap

- [ ] File sharing in chat
- [ ] Group chat functionality
- [ ] Post reactions and comments
- [ ] Push notifications
- [ ] Dark mode theme
- [ ] Advanced search filters
- [ ] User blocking/reporting
- [ ] Image posts and media gallery
