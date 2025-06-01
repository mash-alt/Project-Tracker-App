import { db } from '../firebaseConfig';
import { collection, query, where, getDocs, limit, orderBy, doc, setDoc, getDoc } from 'firebase/firestore';
import type { User as AppUser } from '../types/User';
import type { User as FirebaseUser } from 'firebase/auth';

// Save or update user data in Firestore
export const saveUserToFirestore = async (firebaseUser: FirebaseUser) => {
  try {
    const userRef = doc(db, 'users', firebaseUser.uid);
    const userDoc = await getDoc(userRef);
    
    const userData: Omit<AppUser, 'uid'> = {
      email: firebaseUser.email || '',
      displayName: firebaseUser.displayName || '',
      photoURL: firebaseUser.photoURL || '',
      createdAt: userDoc.exists() ? userDoc.data().createdAt : new Date(),
      lastLoginAt: new Date()
    };

    await setDoc(userRef, userData, { merge: true });
    console.log('User saved to Firestore:', firebaseUser.uid);
  } catch (error) {
    console.error('Error saving user to Firestore:', error);
    throw error;
  }
};

// Search users by display name or email
export const searchUsers = async (searchTerm: string, limitCount: number = 10): Promise<AppUser[]> => {
  if (!searchTerm.trim()) {
    return [];
  }

  try {
    const usersRef = collection(db, 'users');
    const results: AppUser[] = [];

    // Search by display name (case-insensitive)
    if (searchTerm.length > 0) {
      const displayNameQuery = query(
        usersRef,
        where('displayName', '>=', searchTerm),
        where('displayName', '<=', searchTerm + '\uf8ff'),
        orderBy('displayName'),
        limit(limitCount)
      );

      const displayNameSnapshot = await getDocs(displayNameQuery);
      displayNameSnapshot.forEach((doc) => {
        const userData = doc.data() as AppUser;
        results.push({ ...userData, uid: doc.id });
      });
    }

    // Search by email (case-insensitive)
    const emailQuery = query(
      usersRef,
      where('email', '>=', searchTerm.toLowerCase()),
      where('email', '<=', searchTerm.toLowerCase() + '\uf8ff'),
      orderBy('email'),
      limit(limitCount)
    );

    const emailSnapshot = await getDocs(emailQuery);
    emailSnapshot.forEach((doc) => {
      const userData = doc.data() as AppUser;
      const userExists = results.some(user => user.uid === doc.id);
      if (!userExists) {
        results.push({ ...userData, uid: doc.id });
      }
    });

    // Remove duplicates and return limited results
    const uniqueResults = results.filter((user, index, self) => 
      index === self.findIndex(u => u.uid === user.uid)
    );

    return uniqueResults.slice(0, limitCount);
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
};

// Get all users (for development/testing purposes)
export const getAllUsers = async (limitCount: number = 20): Promise<AppUser[]> => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('displayName'), limit(limitCount));
    const snapshot = await getDocs(q);
    
    const users: AppUser[] = [];
    snapshot.forEach((doc) => {
      const userData = doc.data() as AppUser;
      users.push({ ...userData, uid: doc.id });
    });

    return users;
  } catch (error) {
    console.error('Error getting all users:', error);
    throw error;
  }
};

// Get a specific user by ID
export const getUserById = async (userId: string): Promise<AppUser | null> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data() as AppUser;
      return { ...userData, uid: userDoc.id };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting user by ID:', error);
    throw error;
  }
};
