// ============================================================
// FILE: src/components/LoginPage.jsx
// PURPOSE: The screen users see before they log in.
//          Has a "Sign in with Google" button.
// ============================================================

import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";

export default function LoginPage() {

  // When the button is clicked, open the Google sign-in popup
  async function handleGoogleLogin() {
    try {
      await signInWithPopup(auth, googleProvider);
      // Firebase automatically updates the auth state,
      // so useAuth() in App.jsx will detect the login
      // and show the main app — no extra code needed here!
    } catch (error) {
      console.error("Login failed:", error.message);
      alert("Login failed. Please try again.");
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        {/* App logo / icon */}
        <div className="login-icon">🌱</div>

        <h1 className="login-title">HabitGrow</h1>
        <p className="login-subtitle">
          Build habits. Track streaks. Grow every day.
        </p>

        <button className="google-btn" onClick={handleGoogleLogin}>
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google logo"
            width="20"
            height="20"
          />
          Sign in with Google
        </button>

        <p className="login-note">
          Your habits are private and saved to your account.
        </p>
      </div>
    </div>
  );
}
