import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

// Firebase configuration - make sure this matches your firebaseConfig.ts
const firebaseConfig = {
  apiKey: "AIzaSyDRTrX1xn456AJuTVsy1T3MveCXFEm-xzU",
  authDomain: "project-tracker32.firebaseapp.com",
  projectId: "project-tracker32",
  storageBucket: "project-tracker32.firebasestorage.app",
  messagingSenderId: "372679884020",
  appId: "1:372679884020:web:3a066a72c9d3757acb72a1",
  measurementId: "G-KVXLQK8KVF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)

// Sample posts data
const samplePosts = [
  {
    title: "Welcome to Project Tracker!",
    content: "This is our first post on the new platform. We're excited to share updates about our projects and collaborate with the community. Feel free to like, comment, and share your thoughts! This platform will help teams stay connected and track progress on various projects.",
    authorId: "demo-user-1",
    author: {
      name: "Project Team",
      email: "team@projecttracker.com",
      photoURL: "https://ui-avatars.com/api/?name=Project+Team&background=3b82f6&color=fff"
    },
    likes: ["demo-user-2", "demo-user-3"],
    likeCount: 2,
    commentCount: 5,
    shareCount: 1,
    isPublic: true,
    isDeleted: false,
    createdAt: Timestamp.fromDate(new Date('2025-06-01T10:00:00')),
    updatedAt: Timestamp.fromDate(new Date('2025-06-01T10:00:00'))
  },
  {
    title: "New Feature Release: Real-time Collaboration",
    content: "We've just released our new real-time collaboration feature! Now you can work together with your team members in real-time, see live updates, and never miss important changes. Key features include: live cursors, real-time editing, instant notifications, and seamless synchronization across all devices. Try it out and let us know what you think!",
    authorId: "demo-user-2",
    author: {
      name: "Sarah Johnson",
      email: "sarah@company.com",
      photoURL: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=ef4444&color=fff"
    },
    likes: ["demo-user-1", "demo-user-3", "demo-user-4"],
    likeCount: 3,
    commentCount: 8,
    shareCount: 3,
    isPublic: true,
    isDeleted: false,
    createdAt: Timestamp.fromDate(new Date('2025-05-30T14:30:00')),
    updatedAt: Timestamp.fromDate(new Date('2025-05-30T14:30:00'))
  },
  {
    title: "Project Management Best Practices",
    content: "Here are some best practices we've learned while managing multiple projects:\n\n1) Set clear goals and deadlines\n2) Communicate regularly with your team\n3) Use proper project tracking tools\n4) Document everything important\n5) Regular check-ins and retrospectives\n6) Keep stakeholders informed\n\nWhat are your favorite project management tips? Share them in the comments!",
    authorId: "demo-user-3",
    author: {
      name: "Mike Chen",
      email: "mike@startup.io",
      photoURL: "https://ui-avatars.com/api/?name=Mike+Chen&background=10b981&color=fff"
    },
    likes: ["demo-user-1", "demo-user-2", "demo-user-4", "demo-user-5"],
    likeCount: 4,
    commentCount: 12,
    shareCount: 5,
    isPublic: true,
    isDeleted: false,
    createdAt: Timestamp.fromDate(new Date('2025-05-28T09:15:00')),
    updatedAt: Timestamp.fromDate(new Date('2025-05-28T09:15:00'))
  },
  {
    title: "UI/UX Design Principles for Modern Apps",
    content: "Creating intuitive and beautiful user interfaces is crucial for any successful application. Here are key principles to follow:\n\n• Consistency in design language\n• Clear visual hierarchy\n• Responsive design for all devices\n• Accessibility first approach\n• Performance optimization\n• User feedback and testing\n\nRemember: Good design is invisible - users should be able to accomplish their goals without thinking about the interface.",
    authorId: "demo-user-4",
    author: {
      name: "Emma Davis",
      email: "emma@design.co",
      photoURL: "https://ui-avatars.com/api/?name=Emma+Davis&background=8b5cf6&color=fff"
    },
    likes: ["demo-user-1", "demo-user-3", "demo-user-5"],
    likeCount: 3,
    commentCount: 6,
    shareCount: 2,
    isPublic: true,
    isDeleted: false,
    createdAt: Timestamp.fromDate(new Date('2025-05-25T16:45:00')),
    updatedAt: Timestamp.fromDate(new Date('2025-05-25T16:45:00'))
  },
  {
    title: "Private Team Update",
    content: "This is a private post that should not be visible to everyone. It contains sensitive team information and internal updates.",
    authorId: "demo-user-1",
    author: {
      name: "Project Team",
      email: "team@projecttracker.com",
      photoURL: "https://ui-avatars.com/api/?name=Project+Team&background=3b82f6&color=fff"
    },
    likes: [],
    likeCount: 0,
    commentCount: 0,
    shareCount: 0,
    isPublic: false, // This should not be visible due to Firestore rules
    isDeleted: false,
    createdAt: Timestamp.fromDate(new Date('2025-05-27T11:00:00')),
    updatedAt: Timestamp.fromDate(new Date('2025-05-27T11:00:00'))
  },
  {
    title: "Deleted Post Test",
    content: "This post has been deleted and should not be visible.",
    authorId: "demo-user-2",
    author: {
      name: "Sarah Johnson",
      email: "sarah@company.com",
      photoURL: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=ef4444&color=fff"
    },
    likes: ["demo-user-1"],
    likeCount: 1,
    commentCount: 2,
    shareCount: 0,
    isPublic: true,
    isDeleted: true, // This should not be visible due to Firestore rules
    createdAt: Timestamp.fromDate(new Date('2025-05-26T13:20:00')),
    updatedAt: Timestamp.fromDate(new Date('2025-05-26T13:20:00'))
  },
  {
    title: "Firebase Security Rules Testing",
    content: "This post is being used to test our Firestore security rules. If you can see this post, it means:\n\n✅ The post is public (isPublic: true)\n✅ The post is not deleted (isDeleted: false)\n✅ Our security rules are working correctly!\n\nThe rules should prevent you from seeing private posts or deleted posts.",
    authorId: "demo-user-5",
    author: {
      name: "Security Tester",
      email: "security@test.com",
      photoURL: "https://ui-avatars.com/api/?name=Security+Tester&background=f59e0b&color=fff"
    },
    likes: ["demo-user-1", "demo-user-2"],
    likeCount: 2,
    commentCount: 3,
    shareCount: 1,
    isPublic: true,
    isDeleted: false,
    createdAt: Timestamp.fromDate(new Date('2025-06-01T12:00:00')),
    updatedAt: Timestamp.fromDate(new Date('2025-06-01T12:00:00'))
  }
]

// Function to populate posts
async function populatePosts() {
  console.log('🚀 Starting to populate posts...')
  
  try {
    // First, authenticate with the test user
    console.log('🔐 Authenticating with test user...')
    const userCredential = await signInWithEmailAndPassword(auth, 'test@test.com', 'test123')
    const user = userCredential.user
    console.log('✅ Successfully authenticated!')
    console.log(`🆔 User UID: ${user.uid}`)
    
    const postsCollection = collection(db, 'posts')
    
    for (let i = 0; i < samplePosts.length; i++) {
      const post = samplePosts[i]
      console.log(`📝 Adding post ${i + 1}/${samplePosts.length}: "${post.title}"`)
      
      // Update the authorId to match the authenticated user's UID
      const postWithCorrectAuthor = {
        ...post,
        authorId: user.uid, // Use the actual authenticated user's UID
        author: {
          ...post.author,
          email: user.email // Also update the email to match
        }
      }
      
      const docRef = await addDoc(postsCollection, postWithCorrectAuthor)
      console.log(`✅ Post added with ID: ${docRef.id}`)
    }
    
    console.log('🎉 All posts have been successfully added to Firestore!')
    console.log('\n📊 Summary:')
    console.log(`• Total posts added: ${samplePosts.length}`)
    console.log(`• Public posts: ${samplePosts.filter(p => p.isPublic && !p.isDeleted).length}`)
    console.log(`• Private posts: ${samplePosts.filter(p => !p.isPublic).length}`)
    console.log(`• Deleted posts: ${samplePosts.filter(p => p.isDeleted).length}`)
    console.log('\n🔒 According to your Firestore rules, only public and non-deleted posts should be visible.')
    
  } catch (error) {
    console.error('❌ Error adding posts:', error)
  }
}

// Run the script
populatePosts()