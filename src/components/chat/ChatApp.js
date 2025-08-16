import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';
import NewChatModal from './NewChatModal';
import { LogOut, Plus, User, Github, Linkedin } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';
import { getUserDisplayName } from '../../utils/userUtils';
import ProfileModal from '../profile/ProfileModal';

const ChatApp = ({
  chats,
  selectedChat,
  showNewChatModal,
  showProfileModal,
  error,
  onSignOut,
  onNewChat,
  onChatSelect,
  onChatCreated,
  onCloseNewChatModal,
  onCloseProfileModal,
  onOpenProfileModal
}) => {
  const { user, userProfile } = useAuth();
  // Theme context is used for dark mode styling



  return (
    <div className="h-screen flex bg-gray-50 dark:bg-black">
      {/* Sidebar */}
      <div className="w-80 bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
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
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  {getUserDisplayName(userProfile || user)}
                </h2>
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
          <div className="p-4 bg-red-50 border-b border-red-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
                {error.includes('index is being created') && (
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-1 text-sm text-red-600 hover:text-red-500 underline"
                  >
                    Refresh page
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Chat List */}
        <Sidebar
          chats={chats}
          selectedChat={selectedChat}
          onChatSelect={onChatSelect}
          currentUserId={user?.uid}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <ChatArea
            chat={selectedChat}
            currentUserId={user?.uid}
            userProfile={userProfile}
          />
                       ) : (
                 <div className="flex-1 flex items-center justify-center relative overflow-hidden">
                   {/* Spline 3D Scene */}
                   <spline-viewer loading-anim-type="none" url="https://prod.spline.design/LHDqPnbpu-6CCtEW/scene.splinecode" style={{width: '100%', height: '100%'}}></spline-viewer>

                   {/* Creator Info Overlay */}
                   <div className="absolute bottom-6 right-6 z-20 text-right">
                     <div className="bg-black/40 backdrop-blur-md rounded-lg p-4 border border-purple-500/30">
                       <p className="text-sm font-medium text-white/90 mb-1 drop-shadow-lg">
                         Made by <span className="text-purple-200 font-semibold">B Tejbruhath</span>
                       </p>
                       <p className="text-xs text-white/70 mb-3 drop-shadow-lg">
                         4th year CSE student
                       </p>
                       <div className="flex items-center justify-end space-x-3">
                         <a
                           href="https://github.com/tejbruhath"
                           target="_blank"
                           rel="noopener noreferrer"
                           className="p-2 rounded-full bg-purple-600/20 hover:bg-purple-500/30 transition-all duration-300 hover:scale-110 border border-purple-400/20"
                           title="GitHub Profile"
                         >
                           <Github className="w-4 h-4 text-white/90" />
                         </a>
                         <a
                           href="https://in.linkedin.com/in/tej-bruhath-b-405172246"
                           target="_blank"
                           rel="noopener noreferrer"
                           className="p-2 rounded-full bg-purple-600/20 hover:bg-purple-500/30 transition-all duration-300 hover:scale-110 border border-purple-400/20"
                           title="LinkedIn Profile"
                         >
                           <Linkedin className="w-4 h-4 text-white/90" />
                         </a>
                       </div>
                     </div>
                   </div>
                 </div>
               )}
      </div>

              {/* New Chat Modal */}
        {showNewChatModal && (
          <NewChatModal
            onClose={onCloseNewChatModal}
            onChatCreated={onChatCreated}
            currentUserId={user?.uid}
          />
        )}

        {/* Profile Modal */}
        <ProfileModal
          isOpen={showProfileModal}
          onClose={onCloseProfileModal}
        />
      </div>
    );
  };

export default ChatApp;
