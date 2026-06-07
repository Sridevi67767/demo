// ============================================================
// FILE: src/components/Dashboard.jsx
// PURPOSE: The main screen after login.
//   - Shows the user's name + logout button
//   - "Add habit" form
//   - List of all their habit cards
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { getHabits } from "../lib/db";
import AddHabitForm from "./AddHabitForm";
import HabitCard from "./HabitCard";

export default function Dashboard({ user }) {
  const [habits, setHabits] = useState([]);      // array of habit objects
  const [fetching, setFetching] = useState(true); // initial load spinner
  const [showForm, setShowForm] = useState(false); // show/hide add form

  // Load all habits from Firestore
  const loadHabits = useCallback(async () => {
    setFetching(true);
    try {
      const data = await getHabits(user.uid);
      setHabits(data);
    } catch (error) {
      console.error("Failed to load habits:", error);
    }
    setFetching(false);
  }, [user.uid]);

  // Load habits when the dashboard first renders
  useEffect(() => {
    loadHabits();
  }, [loadHabits]);

  // Called after adding or deleting a habit — refreshes the list
  function refresh() {
    loadHabits();
    setShowForm(false); // hide form after adding
  }

  // Log out the user
  async function handleLogout() {
    await signOut(auth);
    // useAuth() in App.jsx detects the logout and shows LoginPage automatically
  }

  // Get first name from Google display name (e.g. "Ravi Kumar" → "Ravi")
  const firstName = user.displayName?.split(" ")[0] || "there";

  return (
    <div className="dashboard">
      {/* Top navigation bar */}
      <nav className="navbar">
        <div className="nav-logo">🌱 HabitGrow</div>
        <div className="nav-right">
          <img
            src={user.photoURL}
            alt={user.displayName}
            className="user-avatar"
          />
          <span className="user-name">{user.displayName}</span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <main className="main-content">
        {/* Page heading */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Good day, {firstName}! 👋</h1>
            <p className="page-sub">
              {habits.length === 0
                ? "Add your first habit to get started."
                : `You have ${habits.length} habit${habits.length > 1 ? "s" : ""} to track.`}
            </p>
          </div>

          {/* Toggle the add form */}
          <button
            className="new-habit-btn"
            onClick={() => setShowForm((prev) => !prev)}
          >
            {showForm ? "✕ Cancel" : "+ New Habit"}
          </button>
        </div>

        {/* Add habit form — only visible when showForm is true */}
        {showForm && (
          <AddHabitForm userId={user.uid} onHabitAdded={refresh} />
        )}

        {/* Habits list */}
        {fetching ? (
          <div className="empty-state">
            <p>Loading your habits...</p>
          </div>
        ) : habits.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🌿</span>
            <p>No habits yet. Add one above to get started!</p>
          </div>
        ) : (
          <div className="habits-grid">
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                userId={user.uid}
                onDeleted={loadHabits}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
