#!/bin/bash

echo "🚀 Chat V2 Setup Script"
echo "========================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16+ is required. Current version: $(node -v)"
    echo "   Please upgrade Node.js from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm $(npm -v) detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"
echo ""

# Check if Firebase config exists
if [ ! -f "src/firebase/config.js" ]; then
    echo "⚠️  Firebase configuration not found!"
    echo "   Please copy firebase-config.example.js to src/firebase/config.js"
    echo "   and update it with your Firebase project details."
    echo ""
    echo "   To get your Firebase config:"
    echo "   1. Go to https://console.firebase.google.com/"
    echo "   2. Create a new project or select existing one"
    echo "   3. Add a web app to your project"
    echo "   4. Copy the configuration object"
    echo "   5. Update src/firebase/config.js"
    echo ""
    echo "   Or run: cp firebase-config.example.js src/firebase/config.js"
    echo ""
else
    echo "✅ Firebase configuration found"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Configure Firebase (if not done already)"
echo "2. Run 'npm start' to start the development server"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "For more information, see README.md"
echo ""
echo "Happy coding! 🚀"
