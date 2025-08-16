import React from 'react';
import { Github, Linkedin, MessageCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const LandingPage = ({ onGetStarted }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`min-h-screen relative overflow-hidden ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-dusty-50 via-white to-dusty-100'
    }`}>
      
      {/* Background Smudges */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Light Mode Smudges */}
        {!isDarkMode && (
          <>
            <div className="absolute top-0 left-0 w-96 h-96 bg-dusty-300/30 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-metallic-300/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-dusty-400/25 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-metallic-400/30 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
          </>
        )}
        
        {/* Dark Mode Smudges */}
        {isDarkMode && (
          <>
            <div className="absolute top-0 left-0 w-96 h-96 bg-metallic-300/15 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-dusty-200/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-metallic-400/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-dusty-300/25 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
          </>
        )}
      </div>

      {/* Subtle Image Underlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
        <img 
          src="https://i.etsystatic.com/19543171/r/il/012830/6025781835/il_fullxfull.6025781835_mqqx.jpg" 
          alt="Echo Background" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        
        {/* Logo/Brand */}
        <div className="mb-8">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${
            isDarkMode ? 'bg-metallic-600' : 'bg-metallic-500'
          }`}>
            <MessageCircle className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Main Headings */}
        <div className="mb-12 max-w-4xl">
          <h1 className={`text-6xl md:text-8xl font-bold mb-6 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          } tracking-tight`}>
            ECHO.
          </h1>
          
          <h2 className={`text-2xl md:text-3xl font-medium mb-8 ${
            isDarkMode ? 'text-gray-200' : 'text-gray-700'
          } leading-relaxed max-w-2xl mx-auto`}>
            back and forth with a privacy you deserve
          </h2>
        </div>

        {/* Get Started Button */}
        <button
          onClick={onGetStarted}
                  className={`px-8 py-4 text-lg font-semibold rounded-full mb-12 transition-all duration-300 transform hover:scale-105 ${
          isDarkMode 
            ? 'bg-metallic-600 hover:bg-metallic-700 text-white shadow-lg shadow-metallic-600/25' 
            : 'bg-metallic-600 hover:bg-metallic-700 text-white shadow-lg shadow-metallic-600/25'
        }`}
        >
          Get Started
        </button>

        {/* Creator Info */}
        <div className="mb-8">
          <h3 className={`text-lg font-medium mb-4 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Built by B Tejbruhath
          </h3>
          <p className={`text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            4th year CSE student
          </p>
        </div>

        {/* Social Links */}
        <div className="flex items-center space-x-6">
          <a
            href="https://github.com/tejbruhath"
            target="_blank"
            rel="noopener noreferrer"
            className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${
              isDarkMode 
                ? 'text-gray-300 hover:text-white hover:bg-metallic-900/20' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-metallic-100'
            }`}
            title="GitHub Profile"
          >
            <Github className="w-6 h-6" />
          </a>
          
          <a
            href="https://in.linkedin.com/in/tej-bruhath-b-405172246"
            target="_blank"
            rel="noopener noreferrer"
            className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${
              isDarkMode 
                ? 'text-gray-300 hover:text-white hover:bg-metallic-900/20' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-metallic-100'
            }`}
            title="LinkedIn Profile"
          >
            <Linkedin className="w-6 h-6" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
