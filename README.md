# EasyExpenses AI ✈️💸

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19.0-blue)
![Firebase](https://img.shields.io/badge/Firebase-12.0-orange)
![Gemini AI](https://img.shields.io/badge/AI-Gemini_1.5-purple)

**EasyExpenses AI** is a smart, mobile-first travel expense tracker designed to make managing travel budgets effortless. Powered by Google's Gemini AI, it allows users to scan receipts, automatically categorize expenses, and generate professional reports—all with full offline support.

![Banner](/public/icon-512.png) 
*(You can replace this with a screenshot of the dashboard later)*

## ✨ Key Features

- **🤖 AI Receipt Scanning**: Snap a photo or upload a receipt, and Gemini AI automatically extracts the merchant, date, amount, and category.
- **📶 Offline First (PWA)**: Full functionality without internet. Queues actions and syncs automatically when connection is restored. Installable on iOS and Android.
- **📊 Analytics & Budgets**: Real-time visualization of spending vs. budget with visual alerts.
- **📄 Professional Exports**:
  - **PDF Reports**: Detailed charts, tables, and summaries.
  - **Excel + Images**: Full data export with a ZIP of all receipt images.
- **🌍 Multi-Trip & Multi-Currency**: Manage multiple trips and expenses in any currency.
- **🌙 Dark Mode**: Beautiful UI that adapts to system preferences (or manual toggle).
- **🌐 Internationalization**: Fully translated into English 🇺🇸 and Spanish 🇪🇸.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS (v4)
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **AI**: Google Gemini API
- **Offline**: IndexedDB (`idb`), Vite PWA Plugin, Workbox
- **Utils**: `jspdf` (Reports), `date-fns` (Time), `lucide-react` (Icons)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- A Firebase Project (Free tier is sufficient)
- A Google Cloud API Key (for Gemini)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/easy-expenses-ai.git
   cd easy-expenses-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory (or copy `.env.example`) and fill in your keys:

   ```bash
   cp .env.example .env
   ```

   **Required Variables:**
   ```env
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   VITE_GEMINI_API_KEY=...
   ```

4. **Run Locally**
   ```bash
   npm run dev
   ```

## 🔥 Firebase Configuration

To get the app running, you need to set up a Firebase project:

1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Create a new project.
3. **Authentication**: Enable "Google" provider.
4. **Firestore Database**: Create a database (Start in production mode recommended, update rules as below).
5. **Storage**: Enable storage for receipt images.

### Security Rules (Firestore)

Add these rules to your Firestore configuration to ensure user privacy:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can only access trips they created
    match /trips/{tripId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
    
    // Expenses follow the same logic
    match /expenses/{expenseId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
  }
}
```

## 📱 Installing as App (PWA)

**iOS**: Open in Safari -> Share -> "Add to Home Screen".
**Android**: Open in Chrome -> Menu -> "Install App".
**Desktop**: Look for the install icon in the browser address bar.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
