# 🌱 HabitGrow — Habit Tracker

A full-stack habit tracking app with streak heatmaps, built with React + Firebase.

---

## What This App Does

- Sign in with Google
- Add habits with an emoji (e.g. 💧 Drink water, 📚 Read 10 pages)
- Tap once to mark a habit done for today
- See your current streak and longest streak
- See a 90-day heatmap of your consistency
- All data is saved to your account — works across devices

---

## Folder Structure

```
habit-tracker/
├── public/
│   └── index.html          ← The single HTML page React loads into
├── src/
│   ├── lib/
│   │   ├── firebase.js     ← Firebase connection setup
│   │   └── db.js           ← All database functions (read/write habits)
│   ├── hooks/
│   │   └── useAuth.js      ← Custom hook to track login state
│   ├── components/
│   │   ├── LoginPage.jsx   ← The login screen
│   │   ├── Dashboard.jsx   ← Main screen after login
│   │   ├── AddHabitForm.jsx← Form to add new habits
│   │   └── HabitCard.jsx   ← Individual habit with heatmap + check-in
│   ├── App.jsx             ← Root component — decides which screen to show
│   ├── App.css             ← All styles
│   └── index.js            ← Entry point (you don't need to touch this)
├── firestore.rules         ← Database security rules
└── package.json            ← Project dependencies
```

---

## Step-by-Step Setup Guide

### Step 1 — Install Node.js
If you don't have Node.js installed:
- Go to https://nodejs.org and download the LTS version
- Install it (just click next-next-finish)
- Open a terminal and check it works: `node --version`

---

### Step 2 — Create the React App

Open your terminal and run:

```bash
npx create-react-app habit-tracker
cd habit-tracker
```

This creates the project folder. Now copy all the files from this repo into that folder, replacing what's there.

---

### Step 3 — Install Extra Packages

In the `habit-tracker` folder, run:

```bash
npm install firebase react-calendar-heatmap react-tooltip
```

This downloads Firebase (for auth + database) and the heatmap library.

---

### Step 4 — Create a Firebase Project

1. Go to **https://console.firebase.google.com**
2. Click **"Add project"**
3. Give it a name like `habit-tracker` → click through
4. On the project home page, click the **`</>`** icon (Web app)
5. Register the app with any name (e.g. "habit-tracker-web")
6. You'll see a `firebaseConfig` object — **copy it**

---

### Step 5 — Paste Your Firebase Config

Open **`src/lib/firebase.js`** and replace the placeholder values:

```js
const firebaseConfig = {
  apiKey: "PASTE_YOUR_VALUE_HERE",
  authDomain: "PASTE_YOUR_VALUE_HERE",
  projectId: "PASTE_YOUR_VALUE_HERE",
  storageBucket: "PASTE_YOUR_VALUE_HERE",
  messagingSenderId: "PASTE_YOUR_VALUE_HERE",
  appId: "PASTE_YOUR_VALUE_HERE",
};
```

---

### Step 6 — Enable Google Sign-In

1. In Firebase Console → **Authentication** → **Sign-in method**
2. Click **Google** → toggle it **Enabled**
3. Add your email as a support email → Save

---

### Step 7 — Create the Firestore Database

1. In Firebase Console → **Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in test mode"** for now → Next → Done

Then set the security rules:
1. Click the **Rules** tab
2. Paste the contents of `firestore.rules`
3. Click **Publish**

---

### Step 8 — Run the App

```bash
npm start
```

Your browser will open at **http://localhost:3000** 🎉

---

### Step 9 — Deploy to Vercel (Free Hosting)

1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "first commit"
   ```
   Then create a repo on github.com and push to it.

2. Go to **https://vercel.com** → sign in with GitHub
3. Click **"New Project"** → import your repo
4. Click **Deploy** — done!

Your app will be live at a URL like `https://habit-tracker-xyz.vercel.app`

---

## Common Problems & Fixes

| Problem | Fix |
|---|---|
| "Firebase: Error (auth/unauthorized-domain)" | Go to Firebase → Authentication → Settings → Authorized domains → Add your Vercel URL |
| App runs but login button does nothing | Check that Google sign-in is enabled in Firebase Console |
| Habits not saving | Check that Firestore database is created and rules are published |
| Blank page after `npm start` | Check the terminal for errors, make sure all packages are installed |

---

## What You Learned Building This

- React components, props, useState, useEffect
- Custom React hooks (useAuth)
- Firebase Authentication (Google sign-in)
- Firestore database (read/write/delete documents)
- Streak calculation logic in JavaScript
- Data visualization with a calendar heatmap
- Deploying a React app to Vercel

---

Built with ❤️ — your first full-stack project!
