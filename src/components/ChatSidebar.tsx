import { useState, useEffect } from 'react';
import { subscribeToUserChatRooms, getOtherParticipant } from '../services/chatService';
import { searchUsers, getUserById } from '../services/userService';
import type { ChatRoom } from '../types/Chat';
import type { User as AppUser } from '../types/User';

interface ChatSidebarProps {
  currentUserId: string;
  selectedChatId: string | null;
  onChatSelect: (chatId: string, otherUserId: string) => void;
  onNewChat: (otherUserId: string) => void;
}

const ChatSidebar = ({ currentUserId, selectedChatId, onChatSelect, onNewChat }: ChatSidebarProps) => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<AppUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [userCache, setUserCache] = useState<{ [key: string]: AppUser }>({});
  // Subscribe to user's chat rooms
  useEffect(() => {
    if (!currentUserId) return;

    const unsubscribe = subscribeToUserChatRooms(currentUserId, async (rooms) => {
      setChatRooms(rooms);
      
      // Cache user data for participants
      const newUserCache = { ...userCache };
      for (const room of rooms) {
        const otherUserId = getOtherParticipant(room, currentUserId);
        if (otherUserId && !newUserCache[otherUserId]) {
          try {
            const userData = await getUserById(otherUserId);
            if (userData) {
              newUserCache[otherUserId] = userData;
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        }
      }
      setUserCache(newUserCache);
    });

    return unsubscribe;
  }, [currentUserId]);

  // Handle search
  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchUsers(term);
      setSearchResults(results.filter(user => user.uid !== currentUserId));
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const getProfilePicture = (user?: AppUser) => {
    if (user?.photoURL) {
      return user.photoURL;
    }
    return '/src/assets/profilePictures/avatar-1295394_1280.webp';
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString();
  };

  return (
    <div className="chat-sidebar">
      <div className="chat-sidebar-header">
        <h1 className="chat-sidebar-title">Messages</h1>
      </div>

      <div className="chat-search">
        <input
          type="text"
          placeholder="Search users to start a chat..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="chat-search-input"
        />
      </div>

      <div className="chat-list">
        {/* Search Results */}
        {searchTerm.trim() && (
          <>
            {isSearching ? (
              <div className="chat-loading">Searching...</div>
            ) : searchResults.length > 0 ? (
              <>
                {searchResults.map((user) => (
                  <div
                    key={`search-${user.uid}`}
                    className="chat-item"
                    onClick={() => {
                      onNewChat(user.uid);
                      setSearchTerm('');
                      setSearchResults([]);
                    }}
                  >
                    <img
                      src={getProfilePicture(user)}
                      alt={user.displayName || 'User'}
                      className="chat-item-avatar"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/src/assets/profilePictures/avatar-1295394_1280.webp';
                      }}
                    />
                    <div className="chat-item-content">
                      <h3 className="chat-item-name">
                        {user.displayName || 'Anonymous User'}
                      </h3>
                      <p className="chat-item-message">
                        Start a conversation with {user.displayName || user.email}
                      </p>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="chat-list-empty">
                No users found for "{searchTerm}"
              </div>
            )}
          </>
        )}

        {/* Existing Chat Rooms */}
        {!searchTerm.trim() && (
          <>
            {chatRooms.length === 0 ? (
              <div className="chat-list-empty">
                No conversations yet. Search for users above to start chatting!
              </div>
            ) : (
              chatRooms.map((room) => {
                const otherUserId = getOtherParticipant(room, currentUserId);
                const otherUser = userCache[otherUserId];
                
                return (
                  <div
                    key={room.id}
                    className={`chat-item ${selectedChatId === room.id ? 'active' : ''}`}
                    onClick={() => onChatSelect(room.id, otherUserId)}
                  >
                    <img
                      src={getProfilePicture(otherUser)}
                      alt={otherUser?.displayName || 'User'}
                      className="chat-item-avatar"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/src/assets/profilePictures/avatar-1295394_1280.webp';
                      }}
                    />
                    <div className="chat-item-content">
                      <h3 className="chat-item-name">
                        {otherUser?.displayName || otherUser?.email || 'Loading...'}
                      </h3>
                      <p className="chat-item-message">
                        {room.lastMessage?.content || 'No messages yet'}
                      </p>
                    </div>
                    <div className="chat-item-time">
                      {formatTime(room.lastActivity)}
                    </div>
                  </div>
                );
              })
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
