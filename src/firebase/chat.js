import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  serverTimestamp,
  getDocs,
  getDoc
} from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db } from './config';
import { storage } from './config';
import { getUserProfile } from './auth';

// Create a new chat conversation
export const createChat = async (participants) => {
  try {
    // Check if chat already exists between these users
    const existingChat = await findExistingChat(participants);
    if (existingChat) {
      return { success: true, chatId: existingChat.id, isNew: false };
    }

    // Create new chat
    const chatRef = await addDoc(collection(db, 'chats'), {
      participants: participants.sort(), // Sort for consistent querying
      lastMessage: '',
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp()
    });

    return { success: true, chatId: chatRef.id, isNew: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Find existing chat between two users
const findExistingChat = async (participants) => {
  try {
    const sortedParticipants = participants.sort();
    const q = query(
      collection(db, 'chats'),
      where('participants', '==', sortedParticipants)
    );
    
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
    }
    return null;
  } catch (error) {
    console.error('Error finding existing chat:', error);
    return null;
  }
};

// Send a message
export const sendMessage = async (chatId, messageData) => {
  try {
    const messageRef = await addDoc(collection(db, 'chats', chatId, 'messages'), {
      text: messageData.text || '',
      imageUrl: messageData.imageUrl || null,
      senderId: messageData.senderId,
      createdAt: serverTimestamp(),
      type: messageData.imageUrl ? 'image' : 'text'
    });

    // Get chat data to find other participants
    const chatDoc = await getDoc(doc(db, 'chats', chatId));
    if (chatDoc.exists()) {
      const chatData = chatDoc.data();
      const otherParticipants = chatData.participants.filter(id => id !== messageData.senderId);
      
      // Update chat's last message, timestamp, and mark as unread for other participants
      await updateDoc(doc(db, 'chats', chatId), {
        lastMessage: messageData.text || 'Image sent',
        updatedAt: serverTimestamp(),
        unreadFor: otherParticipants
      });
    }

    return { success: true, messageId: messageRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get messages for a chat
export const getChatMessages = (chatId, callback) => {
  const q = query(
    collection(db, 'chats', chatId, 'messages'),
    orderBy('createdAt', 'asc')
  );

  return onSnapshot(q, (snapshot) => {
    const messages = [];
    snapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() });
    });
    callback(messages);
  });
};

// Get user's chats
export const getUserChats = (userId, callback, errorCallback) => {
  // Try the optimized query first (requires index)
  const optimizedQuery = query(
    collection(db, 'chats'),
    where('participants', 'array-contains', userId),
    orderBy('updatedAt', 'desc')
  );

  // Fallback query without ordering (no index required)
  const fallbackQuery = query(
    collection(db, 'chats'),
    where('participants', 'array-contains', userId)
  );

  let unsubscribe = null;

  const processChats = async (chats) => {
    // Enhance chats with user details
    const enhancedChats = await Promise.all(
      chats.map(async (chat) => {
        const otherUserId = chat.participants.find(id => id !== userId);
        if (otherUserId) {
          try {
            const userResult = await getUserProfile(otherUserId);
            if (userResult.success) {
              return {
                ...chat,
                otherUser: userResult.data
              };
            }
          } catch (error) {
            console.log('Could not fetch user details for:', otherUserId);
          }
        }
        return chat;
      })
    );
    
    callback(enhancedChats);
  };

  const tryOptimizedQuery = () => {
    unsubscribe = onSnapshot(optimizedQuery, 
      (snapshot) => {
        const chats = [];
        snapshot.forEach((doc) => {
          chats.push({ id: doc.id, ...doc.data() });
        });
        processChats(chats);
      },
      (error) => {
        console.error('Error with optimized query:', error);
        
        // If index is missing, try fallback query
        if (error.code === 'failed-precondition') {
          console.log('Trying fallback query without index...');
          tryFallbackQuery();
        } else {
          const errorMessage = 'Failed to load chats. Please try again.';
          if (errorCallback) {
            errorCallback(errorMessage);
          }
        }
      }
    );
  };

  const tryFallbackQuery = () => {
    if (unsubscribe) {
      unsubscribe();
    }
    
    unsubscribe = onSnapshot(fallbackQuery, 
      (snapshot) => {
        const chats = [];
        snapshot.forEach((doc) => {
          chats.push({ id: doc.id, ...doc.data() });
        });
        // Sort manually as fallback
        chats.sort((a, b) => {
          const aTime = a.updatedAt?.toDate?.() || a.updatedAt || new Date(0);
          const bTime = b.updatedAt?.toDate?.() || b.updatedAt || new Date(0);
          return bTime - aTime;
        });
        processChats(chats);
        
        // Show info about index building
        if (errorCallback) {
          errorCallback('Using basic chat loading. Index is being created for better performance.');
        }
      },
      (error) => {
        console.error('Error with fallback query:', error);
        const errorMessage = 'Failed to load chats. Please try again.';
        if (errorCallback) {
          errorCallback(errorMessage);
        }
      }
    );
  };

  // Start with optimized query
  tryOptimizedQuery();

  // Return unsubscribe function
  return () => {
    if (unsubscribe) {
      unsubscribe();
    }
  };
};

// Get chat details
export const getChatDetails = async (chatId) => {
  try {
    const chatDoc = await getDoc(doc(db, 'chats', chatId));
    if (chatDoc.exists()) {
      return { success: true, data: { id: chatDoc.id, ...chatDoc.data() } };
    } else {
      return { success: false, error: 'Chat not found' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Search for users by username or email
export const searchUsers = async (searchTerm, currentUserId) => {
  try {
    // Note: This is a simplified search. In production, you might want to use
    // Algolia or similar for better search capabilities
    const usersRef = collection(db, 'users');
    const q = query(usersRef);
    const querySnapshot = await getDocs(q);
    
    const users = [];
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      if (userData.uid !== currentUserId && 
          (userData.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
           userData.email.toLowerCase().includes(searchTerm.toLowerCase()))) {
        users.push({ id: doc.id, ...userData });
      }
    });
    
    return { success: true, users };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Mark messages as read
export const markMessagesAsRead = async (chatId, userId) => {
  try {
    // This would typically update a 'readBy' field in messages
    // For now, we'll just return success
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Mark chat as read for a user
export const markChatAsRead = async (chatId, userId) => {
  try {
    const chatDoc = await getDoc(doc(db, 'chats', chatId));
    if (chatDoc.exists()) {
      const chatData = chatDoc.data();
      const unreadFor = chatData.unreadFor || [];
      const updatedUnreadFor = unreadFor.filter(id => id !== userId);
      
      await updateDoc(doc(db, 'chats', chatId), {
        unreadFor: updatedUnreadFor
      });
    }
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Delete a message
export const deleteMessage = async (chatId, messageId, messageData) => {
  try {
    // Delete the message document
    await deleteDoc(doc(db, 'chats', chatId, 'messages', messageId));
    
    // If the message had an image, delete it from storage
    if (messageData.imageUrl) {
      try {
        // Extract the file path from the URL
        const urlParts = messageData.imageUrl.split('/');
        const fileName = urlParts[urlParts.length - 1].split('?')[0];
        const filePath = `chat-images/${chatId}/${fileName}`;
        
        await deleteObject(ref(storage, filePath));
      } catch (storageError) {
        console.error('Failed to delete image from storage:', storageError);
        // Continue even if storage deletion fails
      }
    }
    
    // Update chat's last message if this was the last message
    const messagesQuery = query(
      collection(db, 'chats', chatId, 'messages'),
      orderBy('createdAt', 'desc'),
      limit(1)
    );
    
    const messagesSnapshot = await getDocs(messagesQuery);
    if (messagesSnapshot.empty) {
      // No more messages, clear last message
      await updateDoc(doc(db, 'chats', chatId), {
        lastMessage: '',
        updatedAt: serverTimestamp()
      });
    } else {
      // Update with the new last message
      const lastMessage = messagesSnapshot.docs[0].data();
      await updateDoc(doc(db, 'chats', chatId), {
        lastMessage: lastMessage.text || 'Image',
        updatedAt: lastMessage.createdAt
      });
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
