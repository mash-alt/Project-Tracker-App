import React, { useState, useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../firebaseConfig'
import type { Post } from '../types/Post'
import defaultAvatar from '../assets/profilePictures/avatar-1295394_1280.webp'
import '../styles/PostCard.css'

interface PostCardProps {
  post: Post
  onLike?: (postId: string, userId: string, isLiked: boolean) => void
  onComment?: (postId: string) => void
  onShare?: (postId: string) => void
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  onLike,
  onComment,
  onShare
}) => {
  const [user] = useAuthState(auth)
  const [isLiked, setIsLiked] = useState(false)

  // Check if current user has liked this post
  useEffect(() => {
    if (user && post.likes) {
      setIsLiked(post.likes.includes(user.uid))
    }
  }, [user, post.likes])

  const handleLike = () => {
    if (user && onLike) {
      onLike(post.id, user.uid, isLiked)
    }
  }

  const handleComment = () => {
    if (onComment) {
      onComment(post.id)
    }
  }

  const handleShare = () => {
    if (onShare) {
      onShare(post.id)
    }
  }

  // Format the date
  const formatDate = (timestamp: any) => {
    if (timestamp?.toDate) {
      return timestamp.toDate().toLocaleDateString()
    }
    return new Date().toLocaleDateString()
  }
  return (
    <div className="post-card">      {/* Post Header */}
      <div className="post-header">
        <div className="post-author-info">
          {/* Author Avatar */}          <div 
            className="author-avatar"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: post.author.photoURL
                ? `url(${post.author.photoURL}) center/cover`
                : `url(${defaultAvatar}) center/cover`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              marginRight: '0.75rem'
            }}
          />
          <div>
            <h3 className="post-title">{post.title}</h3>
            <div className="post-meta">
              <span className="post-author">{post.author.name}</span>
              <span>•</span>
              <span className="post-date">{formatDate(post.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="post-content">
        {post.content}
      </div>

      {/* Post Actions */}
      <div className="post-actions">
        {/* Like Button */}
        <button
          onClick={handleLike}
          className={`action-button like-button ${isLiked ? 'liked' : ''}`}
          disabled={!user}
        >
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
            />
          </svg>
          <span className="action-count">{post.likeCount}</span>
        </button>

        {/* Comment Button */}
        <button
          onClick={handleComment}
          className="action-button comment-button"
        >
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
            />
          </svg>
          <span className="action-count">{post.commentCount}</span>
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="action-button share-button"
        >
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" 
            />
          </svg>
          Share
        </button>
      </div>
    </div>
  )
}

export default PostCard