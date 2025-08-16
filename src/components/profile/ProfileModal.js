import React, { useState, useRef } from 'react';
import { X, Camera, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { updateUserProfile, getUserProfile } from '../../firebase/auth';
import { uploadProfilePhoto, testStorageConnection } from '../../firebase/storage';

const ProfileModal = ({ isOpen, onClose }) => {
  const { user, userProfile, updateUserProfile: updateContextProfile } = useAuth();
  const [username, setUsername] = useState(userProfile?.username || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  const handleSave = async () => {
    if (!username.trim()) {
      setError('Username is required');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await updateUserProfile(userProfile?.uid || user?.uid, {
        username: username.trim()
      });

      if (result.success) {
        setSuccess('Profile updated successfully!');
        // Refresh the user profile data
        const profileResult = await getUserProfile(userProfile?.uid || user?.uid);
        if (profileResult.success) {
          updateContextProfile(profileResult.data);
        }
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setError(result.error || 'Failed to update profile');
      }
    } catch (error) {
      setError('An error occurred while updating profile');
      console.error('Profile update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('Image size must be less than 5MB');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Test storage connection first
      console.log('Testing storage connection...');
      const connectionTest = await testStorageConnection();
      console.log('Connection test result:', connectionTest);
      
      console.log('Starting photo upload for user:', userProfile?.uid || user?.uid);
      console.log('File details:', { name: file.name, size: file.size, type: file.type });
      
      const result = await uploadProfilePhoto(file, userProfile?.uid || user?.uid);
      console.log('Upload result:', result);
      
      if (result.success) {
        console.log('Upload successful, updating profile...');
        const updateResult = await updateUserProfile(userProfile?.uid || user?.uid, {
          profilePhotoUrl: result.url
        });
        console.log('Profile update result:', updateResult);

        if (updateResult.success) {
          setSuccess('Profile photo updated successfully!');
          // Refresh the user profile data
          const profileResult = await getUserProfile(userProfile?.uid || user?.uid);
          if (profileResult.success) {
            updateContextProfile(profileResult.data);
          }
        } else {
          setError(`Failed to update profile: ${updateResult.error || 'Unknown error'}`);
        }
      } else {
        setError(`Upload failed: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      setError(`An error occurred while uploading photo: ${error.message}`);
      console.error('Photo upload error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-black rounded-lg shadow-xl max-w-md w-full overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Profile</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Profile Photo */}
          <div className="text-center">
            <div className="relative inline-block">
              <div className="h-24 w-24 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
                {userProfile?.profilePhotoUrl ? (
                  <img
                    src={userProfile.profilePhotoUrl}
                    alt="Profile"
                    className="h-24 w-24 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-12 w-12 text-gray-600 dark:text-gray-400" />
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 h-8 w-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                title="Change photo"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Click the camera icon to change your photo
            </p>
          </div>

          {/* Username Input */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Enter your username"
              maxLength={30}
            />
          </div>

          {/* Email Display (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={userProfile?.email || ''}
              disabled
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Email cannot be changed
            </p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
              <p className="text-green-700 dark:text-green-400 text-sm">{success}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
