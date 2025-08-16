import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Share2, Trash2, Copy, Check } from 'lucide-react';
import { deleteMessage } from '../../firebase/chat';

const MessageDropdown = ({ message, chatId, currentUserId, onMessageDeleted }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [menuPosition, setMenuPosition] = useState('below');
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Calculate menu position when opening
  const calculateMenuPosition = () => {
    if (!buttonRef.current) return 'below';
    
    const buttonRect = buttonRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const menuHeight = 120; // Approximate height of the dropdown menu
    
    // Check if there's enough space below
    const spaceBelow = viewportHeight - buttonRect.bottom;
    const spaceAbove = buttonRect.top;
    
    if (spaceBelow < menuHeight && spaceAbove > menuHeight) {
      return 'above';
    }
    return 'below';
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDelete = async () => {
    if (!message.text && !message.imageUrl) return;
    
    setIsDeleting(true);
    try {
      const result = await deleteMessage(chatId, message.id, message);
      if (result.success) {
        onMessageDeleted(message.id);
        setIsOpen(false);
      } else {
        console.error('Failed to delete message:', result.error);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShare = async () => {
    try {
      if (message.text) {
        await navigator.clipboard.writeText(message.text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else if (message.imageUrl) {
        await navigator.clipboard.writeText(message.imageUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const canDelete = message.senderId === currentUserId;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        onClick={() => {
          if (!isOpen) {
            setMenuPosition(calculateMenuPosition());
          }
          setIsOpen(!isOpen);
        }}
        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        title="Message options"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className={`absolute right-0 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10 ${
          menuPosition === 'above' 
            ? 'bottom-full mb-1' 
            : 'top-full mt-1'
        }`}>
          <div className="py-1">
            {/* Share Button */}
            <button
              onClick={handleShare}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </>
              )}
            </button>

            {/* Copy Button */}
            <button
              onClick={handleShare}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 transition-colors"
            >
              <Copy className="h-4 w-4" />
              <span>Copy</span>
            </button>

            {/* Delete Button - Only show for own messages */}
            {canDelete && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2 transition-colors disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageDropdown;
