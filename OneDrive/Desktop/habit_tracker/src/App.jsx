// ============================================================
// FILE: src/App.jsx
// PURPOSE: The root component. Decides which screen to show:
//   - Loading spinner while Firebase checks auth
//   - LoginPage if nobody is logged in
//   - Dashboard if the user is logged in
// ============================================================

import { useAuth } from "./hooks/useAuth";
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/Dashboard";
import "./App.css";

export default function App() {
  const { user, loading } = useAuth();

  // While Firebase is figuring out if someone is logged in, show a spinner
  if (loading) {
    return (
      <div className="loading-screen">
        <span className="loading-spinner">🌱</span>
        <p>Loading...</p>
      </div>
    );
  }

  // If no user → show login, otherwise → show the main app
  return user ? <Dashboard user={user} /> : <LoginPage />;
}
