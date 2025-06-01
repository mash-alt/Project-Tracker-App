import { Timestamp } from 'firebase/firestore'

export interface Post {
  // Required fields
  id: string                    // Document ID
  title: string                 // Post title
  content: string               // Post content text
  authorId: string              // User ID of the post creator
  createdAt: Timestamp          // When the post was created
  updatedAt: Timestamp          // When the post was last modified

  // Author information (denormalized for performance)
  author: {
    name: string                // Author's display name
    email?: string              // Author's email (optional)
    photoURL?: string           // Author's profile picture URL
  }

  // Engagement metrics
  likes: string[]               // Array of user IDs who liked the post
  likeCount: number            // Total number of likes
  commentCount: number         // Total number of comments
  shareCount: number           // Total number of shares
  // Additional metadata
  isPublic: boolean            // Whether the post is publicly visible
  isDeleted: boolean           // Whether the post is deleted (soft delete)
  attachments?: {              // Optional file attachments
    type: 'image' | 'file'
    url: string
    name: string
  }[]
}
