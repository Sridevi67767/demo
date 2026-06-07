// ============================================================
// FILE: src/components/HabitCard.jsx
// PURPOSE: Shows one habit with:
//   - Today's check-in button
//   - Current streak + longest streak
//   - 90-day heatmap calendar
//   - Delete button
// ============================================================

import { useState, useEffect, useCallback } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import {
  getCheckIns,
  toggleCheckIn,
  deleteHabit,
  calculateStreak,
  calculateLongestStreak,
  todayKey,
} from "../lib/db";

export default function HabitCard({ habit, userId, onDeleted }) {
  const [checkIns, setCheckIns] = useState({});   // { "2024-01-15": true, ... }
  const [loading, setLoading] = useState(true);   // fetching check-ins?
  const [checking, setChecking] = useState(false); // tapping check-in?

  const today = todayKey();
  const isDoneToday = checkIns[today] === true;
  const streak = calculateStreak(checkIns);
  const longestStreak = calculateLongestStreak(checkIns);

  // Load check-ins from Firestore when the card first appears
  const loadCheckIns = useCallback(async () => {
    setLoading(true);
    const data = await getCheckIns(userId, habit.id);
    setCheckIns(data);
    setLoading(false);
  }, [userId, habit.id]);

  useEffect(() => {
    loadCheckIns();
  }, [loadCheckIns]);

  // Toggle today's check-in on/off
  async function handleCheckIn() {
    if (checking) return; // prevent rapid tapping
    setChecking(true);

    const newValue = !isDoneToday;

    // Optimistically update UI first (feels instant to the user)
    setCheckIns((prev) => ({ ...prev, [today]: newValue }));

    try {
      await toggleCheckIn(userId, habit.id, today, newValue);
    } catch (error) {
      // If it fails, revert the UI change
      setCheckIns((prev) => ({ ...prev, [today]: !newValue }));
      alert("Could not save check-in. Check your internet.");
    }

    setChecking(false);
  }

  // Delete this habit after confirmation
  async function handleDelete() {
    if (!window.confirm(`Delete "${habit.name}"? This cannot be undone.`)) return;
    try {
      await deleteHabit(userId, habit.id);
      onDeleted(); // tell parent to refresh the list
    } catch (error) {
      alert("Could not delete. Try again.");
    }
  }

  // ── Prepare heatmap data ───────────────────────────────────
  // react-calendar-heatmap needs an array like:
  // [{ date: "2024-01-15", count: 1 }, { date: "2024-01-16", count: 0 }]
  const heatmapValues = Object.entries(checkIns)
    .filter(([, done]) => done)
    .map(([date]) => ({ date, count: 1 }));

  // Show 90 days on the heatmap
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 90);

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className={`habit-card ${isDoneToday ? "done" : ""}`}>
      {/* Card header: emoji + name + delete button */}
      <div className="card-header">
        <div className="habit-title">
          <span className="habit-emoji">{habit.emoji}</span>
          <span className="habit-name">{habit.name}</span>
        </div>
        <button
          className="delete-btn"
          onClick={handleDelete}
          title="Delete habit"
        >
          ✕
        </button>
      </div>

      {/* Streak stats */}
      <div className="streak-row">
        <div className="stat">
          <span className="stat-value">{streak}</span>
          <span className="stat-label">🔥 current streak</span>
        </div>
        <div className="stat">
          <span className="stat-value">{longestStreak}</span>
          <span className="stat-label">🏆 longest streak</span>
        </div>
      </div>

      {/* Heatmap — 90 days of check-in history */}
      {loading ? (
        <p className="loading-text">Loading history...</p>
      ) : (
        <div className="heatmap-wrap">
          <CalendarHeatmap
            startDate={startDate}
            endDate={new Date()}
            values={heatmapValues}
            classForValue={(value) => {
              if (!value || !value.count) return "color-empty";
              return "color-filled";
            }}
            showWeekdayLabels={true}
          />
        </div>
      )}

      {/* Today's check-in button */}
      <button
        className={`checkin-btn ${isDoneToday ? "checked" : ""}`}
        onClick={handleCheckIn}
        disabled={checking}
      >
        {isDoneToday ? "✓ Done today!" : "Mark today as done"}
      </button>
    </div>
  );
}
