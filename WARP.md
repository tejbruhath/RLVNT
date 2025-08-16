# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Essential Development
```bash
# Start development server (hot reload at http://localhost:3000)
npm start

# Run production build 
npm run build

# Run Jest/React Testing Library tests
npm test

# Run test coverage report
npm test -- --coverage --watchAll=false
```

### Production Deployment
```bash
# Build and start with PM2 (uses ecosystem.config.js)
npm run build
pm2 start ecosystem.config.js --env production

# Deploy to EC2 server (requires deployment setup)
chmod +x deploy.sh
./deploy.sh

# Check PM2 processes and logs
pm2 list
pm2 logs echo-chat
pm2 restart echo-chat
```

## Architecture Overview

Echo is a real-time chat application built with a three-tier architecture:

### Frontend Layer (React 18)
- **Router**: React Router DOM v6 handles `/`, `/login`, `/signup`, `/chat` routes
- **Responsive Design**: `ResponsiveChatApp` component dynamically switches between `ChatApp` (desktop) and `MobileChatApp` (mobile) using a custom `useMediaQuery` hook with 768px breakpoint
- **Styling**: Tailwind CSS with forced dark mode (see `ThemeContext.js` - light mode disabled)
- **State Management**: Context providers (`AuthProvider`, `ThemeProvider`) wrap the entire app

### Context & State Layer
- **AuthContext**: Manages user authentication state, profile loading, and Firebase auth listeners
- **ThemeContext**: Enforces dark mode only (light mode toggle disabled)
- **Real-time Updates**: Uses Firebase `onSnapshot` listeners for live chat updates without manual refresh

### Firebase Backend Services
- **Authentication**: Email/password + Google OAuth via `src/firebase/auth.js`
- **Firestore**: Chat messages, user profiles, and conversation metadata via `src/firebase/chat.js`
- **Storage**: Profile photos and chat images via `src/firebase/storage.js`
- **Real-time Queries**: Optimized with composite indexes, fallback to unindexed queries if needed

### Production Infrastructure
- **PM2**: Process management with clustering (`ecosystem.config.js`)
- **Nginx**: Reverse proxy serving static assets and handling requests (`nginx.conf`)
- **EC2**: Deployment automation via `deploy.sh` script

## Project Structure

```
src/
├── components/
│   ├── auth/           # Login, SignUp components
│   ├── chat/           # Main chat UI (desktop & mobile variants)
│   ├── landing/        # Landing page with creator info
│   ├── profile/        # User profile management
│   └── ui/             # Reusable components (LoadingSpinner, ThemeToggle)
├── contexts/           # React Context providers
├── firebase/           # Firebase service layer
│   ├── auth.js         # Authentication operations
│   ├── chat.js         # Firestore chat operations  
│   ├── config.js       # Firebase project configuration
│   └── storage.js      # File upload operations
├── hooks/              # Custom React hooks
├── utils/              # Helper functions (user display names, etc.)
└── App.js              # Root component with route protection
```

**Key Architectural Decisions:**
- **Component Isolation**: Auth, chat, and UI concerns separated into dedicated folders
- **Service Layer**: Firebase operations abstracted into service modules with consistent error handling
- **Responsive Components**: Separate mobile/desktop components rather than responsive CSS
- **Real-time First**: All data fetching uses Firebase listeners, not REST calls

## Firebase Configuration

### Required Setup
1. **Firebase Project**: Create project with Authentication, Firestore, and Storage enabled
2. **Configuration**: Update `src/firebase/config.js` with your project credentials:
   ```javascript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com", 
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "your-sender-id",
     appId: "your-app-id"
   };
   ```

### Security Rules (Critical for Production)
Apply these Firestore rules to prevent unauthorized access:
- Users can only read/write their own profile documents
- Chat participants can access chats they're included in
- Message access controlled by chat participation

See `README.md` lines 158-204 for complete security rule examples.

### Environment Variables (Optional)
Create `.env` file for deployment safety:
```env
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
# ... other config values
```

## Development Workflow

### Local Development
```bash
# Start development with hot reloading
npm start

# Test responsive breakpoints manually
# Desktop: > 768px uses ChatApp component  
# Mobile: ≤ 767px uses MobileChatApp component
```

### Testing Strategy
```bash
# Run all tests with Jest/RTL
npm test

# Generate coverage report
npm test -- --coverage --watchAll=false

# Run specific test file
npm test -- ChatApp.test.js
```

### Key Testing Areas
- Authentication flows (login, signup, Google OAuth)
- Real-time message rendering and updates
- Responsive component switching  
- Firebase service error handling
- Image upload and display

### Firebase Development
- **Local Development**: Use live Firebase project (no local emulator setup currently)
- **Data Persistence**: Firestore has offline capabilities enabled by default
- **File Uploads**: Images stored in Firebase Storage with automatic URL generation

## Production Deployment

### PM2 Configuration
The `ecosystem.config.js` uses PM2 to:
- Serve the built React app from `./build` directory
- Run in cluster mode across all CPU cores
- Auto-restart on crashes with 1GB memory limit
- Serve SPA routes correctly with `PM2_SERVE_SPA=true`

### EC2 Deployment Process
1. **Preparation**: Update `deploy.sh` with your repository URL
2. **Deployment**: Script handles system updates, Node.js, PM2, Nginx setup
3. **Configuration**: Nginx reverse proxy configured for port 3000
4. **SSL**: Use Certbot for HTTPS setup (see `EC2_DEPLOYMENT.md`)

### Monitoring & Logs
```bash
# PM2 application logs
pm2 logs echo-chat

# Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# System resource monitoring
pm2 monit
```

## Important Development Notes

### Theme System
- **Dark Mode Only**: `ThemeContext.js` forces dark theme, toggle disabled
- **Tailwind Classes**: Uses `dark:` prefixes throughout components
- **Color Palette**: Custom colors defined in `tailwind.config.js` (dusty, metallic, primary)

### Chat Architecture
- **Message Types**: Text and image messages supported
- **Real-time Sync**: `getChatMessages()` uses Firestore listeners
- **Optimized Queries**: Chat loading attempts indexed query first, falls back to unindexed
- **Unread Tracking**: Messages marked unread for non-sender participants

### Responsive Design
- **Breakpoint**: 768px threshold managed by `useMediaQuery` hook
- **Component Strategy**: Completely separate mobile/desktop components, not CSS media queries
- **Navigation**: Mobile version includes back navigation, desktop has sidebar

### Security Considerations
- **Config Safety**: Never commit real Firebase keys to Git
- **Authentication**: All routes except landing/auth require user login
- **Firestore Rules**: Restrict document access to participants only
- **File Uploads**: Validate file types and sizes before Firebase Storage upload

### Performance Optimizations
- **Code Splitting**: React.lazy() used for route-based splitting
- **Image Optimization**: Images resized before Storage upload
- **Bundle Analysis**: Use `webpack-bundle-analyzer` after build
- **Firestore**: Pagination implemented for large message lists
