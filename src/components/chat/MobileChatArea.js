import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, User } from 'lucide-react';
import { getChatMessages, sendMessage, markChatAsRead } from '../../firebase/chat';
import MessageList from './MessageList';
import MobileMessageInput from './MobileMessageInput';
import { getUserDisplayName } from '../../utils/userUtils';

const MobileChatArea = ({ chat, currentUserId, userProfile, onBack }) => {
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
    
    if (chat.otherUser) {
      return getUserDisplayName(chat.otherUser);
    }
    
    if (otherId && otherId.includes('@')) {
      return getUserDisplayName({ email: otherId });
    }
    
    return getUserDisplayName({ uid: otherId });
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-black">
      {/* Chat Header */}
      <div className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 px-4 py-3">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          
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
          
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
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
        <MobileMessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default MobileChatArea;
