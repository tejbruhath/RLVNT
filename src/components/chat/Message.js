import React from 'react';
import { User } from 'lucide-react';
import MessageDropdown from './MessageDropdown';

const Message = ({ message, isOwnMessage, showAvatar, isFirstInGroup, isLastInGroup, formatTime, userProfile, chatId, currentUserId, onMessageDeleted }) => {
  const renderMessageContent = () => {
    if (message.type === 'image' && message.imageUrl) {
      return (
        <div className="max-w-xs">
          <img
            src={message.imageUrl}
            alt=""
            className="rounded-lg max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => window.open(message.imageUrl, '_blank')}
          />
        </div>
      );
    }
    
          return (
        <p className="text-gray-900 dark:text-white whitespace-pre-wrap break-words">
          {message.text}
        </p>
      );
  };

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} ${isOwnMessage ? 'pr-4' : 'pl-4'}`}>
      <div className={`flex ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'} items-end ${
        isOwnMessage ? 'space-x-reverse space-x-4' : 'space-x-3'
      } max-w-xs lg:max-w-md ${isOwnMessage ? 'ml-auto' : ''}`}>
        {/* Avatar */}
        {showAvatar && (
          <div className="flex-shrink-0">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
              isOwnMessage ? 'bg-blue-600' : 'bg-gray-300'
            }`}>
              {isOwnMessage && userProfile?.profilePhotoUrl ? (
                <img
                  src={userProfile.profilePhotoUrl}
                  alt="Profile"
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <User className={`h-4 w-4 ${isOwnMessage ? 'text-white' : 'text-gray-600'}`} />
              )}
            </div>
          </div>
        )}
        
        {/* Message Bubble */}
        <div className={`px-4 py-2 rounded-lg ${
          isOwnMessage 
            ? 'bg-blue-600 text-white' 
            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
        }`}>
          {renderMessageContent()}
          
          {/* Message Actions Row */}
          <div className={`flex items-center justify-between mt-2 ${
            isOwnMessage ? 'text-blue-100' : 'text-gray-500'
          }`}>
            {/* Timestamp */}
            <div className="text-xs">
              {formatTime(message.createdAt)}
            </div>
            
            {/* Message Dropdown */}
            <MessageDropdown
              message={message}
              chatId={chatId}
              currentUserId={currentUserId}
              onMessageDeleted={onMessageDeleted}
            />
          </div>
        </div>
        
        {/* Spacer for alignment when no avatar */}
        {!showAvatar && (
          <div className="w-10 flex-shrink-0"></div>
        )}
      </div>
    </div>
  );
};

export default Message;
