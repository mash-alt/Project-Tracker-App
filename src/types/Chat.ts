import { Timestamp } from 'firebase/firestore'

export interface Message {
  id: string
  chatRoomId: string
  senderId: string
  receiverId: string
  content: string
  timestamp: Date
  read: boolean
  type?: 'text' | 'image' | 'file'
}

export interface ChatRoom {
  id: string
  participants: string[] // Array of user IDs
  participantDetails?: {
    [userId: string]: {
      displayName: string
      photoURL?: string
      email: string
    }
  }
  lastMessage?: {
    content: string
    senderId: string
    timestamp: Timestamp
  }
  lastActivity: Date
  createdAt: Date
}

export interface ChatParticipant {
  uid: string
  displayName: string
  email: string
  photoURL?: string
}
