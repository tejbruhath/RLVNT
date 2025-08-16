import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import MobileChatsList from './MobileChatsList';
import MobileChatArea from './MobileChatArea';
import NewChatModal from './NewChatModal';
import ProfileModal from '../profile/ProfileModal';
import { LogOut, Plus, User } from 'lucide-react';
import { getUserDisplayName } from '../../utils/userUtils';
import ThemeToggle from '../ui/ThemeToggle';

const MobileChatApp = ({
  chats,
  selectedChat,
  showNewChatModal,
  showProfileModal,
  error,
  onSignOut,
  onNewChat,
  onChatSelect,
  onBackToChats,
  onChatCreated,
  onCloseNewChatModal,
  onCloseProfileModal,
  onOpenProfileModal
}) => {
  const { user, userProfile } = useAuth();





  // Show chat area if a chat is selected
  if (selectedChat) {
    return (
      <div className="h-screen bg-gray-50 dark:bg-black">
        <MobileChatArea
          chat={selectedChat}
          currentUserId={user?.uid}
          userProfile={userProfile}
          onBack={onBackToChats}
        />
      </div>
    );
  }

  // Show chats list as main page
  return (
    <div className="h-screen bg-gray-50 dark:bg-black">
      {/* Header */}
      <div className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenProfileModal}
              className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors overflow-hidden"
            >
              {userProfile?.profilePhotoUrl ? (
                <img
                  src={userProfile.profilePhotoUrl}
                  alt="Profile"
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <User className="h-6 w-6 text-white" />
              )}
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                {getUserDisplayName(userProfile || user)}
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
                          <button
                onClick={onNewChat}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                title="New chat"
              >
                <Plus className="h-5 w-5" />
              </button>
              <button
                onClick={onSignOut}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                title="Sign out"
              >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-4 w-4 bg-red-400 rounded-full"></div>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Chats List */}
      <div className="flex-1 overflow-y-auto">
        <MobileChatsList
          chats={chats}
          onChatSelect={onChatSelect}
          currentUserId={user?.uid}
        />
      </div>

      {/* Modals */}
              {showNewChatModal && (
          <NewChatModal
            onClose={onCloseNewChatModal}
            onChatCreated={onChatCreated}
            currentUserId={user?.uid}
          />
        )}

        <ProfileModal
          isOpen={showProfileModal}
          onClose={onCloseProfileModal}
        />
    </div>
  );
};

export default MobileChatApp;
