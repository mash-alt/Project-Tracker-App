import { useState, useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../firebaseConfig'
import PostCard from '../components/PostCard'
import CreatePost from '../components/CreatePost'
import type { Post } from '../types/Post'
import { subscribeToPosts, likePost, sharePost } from '../services/postService'

const HomeFeed = () => {
  const [user] = useAuthState(auth)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Subscribe to real-time posts updates
  useEffect(() => {
    const unsubscribe = subscribeToPosts((newPosts) => {
      setPosts(newPosts)
      setLoading(false)
    })

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [])

  const handleLike = async (postId: string, userId: string, isLiked: boolean) => {
    if (!user) {
      setError('Please sign in to like posts')
      return
    }
    
    try {
      await likePost(postId, userId, isLiked)
      // The real-time subscription will automatically update the UI
      setError(null) // Clear any previous errors
    } catch (err) {
      console.error('Error liking post:', err)
      setError('Failed to like post')
    }
  }

  const handleComment = (postId: string) => {
    // TODO: Implement comment functionality
    console.log(`Comment on post ${postId}`)
    // For now, just log - you can implement a comment modal/form later
  }
  const handleShare = async (postId: string) => {
    try {
      await sharePost(postId)
      // Show success message or copy link to clipboard
      console.log(`Shared post ${postId}`)
    } catch (err) {
      console.error('Error sharing post:', err)
      setError('Failed to share post')
    }
  }

  const handlePostCreated = () => {
    // The real-time subscription will automatically pick up the new post
    // We could also show a success message here
    console.log('New post created successfully!')
  }
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc', 
      padding: '2rem 1rem' 
    }}>
      <div style={{ 
        maxWidth: '600px', 
        margin: '0 auto' 
      }}>        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: '600', 
          color: '#1a202c', 
          marginBottom: '2rem', 
          textAlign: 'center',
          fontFamily: 'Inter, sans-serif'
        }}>
          Project Feed
        </h1>

        {/* Create Post Component */}
        <CreatePost onPostCreated={handlePostCreated} />

        {/* Error message */}
        {error && (
          <div style={{
            backgroundColor: '#fed7d7',
            color: '#c53030',
            padding: '1rem',
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            color: '#718096'
          }}>
            Loading posts...
          </div>
        ) : posts.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            color: '#718096'
          }}>
            No posts yet. Be the first to create one!
          </div>
        ) : (
          // Render posts
          posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onLike={handleLike}
              onComment={handleComment}
              onShare={handleShare}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default HomeFeed