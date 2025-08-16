import React from 'react';
import Message from './Message';

const MessageList = ({ messages, currentUserId, userProfile, chatId, onMessageDeleted }) => {
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No messages yet
          </h3>
          <p className="text-gray-500">
            Start the conversation by sending a message
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {messages.map((message, index) => {
        const isOwnMessage = message.senderId === currentUserId;
        const showAvatar = index === 0 || 
          messages[index - 1]?.senderId !== message.senderId;
        
        // Ensure consistent spacing for grouped messages
        const isFirstInGroup = index === 0 || 
          messages[index - 1]?.senderId !== message.senderId;
        const isLastInGroup = index === messages.length - 1 || 
          messages[index + 1]?.senderId !== message.senderId;
        
        return (
          <Message
            key={message.id}
            message={message}
            isOwnMessage={isOwnMessage}
            showAvatar={showAvatar}
            isFirstInGroup={isFirstInGroup}
            isLastInGroup={isLastInGroup}
            formatTime={formatTime}
            userProfile={userProfile}
            chatId={chatId}
            currentUserId={currentUserId}
            onMessageDeleted={onMessageDeleted}
          />
        );
      })}
    </div>
  );
};

export default MessageList;
