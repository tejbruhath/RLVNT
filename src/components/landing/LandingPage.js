import React, { useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const LandingPage = ({ onGetStarted }) => {
  const { isDarkMode } = useTheme();

  // Automatically redirect to auth page
  useEffect(() => {
    const timer = setTimeout(() => {
      onGetStarted();
    }, 100);
    return () => clearTimeout(timer);
  }, [onGetStarted]);

  return (
    <div className={`min-h-screen relative overflow-hidden flex items-center justify-center ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-dusty-50 via-white to-dusty-100'
    }`}>
      <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center">
        <div className="mb-8">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${
            isDarkMode ? 'bg-metallic-600' : 'bg-metallic-500'
          }`}>
            <MessageCircle className="w-10 h-10 text-white" />
          </div>
        </div>
        <div className="mb-12 max-w-4xl">
          <h1 className={`text-6xl md:text-8xl font-bold mb-6 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          } tracking-tight`}>
            RLVNT
          </h1>
        </div>

        <div className="invisible">
          <button
            onClick={onGetStarted}
            className="hidden"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
