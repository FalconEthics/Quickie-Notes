import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types';
import { getFromStorage, saveToStorage, removeFromStorage } from '@/utils/storage';
import { router } from 'expo-router';

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
          setState({ user: null, isAuthenticated: false, isLoading: false });
          return;
        }

        // Check for stored user
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

  const setAuthWithExpiry = async (user: User) => {
    // Set expiry date (7 days from now)
    const expiryDate = Date.now() + (AUTH_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

    await saveToStorage(USER_STORAGE_KEY, JSON.stringify(user));
    await saveToStorage(AUTH_EXPIRY_KEY, expiryDate.toString());

    setState({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  // Mock auth functions - to be replaced with Firebase later
  const login = async (email: string, password: string) => {
    // For now, we'll just mock a successful login
    const mockUser: User = {
      id: 'mock-user-id',
      email,
      displayName: email.split('@')[0],
      createdAt: Date.now(),
    };

    await setAuthWithExpiry(mockUser);
  };

  const register = async (email: string, password: string) => {
    // Mock user registration
    const newUser: User = {
      id: 'mock-user-id',
      email,
      displayName: email.split('@')[0],
      createdAt: Date.now(),
    };

    await setAuthWithExpiry(newUser);
  };

  const loginWithGoogle = async () => {
    // Mock Google login
    const mockUser: User = {
      id: 'google-user-id',
      email: 'google-user@example.com',
      displayName: 'Google User',
      photoURL: 'https://via.placeholder.com/150',
      createdAt: Date.now(),
    };

    await setAuthWithExpiry(mockUser);
  };

  const loginWithGithub = async () => {
    // Mock GitHub login
    const mockUser: User = {
      id: 'github-user-id',
      email: 'github-user@example.com',
      displayName: 'GitHub User',
      photoURL: 'https://via.placeholder.com/150',
      createdAt: Date.now(),
    };

    await setAuthWithExpiry(mockUser);
  };

  const logout = async () => {
    await removeFromStorage(USER_STORAGE_KEY);
    await removeFromStorage(AUTH_EXPIRY_KEY);

    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });

    // Redirect to home page after logout
    router.replace('/');
  };

  const updateUserPhoto = async (photoURL: string) => {
    if (!state.user) return;

    const updatedUser: User = {
      ...state.user,
      photoURL,
    };

    await saveToStorage(USER_STORAGE_KEY, JSON.stringify(updatedUser));

    setState({
      ...state,
      user: updatedUser,
    });
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
