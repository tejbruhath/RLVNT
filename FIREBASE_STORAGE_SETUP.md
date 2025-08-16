# Firebase Storage Setup Guide

## Issue: Photo Upload Failing

If you're getting "Failed to update profile photo" errors, it's likely due to Firebase Storage security rules.

## Step 1: Check Firebase Storage Security Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `my-chat-app-b5ddb`
3. Click on "Storage" in the left sidebar
4. Click on "Rules" tab

## Step 2: Update Security Rules

Replace the current rules with these:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow authenticated users to upload profile photos
    match /profile-photos/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to upload chat images
    match /chat-images/{chatId}/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
    
    // Default rule - deny all
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

## Step 3: Test the Upload

1. Open your app in the browser
2. Open Developer Tools (F12)
3. Go to Console tab
4. Click on your profile photo to open the edit modal
5. Try uploading a photo
6. Check the console logs for detailed error information

## Step 4: Common Issues

### Issue 1: "Permission denied"
- **Solution**: Update security rules as shown above

### Issue 2: "Bucket not found"
- **Solution**: Make sure Storage is enabled in Firebase Console

### Issue 3: "File too large"
- **Solution**: The app limits files to 5MB

### Issue 4: "Invalid file type"
- **Solution**: Only image files are accepted

## Step 5: Enable Storage (if not already done)

1. In Firebase Console, go to Storage
2. Click "Get started"
3. Choose a location (pick the closest to your users)
4. Start in test mode (for development)

## Debug Information

The app now includes detailed logging. Check the browser console for:
- Storage connection test results
- File upload progress
- Detailed error messages

## Alternative: Test Mode Rules

For quick testing, you can use these permissive rules (NOT for production):

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

⚠️ **Warning**: Only use test mode rules for development. Never use them in production!
