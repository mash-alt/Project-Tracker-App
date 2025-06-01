import React, { useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../firebaseConfig'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { db } from '../firebaseConfig'
import defaultAvatar from '../assets/profilePictures/avatar-1295394_1280.webp'

interface CreatePostProps {
  onPostCreated?: () => void
}

const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated }) => {
  const [user] = useAuthState(auth)
  const [isExpanded, setIsExpanded] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      setError('Please sign in to create a post')
      return
    }

    if (!title.trim() || !content.trim()) {
      setError('Please fill in both title and content')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const postsCollection = collection(db, 'posts')
      
      const newPost = {
        title: title.trim(),
        content: content.trim(),
        authorId: user.uid,
        author: {
          name: user.displayName || 'Anonymous User',
          email: user.email || '',
          photoURL: user.photoURL || defaultAvatar
        },
        likes: [],
        likeCount: 0,
        commentCount: 0,
        shareCount: 0,
        isPublic: true,
        isDeleted: false,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      }

      await addDoc(postsCollection, newPost)
      
      // Reset form
      setTitle('')
      setContent('')
      setIsExpanded(false)
      
      if (onPostCreated) {
        onPostCreated()
      }
      
    } catch (err) {
      console.error('Error creating post:', err)
      setError('Failed to create post. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const profileImageSrc = user?.photoURL || defaultAvatar

  if (!user) {
    return (
      <div style={{
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        padding: '1rem',
        marginBottom: '1.5rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        color: '#718096'
      }}>
        Please sign in to create posts
      </div>
    )
  }

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      padding: '1rem',
      marginBottom: '1.5rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* User Info and Initial Input */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: isExpanded ? '1rem' : '0'
      }}>
        {/* User Avatar */}
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          overflow: 'hidden',
          flexShrink: 0
        }}>
          <img
            src={profileImageSrc}
            alt="Your avatar"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>

        {/* Input trigger */}
        {!isExpanded ? (
          <button
            onClick={() => setIsExpanded(true)}
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              backgroundColor: '#f7fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '1.5rem',
              textAlign: 'left',
              color: '#718096',
              cursor: 'pointer',
              fontSize: '0.95rem',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#edf2f7'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f7fafc'
            }}
          >
            What's on your mind, {user.displayName?.split(' ')[0] || 'there'}?
          </button>
        ) : null}
      </div>

      {/* Expanded Form */}
      {isExpanded && (
        <form onSubmit={handleSubmit}>
          {/* Title Input */}
          <input
            type="text"
            placeholder="Post title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #e2e8f0',
              borderRadius: '0.375rem',
              fontSize: '1rem',
              fontWeight: '600',
              marginBottom: '0.75rem',
              outline: 'none',
              transition: 'border-color 0.2s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#3182ce'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e2e8f0'
            }}
          />

          {/* Content Textarea */}
          <textarea
            placeholder={`What's on your mind, ${user.displayName?.split(' ')[0] || 'there'}?`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #e2e8f0',
              borderRadius: '0.375rem',
              fontSize: '0.95rem',
              marginBottom: '1rem',
              resize: 'vertical',
              outline: 'none',
              transition: 'border-color 0.2s ease',
              fontFamily: 'Inter, sans-serif'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#3182ce'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e2e8f0'
            }}
          />

          {/* Error Message */}
          {error && (
            <div style={{
              backgroundColor: '#fed7d7',
              color: '#c53030',
              padding: '0.5rem 0.75rem',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              marginBottom: '1rem'
            }}>
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <button
              type="button"
              onClick={() => {
                setIsExpanded(false)
                setTitle('')
                setContent('')
                setError(null)
              }}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#f7fafc',
                color: '#4a5568',
                border: '1px solid #e2e8f0',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !title.trim() || !content.trim()}
              style={{
                padding: '0.5rem 1.5rem',
                backgroundColor: isSubmitting || !title.trim() || !content.trim() ? '#cbd5e0' : '#3182ce',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: isSubmitting || !title.trim() || !content.trim() ? 'not-allowed' : 'pointer',
                fontSize: '0.875rem',
                fontWeight: '600',
                transition: 'background-color 0.2s ease'
              }}
            >
              {isSubmitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default CreatePost