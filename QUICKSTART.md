# 🚀 Quick Start Guide

Get your Chat V2 application running in 5 minutes!

## ⚡ Super Quick Start

1. **Run the setup script:**
   ```bash
   ./setup.sh
   ```

2. **Configure Firebase:**
   - Copy the example config: `cp firebase-config.example.js src/firebase/config.js`
   - Update `src/firebase/config.js` with your Firebase project details

3. **Start the app:**
   ```bash
   npm start
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## 🔥 Firebase Setup (2 minutes)

1. **Go to [Firebase Console](https://console.firebase.google.com/)**
2. **Create a new project** (or use existing)
3. **Enable Authentication:**
   - Click "Authentication" → "Get started"
   - Enable "Email/Password" and "Google" sign-in methods
4. **Create Firestore Database:**
   - Click "Firestore Database" → "Create database"
   - Start in "test mode" (we'll secure it later)
5. **Enable Storage:**
   - Click "Storage" → "Get started"
   - Start in "test mode"
6. **Get your config:**
   - Click the gear icon ⚙️ → "Project settings"
   - Scroll to "Your apps" → Click the web app icon `</>`
   - Copy the config object

## 📝 Manual Setup

If you prefer to set up manually:

```bash
# Install dependencies
npm install

# Copy Firebase config
cp firebase-config.example.js src/firebase/config.js

# Edit the config file with your Firebase details
nano src/firebase/config.js

# Start the app
npm start
```

## 🎯 What You'll Get

- ✅ **Authentication**: Sign up/sign in with email or Google
- ✅ **User Profiles**: Username and profile photo management
- ✅ **Direct Messaging**: Private one-on-one conversations
- ✅ **Real-time Updates**: Messages appear instantly
- ✅ **Image Sharing**: Upload and share images in chats
- ✅ **Emoji Support**: Built-in emoji picker
- ✅ **Modern UI**: Beautiful, responsive design

## 🐛 Common Issues

**"Firebase config not found"**
- Make sure you copied `firebase-config.example.js` to `src/firebase/config.js`
- Update the config with your actual Firebase project details

**"Authentication failed"**
- Check that Authentication is enabled in Firebase Console
- Verify your Firebase config values are correct

**"Database permission denied"**
- Ensure Firestore is created and running in test mode
- Check that your Firebase config is correct

## 🚀 Next Steps

1. **Customize the UI**: Modify colors, fonts, and layout in `tailwind.config.js`
2. **Add Features**: Implement typing indicators, read receipts, or group chats
3. **Deploy**: Use `npm run build` and deploy to Firebase Hosting, Vercel, or Netlify
4. **Secure**: Update Firestore and Storage security rules for production

## 📚 Learn More

- **Firebase Docs**: [firebase.google.com/docs](https://firebase.google.com/docs)
- **React Docs**: [reactjs.org/docs](https://reactjs.org/docs)
- **Tailwind CSS**: [tailwindcss.com/docs](https://tailwindcss.com/docs)

---

**Need help?** Check the main [README.md](README.md) for detailed documentation!
