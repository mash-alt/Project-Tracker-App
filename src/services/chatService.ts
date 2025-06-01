import { db } from '../firebaseConfig';
import { 
  collection, 
  doc, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  where, 
  limit,
  getDocs,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import type { Message, ChatRoom } from '../types/Chat';

// Create or get existing chat room between two users
export const createOrGetChatRoom = async (currentUserId: string, otherUserId: string): Promise<string> => {
  try {
    // Check if chat room already exists
    const chatsRef = collection(db, 'chats');
    const q = query(
      chatsRef,
      where('participants', 'array-contains', currentUserId)
    );
    
    const snapshot = await getDocs(q);
    let existingChatId: string | null = null;
    
    snapshot.forEach((doc) => {
      const chatData = doc.data() as ChatRoom;
      if (chatData.participants.includes(otherUserId)) {
        existingChatId = doc.id;
      }
    });
    
    if (existingChatId) {
      return existingChatId;
    }
    
    // Create new chat room
    const newChatRoom = {
      participants: [currentUserId, otherUserId],
      participantDetails: {},
      createdAt: serverTimestamp(),
      lastActivity: serverTimestamp()
    };
    
    const docRef = await addDoc(chatsRef, newChatRoom);
    return docRef.id;
  } catch (error) {
    console.error('Error creating/getting chat room:', error);
    throw error;
  }
};

// Send a message
export const sendMessage = async (
  chatRoomId: string, 
  senderId: string, 
  receiverId: string, 
  content: string
): Promise<void> => {
  try {
    // Add message to messages collection
    const messagesRef = collection(db, 'messages');
    const messageData = {
      chatRoomId,
      senderId,
      receiverId,
      content,
      timestamp: serverTimestamp(),
      read: false,
      type: 'text'
    };
    
    await addDoc(messagesRef, messageData);
    
    // Update chat room's last message and activity
    const chatRoomRef = doc(db, 'chats', chatRoomId);
    await updateDoc(chatRoomRef, {
      lastMessage: {
        content,
        senderId,
        timestamp: serverTimestamp()
      },
      lastActivity: serverTimestamp()
    });
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// Subscribe to messages in a chat room
export const subscribeToMessages = (
  chatRoomId: string, 
  callback: (messages: Message[]) => void
) => {
  const messagesRef = collection(db, 'messages');
  const q = query(
    messagesRef,
    where('chatRoomId', '==', chatRoomId),
    orderBy('timestamp', 'asc')
  );

  return onSnapshot(q, (snapshot) => {
    const messages: Message[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      messages.push({
        id: doc.id,
        chatRoomId: data.chatRoomId,
        senderId: data.senderId,
        receiverId: data.receiverId,
        content: data.content,
        timestamp: data.timestamp?.toDate() || new Date(),
        read: data.read || false
      });
    });
    callback(messages);
  });
};

// Subscribe to user's chat rooms
export const subscribeToUserChatRooms = (
  userId: string,
  callback: (chatRooms: ChatRoom[]) => void
) => {
  const chatsRef = collection(db, 'chats');
  const q = query(
    chatsRef,
    where('participants', 'array-contains', userId),
    orderBy('lastActivity', 'desc')
  );

  return onSnapshot(q, 
    (snapshot) => {
      const chatRooms: ChatRoom[] = [];
      snapshot.forEach((doc) => {
        try {
          const data = doc.data();
          chatRooms.push({
            id: doc.id,
            participants: data.participants || [],
            participantDetails: data.participantDetails || {},
            lastMessage: data.lastMessage ? {
              content: data.lastMessage.content,
              senderId: data.lastMessage.senderId,
              timestamp: data.lastMessage.timestamp
            } : undefined,
            lastActivity: data.lastActivity?.toDate() || new Date(),
            createdAt: data.createdAt?.toDate() || new Date()
          });
        } catch (error) {
          console.error('Error processing chat room:', error);
        }
      });
      callback(chatRooms);
    },
    (error) => {
      console.error('Error in chat rooms subscription:', error);
      // Call callback with empty array on error to prevent app crash
      callback([]);
    }
  );
};

// Get user's chat rooms (non-real-time)
export const getUserChatRooms = async (userId: string): Promise<ChatRoom[]> => {
  try {
    const chatsRef = collection(db, 'chats');
    const q = query(
      chatsRef, 
      where('participants', 'array-contains', userId),
      orderBy('lastActivity', 'desc'),
      limit(20)
    );

    const snapshot = await getDocs(q);
    const chatRooms: ChatRoom[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      chatRooms.push({
        id: doc.id,
        participants: data.participants,
        participantDetails: data.participantDetails || {},
        lastMessage: data.lastMessage,
        lastActivity: data.lastActivity?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date()
      });
    });

    return chatRooms;
  } catch (error) {
    console.error('Error getting user chat rooms:', error);
    throw error;
  }
};

// Get other participant in a chat room
export const getOtherParticipant = (chatRoom: ChatRoom, currentUserId: string): string => {
  return chatRoom.participants.find(id => id !== currentUserId) || '';
};

// Mark messages as read
export const markMessagesAsRead = async (chatRoomId: string, userId: string): Promise<void> => {
  try {
    const messagesRef = collection(db, 'messages');
    const q = query(
      messagesRef,
      where('chatRoomId', '==', chatRoomId),
      where('receiverId', '==', userId),
      where('read', '==', false)
    );

    const snapshot = await getDocs(q);
    const updatePromises = snapshot.docs.map(doc => 
      updateDoc(doc.ref, { read: true })
    );

    await Promise.all(updatePromises);
  } catch (error) {
    console.error('Error marking messages as read:', error);
  }
};
