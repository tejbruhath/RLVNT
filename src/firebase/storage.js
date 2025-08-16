import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './config';

// Test storage connection
export const testStorageConnection = async () => {
  try {
    console.log('Testing storage connection...');
    console.log('Storage instance:', storage);
    console.log('Storage app:', storage.app);
    console.log('Storage bucket:', storage.bucket);
    return { success: true, message: 'Storage connection successful' };
  } catch (error) {
    console.error('Storage connection test failed:', error);
    return { success: false, error: error.message };
  }
};

// Upload profile photo
export const uploadProfilePhoto = async (file, userId) => {
  try {
    console.log('Storage upload started for user:', userId);
    console.log('File type:', file.type, 'File size:', file.size);
    
    const fileExtension = file.name.split('.').pop();
    const fileName = `profile-photos/${userId}/${Date.now()}.${fileExtension}`;
    console.log('File path:', fileName);
    
    const storageRef = ref(storage, fileName);
    console.log('Storage reference created');
    
    const snapshot = await uploadBytes(storageRef, file);
    console.log('Upload completed, getting download URL...');
    
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('Download URL obtained:', downloadURL);
    
    return { success: true, url: downloadURL, fileName };
  } catch (error) {
    console.error('Storage upload error:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    return { success: false, error: error.message };
  }
};

// Upload chat image
export const uploadChatImage = async (file, chatId) => {
  try {
    const fileExtension = file.name.split('.').pop();
    const fileName = `chat-images/${chatId}/${Date.now()}.${fileExtension}`;
    const storageRef = ref(storage, fileName);
    
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return { success: true, url: downloadURL, fileName };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Delete file from storage
export const deleteFile = async (fileName) => {
  try {
    const fileRef = ref(storage, fileName);
    await deleteObject(fileRef);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get file download URL
export const getFileURL = async (fileName) => {
  try {
    const fileRef = ref(storage, fileName);
    const url = await getDownloadURL(fileRef);
    return { success: true, url };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
