import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getUserChats } from '../../firebase/chat';
import ChatApp from './ChatApp';
import MobileChatApp from './MobileChatApp';
import { useMediaQuery } from '../../hooks/useMediaQuery';

const ResponsiveChatApp = () => {
  const { user, logout } = useAuth();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Check if screen is mobile (less than 768px)
  const isMobile = useMediaQuery('(max-width: 767px)');

  useEffect(() => {
    if (user) {
      const unsubscribe = getUserChats(
        user.uid, 
        (chats) => {
          setChats(chats);
          setLoading(false);
          setError('');
        },
        (errorMessage) => {
          setError(errorMessage);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    }
  }, [user]);

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleNewChat = () => {
    setShowNewChatModal(true);
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
  };

  const handleBackToChats = () => {
    setSelectedChat(null);
  };

  const handleChatCreated = (newChat) => {
    setSelectedChat(newChat);
    setShowNewChatModal(false);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Use mobile design for mobile devices
  if (isMobile) {
    return (
      <MobileChatApp
        chats={chats}
        selectedChat={selectedChat}
        showNewChatModal={showNewChatModal}
        showProfileModal={showProfileModal}
        error={error}
        onSignOut={handleSignOut}
        onNewChat={handleNewChat}
        onChatSelect={handleChatSelect}
        onBackToChats={handleBackToChats}
        onChatCreated={handleChatCreated}
        onCloseNewChatModal={() => setShowNewChatModal(false)}
        onCloseProfileModal={() => setShowProfileModal(false)}
        onOpenProfileModal={() => setShowProfileModal(true)}
      />
    );
  }

  // Use desktop design for larger screens
  return (
    <ChatApp
      chats={chats}
      selectedChat={selectedChat}
      showNewChatModal={showNewChatModal}
      showProfileModal={showProfileModal}
      error={error}
      onSignOut={handleSignOut}
      onNewChat={handleNewChat}
      onChatSelect={handleChatSelect}
      onChatCreated={handleChatCreated}
      onCloseNewChatModal={() => setShowNewChatModal(false)}
      onCloseProfileModal={() => setShowProfileModal(false)}
      onOpenProfileModal={() => setShowProfileModal(true)}
    />
  );
};

export default ResponsiveChatApp;
