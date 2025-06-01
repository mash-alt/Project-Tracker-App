import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove, 
  increment,
  Timestamp 
} from 'firebase/firestore'
import { db } from '../firebaseConfig'
import type { Post } from '../types/Post'

// Get posts collection reference
const postsCollection = collection(db, 'posts')

// Subscribe to posts with real-time updates
export const subscribeToPosts = (callback: (posts: Post[]) => void) => {
  const q = query(postsCollection, orderBy('createdAt', 'desc'))
  
  return onSnapshot(q, (snapshot) => {
    const posts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Post[]
    
    callback(posts)
  })
}

// Like a post
export const likePost = async (postId: string, userId: string, isLiked: boolean) => {
  const postRef = doc(db, 'posts', postId)
  
  if (isLiked) {
    // Remove like
    await updateDoc(postRef, {
      likes: arrayRemove(userId),
      likeCount: increment(-1),
      updatedAt: Timestamp.now()
    })
  } else {
    // Add like
    await updateDoc(postRef, {
      likes: arrayUnion(userId),
      likeCount: increment(1),
      updatedAt: Timestamp.now()
    })
  }
}

// Update share count
export const sharePost = async (postId: string) => {
  const postRef = doc(db, 'posts', postId)
  
  await updateDoc(postRef, {
    shareCount: increment(1),
    updatedAt: Timestamp.now()
  })
}
