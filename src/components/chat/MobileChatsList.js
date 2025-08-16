import React from 'react';
import { User } from 'lucide-react';
import { getUserDisplayName } from '../../utils/userUtils';

const MobileChatsList = ({ chats, onChatSelect, currentUserId }) => {
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const formatLastMessage = (message) => {
    if (!message) return 'No messages yet';
    if (message.length > 50) {
      return message.substring(0, 50) + '...';
    }
    return message;
  };

  const getOtherParticipant = (chat) => {
    const otherUserId = chat.participants.find(id => id !== currentUserId);
    
    if (chat.otherUser) {
      return getUserDisplayName(chat.otherUser);
    }
    
    if (otherUserId && otherUserId.includes('@')) {
      return getUserDisplayName({ email: otherUserId });
    }
    
    return getUserDisplayName({ uid: otherUserId });
  };

  if (chats.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
            <User className="h-8 w-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No conversations yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Start a new chat to begin messaging
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-black">
      {chats.map((chat) => (
        <div
          key={chat.id}
          onClick={() => onChatSelect(chat)}
          className="flex items-center space-x-3 p-4 border-b border-gray-100 dark:border-gray-800 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-900 active:bg-gray-100 dark:active:bg-gray-800"
        >
          {/* Profile Photo */}
          <div className="relative h-12 w-12 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
            {chat.otherUser?.profilePhotoUrl ? (
              <img
                src={chat.otherUser.profilePhotoUrl}
                alt="Profile"
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <User className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            )}
            {/* Unread indicator */}
            {chat.unreadFor && chat.unreadFor.includes(currentUserId) && (
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-blue-500 rounded-full border-2 border-white dark:border-gray-800"></div>
            )}
          </div>

          {/* Chat Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium text-gray-900 dark:text-white truncate">
                {getOtherParticipant(chat)}
              </h3>
              <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
                {formatTime(chat.updatedAt)}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
              {formatLastMessage(chat.lastMessage)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MobileChatsList;
