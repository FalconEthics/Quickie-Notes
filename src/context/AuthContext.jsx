import { createContext, useState, useEffect, useContext } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider, githubProvider } from '../firebase/config';

// Create the context
const AuthContext = createContext();

// Auth provider component
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Register with email/password
  const register = async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Update the user profile with the display name
      if (displayName) {
        await updateProfile(userCredential.user, { displayName });
      }
      return userCredential.user;
    } catch (error) {
      console.error("Error registering:", error);
      throw error;
    }
  };

  // Login with email/password
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  };

  // Sign in with Google
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  };

  // Sign in with GitHub
  const loginWithGithub = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      return result.user;
    } catch (error) {
      console.error("Error signing in with GitHub:", error);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (updates) => {
    try {
      if (!auth.currentUser) throw new Error("No authenticated user");
      await updateProfile(auth.currentUser, updates);
      // Update local state to reflect changes
      setCurrentUser({ ...currentUser, ...updates });
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  // Listen for auth state changes when the component mounts
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);

      // Set authentication expiry (7 days)
      if (user) {
        const expiryTime = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days in milliseconds
        localStorage.setItem('authExpiry', expiryTime);
      } else {
        localStorage.removeItem('authExpiry');
      }
    });

    // Check for expired authentication
    const checkAuthExpiry = () => {
      const expiryTime = localStorage.getItem('authExpiry');
      if (expiryTime && Date.now() > parseInt(expiryTime)) {
        logout();
        localStorage.removeItem('authExpiry');
      }
    };

    checkAuthExpiry();

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Context value to be provided
  const value = {
    currentUser,
    register,
    login,
    loginWithGoogle,
    loginWithGithub,
    logout,
    updateUserProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Custom hook for using the auth context
export function useAuth() {
  return useContext(AuthContext);
}
