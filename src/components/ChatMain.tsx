import { useState, useEffect, useRef } from 'react';
import { subscribeToMessages, sendMessage, markMessagesAsRead } from '../services/chatService';
import type { Message } from '../types/Chat';
import type { User as AppUser } from '../types/User';

interface ChatMainProps {
  currentUserId: string;
  chatRoomId: string | null;
  otherUser: AppUser | null;
}

const ChatMain = ({ currentUserId, chatRoomId, otherUser }: ChatMainProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Subscribe to messages
  useEffect(() => {
    if (!chatRoomId) {
      setMessages([]);
      return;
    }

    const unsubscribe = subscribeToMessages(chatRoomId, (newMessages) => {
      setMessages(newMessages);
      
      // Mark messages as read
      markMessagesAsRead(chatRoomId, currentUserId);
    });

    return unsubscribe;
  }, [chatRoomId, currentUserId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 128)}px`;
    }
  }, [newMessage]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !chatRoomId || !otherUser || isSending) return;

    setIsSending(true);
    try {
      await sendMessage(chatRoomId, currentUserId, otherUser.uid, newMessage.trim());
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getProfilePicture = (user?: AppUser) => {
    if (user?.photoURL) {
      return user.photoURL;
    }
    return '/src/assets/profilePictures/avatar-1295394_1280.webp';
  };

  // Group messages by sender and time proximity
  const groupMessages = (messages: Message[]) => {
    const groups: Message[][] = [];
    let currentGroup: Message[] = [];

    messages.forEach((message, index) => {
      const prevMessage = messages[index - 1];
      const shouldGroup = prevMessage && 
        prevMessage.senderId === message.senderId &&
        (message.timestamp.getTime() - prevMessage.timestamp.getTime()) < 60000; // 1 minute

      if (shouldGroup) {
        currentGroup.push(message);
      } else {
        if (currentGroup.length > 0) {
          groups.push([...currentGroup]);
        }
        currentGroup = [message];
      }
    });

    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }

    return groups;
  };

  if (!chatRoomId || !otherUser) {
    return (
      <div className="chat-main">
        <div className="chat-main-empty">
          <div className="chat-main-empty-icon">💬</div>
          <p className="chat-main-empty-text">
            Select a conversation to start messaging
          </p>
        </div>
      </div>
    );
  }

  const messageGroups = groupMessages(messages);

  return (
    <div className="chat-main">
      {/* Chat Header */}
      <div className="chat-header">
        <img
          src={getProfilePicture(otherUser)}
          alt={otherUser.displayName || 'User'}
          className="chat-header-avatar"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/src/assets/profilePictures/avatar-1295394_1280.webp';
          }}
        />
        <div className="chat-header-info">
          <h2 className="chat-header-name">
            {otherUser.displayName || 'Anonymous User'}
          </h2>
          <p className="chat-header-status">
            {otherUser.email}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messageGroups.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            color: '#718096', 
            padding: '2rem',
            fontStyle: 'italic'
          }}>
            No messages yet. Start the conversation!
          </div>
        ) : (
          messageGroups.map((group, groupIndex) => {
            const isOwnMessage = group[0].senderId === currentUserId;
            
            return (
              <div 
                key={groupIndex} 
                className={`message-group ${isOwnMessage ? 'own' : 'other'}`}
              >
                {group.map((message, messageIndex) => (
                  <div key={message.id}>
                    <div className={`message ${isOwnMessage ? 'own' : 'other'}`}>
                      {message.content}
                    </div>
                    {messageIndex === group.length - 1 && (
                      <div className="message-time">
                        {formatMessageTime(message.timestamp)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="chat-input-container">
        <form onSubmit={handleSendMessage} className="chat-input-form">
          <textarea
            ref={textareaRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Message ${otherUser.displayName || otherUser.email}...`}
            className="chat-input"
            rows={1}
            disabled={isSending}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || isSending}
            className="chat-send-button"
          >
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatMain;
