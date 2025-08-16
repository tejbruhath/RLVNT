import React, { useState, useEffect, useRef } from 'react';
import { getChatMessages, sendMessage, markChatAsRead } from '../../firebase/chat';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { User } from 'lucide-react';
import { getUserDisplayName } from '../../utils/userUtils';

const ChatArea = ({ chat, currentUserId, userProfile }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (chat?.id) {
      const unsubscribe = getChatMessages(chat.id, (messages) => {
        setMessages(messages);
        setLoading(false);
      });

      // Mark chat as read when opened
      markChatAsRead(chat.id, currentUserId);

      return () => unsubscribe();
    }
  }, [chat?.id, currentUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (messageData) => {
    if (!messageData.text.trim() && !messageData.imageUrl) return;

    const result = await sendMessage(chat.id, {
      ...messageData,
      senderId: currentUserId
    });

    if (!result.success) {
      console.error('Failed to send message:', result.error);
    }
  };

  const getOtherParticipant = () => {
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

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-black">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
                  <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
              {chat?.otherUser?.profilePhotoUrl ? (
                <img
                  src={chat.otherUser.profilePhotoUrl}
                  alt="Profile"
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              )}
            </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {getOtherParticipant()}
            </h2>
          </div>
        </div>
      </div>

            {/* Messages */}
      <div className="h-[calc(100vh-200px)] overflow-y-auto bg-gray-50 dark:bg-black scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
        <div className="min-h-full flex flex-col justify-end">
          <MessageList
            messages={messages}
            currentUserId={currentUserId}
            userProfile={userProfile}
            chatId={chat.id}
            onMessageDeleted={(messageId) => {
              setMessages(prev => prev.filter(msg => msg.id !== messageId));
            }}
          />
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-4">
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatArea;
