// Utility functions for user management

/**
 * Extract username from email address
 * @param {string} email - The email address
 * @returns {string} - The username part before @
 */
export const extractUsernameFromEmail = (email) => {
  if (!email || typeof email !== 'string') return 'Unknown User';
  
  // Extract username part before @
  const atIndex = email.indexOf('@');
  if (atIndex === -1) return email;
  
  const username = email.substring(0, atIndex);
  
  // Capitalize first letter and return
  return username.charAt(0).toUpperCase() + username.slice(1);
};

/**
 * Get display name for a user
 * @param {Object} user - User object with username, email, or uid
 * @returns {string} - Display name for the user
 */
export const getUserDisplayName = (user) => {
  if (!user) return 'Unknown User';
  
  // If user has a username, use it
  if (user.username && user.username.trim()) {
    return user.username;
  }
  
  // If user has an email, extract username from it
  if (user.email && user.email.trim()) {
    return extractUsernameFromEmail(user.email);
  }
  
  // If user has a displayName, use it
  if (user.displayName && user.displayName.trim()) {
    return user.displayName;
  }
  
  // Fallback to a shortened version of the UID
  if (user.uid && user.uid.length > 8) {
    return user.uid.substring(0, 8) + '...';
  }
  
  return 'Unknown User';
};

/**
 * Format user ID for display (fallback when no other info is available)
 * @param {string} uid - User ID
 * @returns {string} - Formatted display name
 */
export const formatUserId = (uid) => {
  if (!uid || typeof uid !== 'string') return 'Unknown User';
  
  // If it looks like an email, extract username
  if (uid.includes('@')) {
    return extractUsernameFromEmail(uid);
  }
  
  // If it's a long hex string, shorten it
  if (uid.length > 20) {
    return uid.substring(0, 8) + '...';
  }
  
  return uid;
};
