// ============================================================
// FILE: src/lib/db.js
// PURPOSE: All the functions that talk to Firestore (the database).
//
// Think of Firestore like a big JSON tree:
//
//   users/
//     {userId}/
//       habits/
//         {habitId}/         ← one habit document
//           name: "Read 10 pages"
//           emoji: "📚"
//           createdAt: ...
//           checkIns/
//             {date}/        ← one check-in per day (key = "2024-01-15")
//               done: true
//
// We keep all functions here so the components stay clean.
// ============================================================

import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

// ─── HABITS ────────────────────────────────────────────────

// Add a new habit for the logged-in user
export async function addHabit(userId, name, emoji) {
  // collection path: users → userId → habits
  const habitsRef = collection(db, "users", userId, "habits");
  await addDoc(habitsRef, {
    name,
    emoji,
    createdAt: serverTimestamp(), // Firebase fills in the current time
  });
}

// Get all habits for a user, sorted by creation time
export async function getHabits(userId) {
  const habitsRef = collection(db, "users", userId, "habits");
  const q = query(habitsRef, orderBy("createdAt", "asc"));
  const snapshot = await getDocs(q);

  // Turn each Firestore document into a plain JS object
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

// Delete a habit and all its check-ins
export async function deleteHabit(userId, habitId) {
  const habitRef = doc(db, "users", userId, "habits", habitId);
  await deleteDoc(habitRef);
}

// ─── CHECK-INS ─────────────────────────────────────────────

// Mark today's habit as done (or undo it)
// date should be a string like "2024-01-15"
export async function toggleCheckIn(userId, habitId, date, isDone) {
  // We use the date as the document ID — easy to look up!
  const checkInRef = doc(
    db,
    "users", userId,
    "habits", habitId,
    "checkIns", date
  );
  await setDoc(checkInRef, { done: isDone });
}

// Get all check-ins for one habit (used for the streak heatmap)
export async function getCheckIns(userId, habitId) {
  const checkInsRef = collection(
    db,
    "users", userId,
    "habits", habitId,
    "checkIns"
  );
  const snapshot = await getDocs(checkInsRef);

  // Return an object like: { "2024-01-15": true, "2024-01-16": true }
  const result = {};
  snapshot.docs.forEach((doc) => {
    result[doc.id] = doc.data().done;
  });
  return result;
}

// ─── STREAK LOGIC ──────────────────────────────────────────

// Calculate the current streak from a checkIns object
// A streak breaks if you missed yesterday
export function calculateStreak(checkIns) {
  let streak = 0;
  const today = new Date();

  for (let i = 0; i < 365; i++) {
    // Go backwards from today: today, yesterday, the day before...
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const key = date.toISOString().split("T")[0]; // "2024-01-15"

    if (checkIns[key]) {
      streak++;
    } else {
      break; // streak is broken — stop counting
    }
  }

  return streak;
}

// Calculate the longest streak ever
export function calculateLongestStreak(checkIns) {
  const dates = Object.keys(checkIns)
    .filter((d) => checkIns[d])
    .sort(); // sort dates oldest → newest

  let longest = 0;
  let current = 0;

  for (let i = 0; i < dates.length; i++) {
    if (i === 0) {
      current = 1;
    } else {
      // Check if this date is exactly 1 day after the previous one
      const prev = new Date(dates[i - 1]);
      const curr = new Date(dates[i]);
      const diff = (curr - prev) / (1000 * 60 * 60 * 24); // difference in days

      if (diff === 1) {
        current++; // consecutive — keep counting
      } else {
        current = 1; // gap found — reset
      }
    }
    longest = Math.max(longest, current);
  }

  return longest;
}

// Today's date as a string "YYYY-MM-DD"
export function todayKey() {
  return new Date().toISOString().split("T")[0];
}
