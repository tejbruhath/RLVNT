import React from 'react';
import { MessageCircle, User } from 'lucide-react';
import { getUserDisplayName } from '../../utils/userUtils';

const Sidebar = ({ chats, selectedChat, onChatSelect, currentUserId }) => {
  const formatLastMessage = (message) => {
    if (!message) return 'No messages yet';
    if (message.length > 30) {
      return message.substring(0, 30) + '...';
    }
    return message;
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const getOtherParticipant = (chat) => {
    const otherId = chat.participants.find(id => id !== currentUserId);
    
    // Try to get user details from the chat object if available
    if (chat.otherUser) {
      return getUserDisplayName(chat.otherUser);
    }
    
    // If we have the other user's email in participants, extract username
    if (otherId && otherId.includes('@')) {
      return getUserDisplayName({ email: otherId });
    }
    
    // Fallback to formatted UID
    return getUserDisplayName({ uid: otherId });
  };

  if (chats.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center">
          <MessageCircle className="mx-auto h-12 w-12 text-gray-300 mb-2" />
          <p className="text-sm text-gray-500">No conversations yet</p>
          <p className="text-xs text-gray-400">Start a new chat to begin messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {chats.map((chat) => {
        const isSelected = selectedChat?.id === chat.id;
        const otherParticipant = getOtherParticipant(chat);
        
        return (
                      <div
              key={chat.id}
              onClick={() => onChatSelect(chat)}
              className={`p-4 border-b border-gray-100 dark:border-gray-800 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-900 ${
                isSelected ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-500' : ''
              }`}
            >
                          <div className="flex items-center space-x-3">
                <div className="relative h-10 w-10 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {chat.otherUser?.profilePhotoUrl ? (
                    <img
                      src={chat.otherUser.profilePhotoUrl}
                      alt="Profile"
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  )}
                  {/* Unread indicator */}
                  {chat.unreadFor && chat.unreadFor.includes(currentUserId) && (
                    <div className="absolute -top-1 -right-1 h-4 w-4 bg-blue-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                  )}
                </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {otherParticipant}
                  </h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                    {formatTime(chat.updatedAt)}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                  {formatLastMessage(chat.lastMessage)}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Sidebar;
