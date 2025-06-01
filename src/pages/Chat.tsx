import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { createOrGetChatRoom } from "../services/chatService";
import { getUserById } from "../services/userService";
import ChatSidebar from "../components/ChatSidebar";
import ChatMain from "../components/ChatMain";
import type { User as AppUser } from "../types/User";
import "../styles/Chat.css";

const Chat = () => {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [selectedOtherUser, setSelectedOtherUser] = useState<AppUser | null>(
    null
  );
  const [isLoadingChat, setIsLoadingChat] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  const handleChatSelect = async (chatId: string, otherUserId: string) => {
    setIsLoadingChat(true);
    setSelectedChatId(chatId);

    try {
      const otherUser = await getUserById(otherUserId);
      setSelectedOtherUser(otherUser);
    } catch (error) {
      console.error("Error fetching other user:", error);
    } finally {
      setIsLoadingChat(false);
    }
  };

  const handleNewChat = async (otherUserId: string) => {
    if (!user) return;

    setIsLoadingChat(true);

    try {
      const chatRoomId = await createOrGetChatRoom(user.uid, otherUserId);
      const otherUser = await getUserById(otherUserId);

      setSelectedChatId(chatRoomId);
      setSelectedOtherUser(otherUser);
    } catch (error) {
      console.error("Error creating/getting chat room:", error);
    } finally {
      setIsLoadingChat(false);
    }
  };

  if (loading) {
    return <div className="chat-loading">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="chat-container">
      <div className="chat-layout">
        <ChatSidebar
          currentUserId={user.uid}
          selectedChatId={selectedChatId}
          onChatSelect={handleChatSelect}
          onNewChat={handleNewChat}
        />

        <div className="chat-main-wrapper">
          {isLoadingChat ? (
            <div className="chat-loading-overlay">
              <div className="loading-spinner"></div>
              Loading chat...
            </div>
          ) : selectedChatId && selectedOtherUser ? (
            <ChatMain
              currentUserId={user.uid}
              chatRoomId={selectedChatId}
              otherUser={selectedOtherUser}
            />
          ) : (
            <div className="chat-welcome">
              <div className="chat-welcome-content">
                <div className="chat-welcome-icon">💬</div>
                <h2>Welcome to Chat</h2>
                <p>
                  Select a conversation from the sidebar or search for a user to
                  start chatting.
                </p>
              </div>
            </div>
          )}{" "}
        </div>
      </div>
    </div>
  );
};

export default Chat;
