import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Your web app's Firebase configuration (same as in firebaseConfig.ts)
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
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample users data
const testUsers = [
  {
    uid: 'user1',
    email: 'john.doe@example.com',
    displayName: 'John Doe',
    photoURL: '',
    createdAt: new Date('2024-01-15'),
    lastLoginAt: new Date('2024-12-01')
  },
  {
    uid: 'user2',
    email: 'jane.smith@example.com',
    displayName: 'Jane Smith',
    photoURL: '',
    createdAt: new Date('2024-02-20'),
    lastLoginAt: new Date('2024-11-30')
  },
  {
    uid: 'user3',
    email: 'bob.wilson@example.com',
    displayName: 'Bob Wilson',
    photoURL: '',
    createdAt: new Date('2024-03-10'),
    lastLoginAt: new Date('2024-11-29')
  },
  {
    uid: 'user4',
    email: 'alice.brown@example.com',
    displayName: 'Alice Brown',
    photoURL: '',
    createdAt: new Date('2024-04-05'),
    lastLoginAt: new Date('2024-11-28')
  },
  {
    uid: 'user5',
    email: 'charlie.davis@example.com',
    displayName: 'Charlie Davis',
    photoURL: '',
    createdAt: new Date('2024-05-12'),
    lastLoginAt: new Date('2024-11-27')
  },
  {
    uid: 'user6',
    email: 'sarah.miller@example.com',
    displayName: 'Sarah Miller',
    photoURL: '',
    createdAt: new Date('2024-06-18'),
    lastLoginAt: new Date('2024-11-26')
  },
  {
    uid: 'user7',
    email: 'mike.johnson@example.com',
    displayName: 'Mike Johnson',
    photoURL: '',
    createdAt: new Date('2024-07-22'),
    lastLoginAt: new Date('2024-11-25')
  },
  {
    uid: 'user8',
    email: 'emma.white@example.com',
    displayName: 'Emma White',
    photoURL: '',
    createdAt: new Date('2024-08-14'),
    lastLoginAt: new Date('2024-11-24')
  },
  {
    uid: 'user9',
    email: 'david.taylor@example.com',
    displayName: 'David Taylor',
    photoURL: '',
    createdAt: new Date('2024-09-03'),
    lastLoginAt: new Date('2024-11-23')
  },
  {
    uid: 'user10',
    email: 'lisa.anderson@example.com',
    displayName: 'Lisa Anderson',
    photoURL: '',
    createdAt: new Date('2024-10-08'),
    lastLoginAt: new Date('2024-11-22')
  }
];

async function populateUsers() {
  try {
    console.log('Starting to populate users...');
    
    for (const user of testUsers) {
      const userRef = doc(db, 'users', user.uid);
      const { uid, ...userData } = user;
      await setDoc(userRef, userData);
      console.log(`Added user: ${user.displayName} (${user.email})`);
    }
    
    console.log('Successfully populated all test users!');
    process.exit(0);
  } catch (error) {
    console.error('Error populating users:', error);
    process.exit(1);
  }
}

populateUsers();
