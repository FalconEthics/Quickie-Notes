import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types';
import { getFromStorage, saveToStorage, removeFromStorage } from '@/utils/storage';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import {
  signIn,
  signUp,
  signInWithGoogle,
  signInWithGithub,
  logOut,
  createUserProfile,
  getUserProfile,
  updateUserProfile,
  listenToAuthState
} from '@/config/firebaseService';
import { User as FirebaseUser } from 'firebase/auth';
import { Platform } from 'react-native';

// Auth types
type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

type AuthContextType = AuthState & {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithGithub: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserPhoto: (photoURL: string) => Promise<void>;
};

// Storage keys
const USER_STORAGE_KEY = 'quickie_notes_user';
const AUTH_EXPIRY_KEY = 'quickie_notes_auth_expiry';

// Constants
const AUTH_EXPIRY_DAYS = 7; // 7 days login expiry

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to convert Firebase user to our User model
const mapFirebaseUser = (fbUser: FirebaseUser): User => {
  return {
    id: fbUser.uid,
    email: fbUser.email || '',
    displayName: fbUser.displayName || fbUser.email?.split('@')[0] || '',
    photoURL: fbUser.photoURL || undefined,
    createdAt: parseInt(fbUser.metadata.creationTime || Date.now().toString(), 10)
  };
};

// Initialize WebBrowser for OAuth redirects
WebBrowser.maybeCompleteAuthSession();

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if auth is expired
        const expiryString = await getFromStorage(AUTH_EXPIRY_KEY);
        const expiry = expiryString ? parseInt(expiryString, 10) : null;
        const now = Date.now();

        if (expiry && now > expiry) {
          // Auth expired, clear local data
          await removeFromStorage(USER_STORAGE_KEY);
          await removeFromStorage(AUTH_EXPIRY_KEY);
          await logOut(); // Also sign out from Firebase
          setState({ user: null, isAuthenticated: false, isLoading: false });
          return;
        }

        // Set up Firebase auth state listener
        const unsubscribe = listenToAuthState(async (firebaseUser) => {
          if (firebaseUser) {
            // User is signed in to Firebase
            try {
              // Get or create user profile
              let userProfile = await getUserProfile(firebaseUser.uid);

              if (!userProfile) {
                // Create new user profile
                const newUser = mapFirebaseUser(firebaseUser);
                await createUserProfile(firebaseUser.uid, newUser);
                userProfile = newUser;
              }

              // Update auth expiry
              const expiryDate = Date.now() + (AUTH_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
              await saveToStorage(USER_STORAGE_KEY, JSON.stringify(userProfile));
              await saveToStorage(AUTH_EXPIRY_KEY, expiryDate.toString());

              setState({
                user: userProfile,
                isAuthenticated: true,
                isLoading: false,
              });
            } catch (error) {
              console.error('Error setting up user:', error);
              setState({ user: null, isAuthenticated: false, isLoading: false });
            }
          } else {
            // User is not signed in to Firebase
            // Check if we have a stored user from previous session
            const userString = await getFromStorage(USER_STORAGE_KEY);
            if (userString) {
              const user = JSON.parse(userString);
              setState({
                user,
                isAuthenticated: true,
                isLoading: false,
              });
            } else {
              setState({
                user: null,
                isAuthenticated: false,
                isLoading: false,
              });
            }
          }
        });

        // Cleanup auth listener
        return () => unsubscribe();
      } catch (error) {
        console.error('Auth check error:', error);
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signIn(email, password);
      // Auth state listener will handle the state update
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const userCredential = await signUp(email, password);
      // Auth state listener will handle the state update
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      if (Platform.OS !== 'web') {
        // For native platforms, we should implement OAuth with Expo AuthSession
        alert('Google Sign-In is currently only supported on web');
        return;
      }

      await signInWithGoogle();
      // Auth state listener will handle the state update
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  };

  const loginWithGithub = async () => {
    try {
      if (Platform.OS !== 'web') {
        // For native platforms, we should implement OAuth with Expo AuthSession
        alert('GitHub Sign-In is currently only supported on web');
        return;
      }

      await signInWithGithub();
      // Auth state listener will handle the state update
    } catch (error) {
      console.error('GitHub login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logOut();
      await removeFromStorage(USER_STORAGE_KEY);
      await removeFromStorage(AUTH_EXPIRY_KEY);

      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });

      // Redirect to home page after logout
      router.replace('/');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const updateUserPhoto = async (photoURL: string) => {
    if (!state.user) return;

    try {
      // Update in Firebase
      await updateUserProfile(state.user.id, { photoURL });

      // Update local state
      const updatedUser: User = {
        ...state.user,
        photoURL,
      };

      // Update in local storage
      await saveToStorage(USER_STORAGE_KEY, JSON.stringify(updatedUser));

      setState({
        ...state,
        user: updatedUser,
      });
    } catch (error) {
      console.error('Update photo error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        loginWithGoogle,
        loginWithGithub,
        logout,
        updateUserPhoto,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
