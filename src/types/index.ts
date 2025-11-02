import { User as FirebaseUser } from 'firebase/auth'
import { Timestamp } from 'firebase/firestore'
import { ReactNode } from 'react'

// ============================================================================
// Note Types
// ============================================================================

export interface Note {
  id: string
  title: string
  content: string
  userId?: string
  createdAt: Date | Timestamp
  updatedAt: Date | Timestamp
}

export interface LocalNote extends Omit<Note, 'id'> {
  id: string // Will be in format 'local-{timestamp}'
}

// ============================================================================
// Auth Types
// ============================================================================

export interface AuthContextType {
  currentUser: FirebaseUser | null
  loading: boolean
  register: (email: string, password: string, displayName?: string) => Promise<FirebaseUser>
  login: (email: string, password: string) => Promise<FirebaseUser>
  loginWithGoogle: () => Promise<FirebaseUser>
  loginWithGithub: () => Promise<FirebaseUser>
  logout: () => Promise<void>
  updateUserProfile: (updates: ProfileUpdates) => Promise<void>
}

export interface ProfileUpdates {
  displayName?: string
  photoURL?: string
}

// ============================================================================
// Notes Context Types
// ============================================================================

export interface NotesContextType {
  notes: Note[]
  filteredNotes: Note[]
  loading: boolean
  error: string | null
  searchTerm: string
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateNote: (id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>) => Promise<void>
  deleteNote: (id: string) => Promise<void>
  handleSearch: (searchTerm: string) => void
  clearNotes: () => void
}

// ============================================================================
// Theme Types
// ============================================================================

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}

export interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  isDarkMode: boolean
}

// ============================================================================
// Component Props Types
// ============================================================================

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  title?: string
  titleIcon?: ReactNode
  titleClassName?: string
  preventCloseOnBackdrop?: boolean
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

export interface NoteItemProps {
  note: Note
}

export interface EditNoteModalProps {
  isOpen: boolean
  onClose: () => void
  note: Note
}

export interface DeleteNoteModalProps {
  isOpen: boolean
  onClose: () => void
  noteId: string
  title: string
}

export interface LayoutProps {
  children: ReactNode
}

export interface PageTransitionProps {
  children: ReactNode
}

// ============================================================================
// Utility Types
// ============================================================================

export type DateFormatOptions = Intl.DateTimeFormatOptions

export interface FirebaseConfig {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
}

// ============================================================================
// State Management Types
// ============================================================================

export interface NotesState {
  notes: Note[]
  loading: boolean
  error: string | null
  searchTerm: string
  filteredNotes: Note[]
}

export type NotesAction =
  | { type: 'SET_NOTES'; payload: Note[] }
  | { type: 'ADD_NOTE'; payload: Note }
  | { type: 'UPDATE_NOTE'; payload: Note }
  | { type: 'DELETE_NOTE'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SEARCH_TERM'; payload: string }
  | { type: 'SET_FILTERED_NOTES'; payload: Note[] }
  | { type: 'CLEAR_NOTES' }
