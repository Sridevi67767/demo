// ============================================================
// FILE: src/components/AddHabitForm.jsx
// PURPOSE: A small form to add a new habit.
//          User picks an emoji + types a habit name.
// ============================================================

import { useState } from "react";
import { addHabit } from "../lib/db";

// A list of emoji options the user can pick from
const EMOJI_OPTIONS = ["💧", "📚", "🏃", "🧘", "🥗", "💪", "😴", "✍️", "🎯", "🎸"];

export default function AddHabitForm({ userId, onHabitAdded }) {
  const [name, setName] = useState("");           // habit name text
  const [emoji, setEmoji] = useState("💧");       // selected emoji
  const [loading, setLoading] = useState(false);  // prevent double-submit

  async function handleSubmit(e) {
    e.preventDefault(); // stop page from refreshing on form submit

    if (!name.trim()) return; // don't add empty habits

    setLoading(true);
    try {
      await addHabit(userId, name.trim(), emoji);
      setName("");  // clear the input after adding
      onHabitAdded(); // tell the parent to refresh the habits list
    } catch (error) {
      console.error("Failed to add habit:", error);
      alert("Could not add habit. Try again.");
    }
    setLoading(false);
  }

  return (
    <form className="add-habit-form" onSubmit={handleSubmit}>
      <h2 className="form-title">Add a new habit</h2>

      {/* Emoji picker — just a row of clickable buttons */}
      <div className="emoji-picker">
        {EMOJI_OPTIONS.map((e) => (
          <button
            key={e}
            type="button" // important! prevents form submission
            className={`emoji-btn ${emoji === e ? "selected" : ""}`}
            onClick={() => setEmoji(e)}
          >
            {e}
          </button>
        ))}
      </div>

      {/* Habit name input + submit button */}
      <div className="form-row">
        <input
          type="text"
          className="habit-input"
          placeholder="e.g. Drink 8 glasses of water"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={50}
        />
        <button type="submit" className="add-btn" disabled={loading}>
          {loading ? "Adding..." : "+ Add"}
        </button>
      </div>
    </form>
  );
}
