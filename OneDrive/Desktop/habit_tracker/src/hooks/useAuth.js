// ============================================================
// FILE: src/hooks/useAuth.js
// PURPOSE: A custom React hook that tracks who is logged in.
//
// A "hook" is just a reusable piece of logic you can plug into
// any component. This one watches Firebase and tells you:
//   - user     → the logged-in user object (or null if nobody)
//   - loading  → true while Firebase is still checking
// ============================================================

import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";

export function useAuth() {
  const [user, setUser] = useState(null);      // who is logged in
  const [loading, setLoading] = useState(true); // are we still checking?

  useEffect(() => {
    // onAuthStateChanged fires every time the login state changes.
    // Firebase calls this automatically when the page loads, so we
    // always know whether someone is logged in.
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser); // null if logged out, user object if logged in
      setLoading(false);     // done checking
    });

    // Cleanup: stop listening when the component unmounts
    return () => unsubscribe();
  }, []);

  return { user, loading };
}
