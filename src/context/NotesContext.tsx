import { createContext, useContext, useReducer, useEffect, useRef, useCallback, ReactNode } from 'react'
import { collection, addDoc, updateDoc, deleteDoc, getDocs, doc, query, where } from 'firebase/firestore'
import { db } from '@firebaseConfig/config'
import { useAuth } from './AuthContext'
import { debounce, DebouncedFunc } from 'lodash'
import { normalizeDate } from '@utils/index'
import type { Note, NotesContextType, NotesState, NotesAction } from '../types'

// Create notes context
const NotesContext = createContext<NotesContextType | undefined>(undefined)

// Initial state
const initialState: NotesState = {
  notes: [],
  loading: false,
  error: null,
  searchTerm: '',
  filteredNotes: []
}

// Reducer function to handle all note state changes
function reducer(state: NotesState, action: NotesAction): NotesState {
  switch (action.type) {
    case 'SET_NOTES':
      return {
        ...state,
        notes: action.payload,
        filteredNotes: state.searchTerm
          ? action.payload.filter(note =>
              note.title.toLowerCase().includes(state.searchTerm.toLowerCase()))
          : action.payload
      }
    case 'ADD_NOTE':
      const newNotes = [action.payload, ...state.notes]
      return {
        ...state,
        notes: newNotes,
        filteredNotes: state.searchTerm
          ? newNotes.filter(note =>
              note.title.toLowerCase().includes(state.searchTerm.toLowerCase()))
          : newNotes
      }
    case 'UPDATE_NOTE':
      const updatedNotes = state.notes.map(note =>
        note.id === action.payload.id ? { ...note, ...action.payload } : note
      )
      return {
        ...state,
        notes: updatedNotes,
        filteredNotes: state.searchTerm
          ? updatedNotes.filter(note =>
              note.title.toLowerCase().includes(state.searchTerm.toLowerCase()))
          : updatedNotes
      }
    case 'DELETE_NOTE':
      const notesAfterDelete = state.notes.filter(note => note.id !== action.payload)
      return {
        ...state,
        notes: notesAfterDelete,
        filteredNotes: state.searchTerm
          ? notesAfterDelete.filter(note =>
              note.title.toLowerCase().includes(state.searchTerm.toLowerCase()))
          : notesAfterDelete
      }
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      }
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      }
    case 'SET_SEARCH_TERM':
      return {
        ...state,
        searchTerm: action.payload
      }
    case 'SET_FILTERED_NOTES':
      return {
        ...state,
        filteredNotes: action.payload
      }
    case 'CLEAR_NOTES':
      return {
        ...state,
        notes: [],
        filteredNotes: [],
        searchTerm: ''
      }
    default:
      return state
  }
}

interface NotesProviderProps {
  children: ReactNode
}

// Notes provider component
export function NotesProvider({ children }: NotesProviderProps) {
  const { currentUser } = useAuth()
  const [state, dispatch] = useReducer(reducer, initialState)
  // Store previous auth state to detect login/logout transitions
  const prevAuthState = useRef<{ currentUser: typeof currentUser }>({ currentUser: null })

  // Create a stable reference to the debounce function
  const debouncedSearch = useRef<DebouncedFunc<(searchTerm: string, notes: Note[]) => void>>(
    debounce((searchTerm: string, notes: Note[]) => {
      if (!searchTerm.trim()) {
        dispatch({ type: 'SET_FILTERED_NOTES', payload: notes })
      } else {
        const filtered = notes.filter(note =>
          note.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
        dispatch({ type: 'SET_FILTERED_NOTES', payload: filtered })
      }
    }, 300)
  ).current

  // Handle search term change - memoized with useCallback
  const handleSearch = useCallback((searchTerm: string) => {
    dispatch({ type: 'SET_SEARCH_TERM', payload: searchTerm })
    debouncedSearch(searchTerm, state.notes)
  }, [debouncedSearch, state.notes])

  // Clean up debounced function when component unmounts
  useEffect(() => {
    return () => {
      debouncedSearch.cancel()
    }
  }, [debouncedSearch])

  // Sync local notes to Firebase when user logs in
  useEffect(() => {
    const syncLocalToFirebase = async () => {
      // Check if this is a fresh login (previously no user, now we have one)
      if (!prevAuthState.current.currentUser && currentUser) {
        try {
          dispatch({ type: 'SET_LOADING', payload: true })

          // Get local notes
          const localNotesJson = localStorage.getItem('notes')
          const localNotes = localNotesJson ? JSON.parse(localNotesJson) : []

          if (localNotes.length > 0) {
            console.log('Syncing local notes to Firebase...')

            // Upload each local note to Firebase
            for (const note of localNotes) {
              // Skip upload if note appears to be a Firebase note (has a non-local id)
              if (!note.id || !note.id.startsWith('local-')) {
                continue
              }

              // Create a clean copy of the note without the local ID
              const { id, ...noteData } = note

              // Add the note to Firebase with the user's ID
              await addDoc(collection(db, 'notes'), {
                ...noteData,
                userId: currentUser.uid,
                createdAt: new Date(note.createdAt),
                updatedAt: new Date()
              })
            }

            // Clear local storage after successful upload
            localStorage.removeItem('notes')
          }
        } catch (error) {
          console.error('Error syncing local notes to Firebase:', error)
          dispatch({ type: 'SET_ERROR', payload: 'Failed to sync your notes. Please try again.' })
        } finally {
          dispatch({ type: 'SET_LOADING', payload: false })
        }
      }

      // Update previous auth state
      prevAuthState.current = { currentUser }
    }

    syncLocalToFirebase()
  }, [currentUser])

  // Load notes from localStorage or Firebase based on authentication
  useEffect(() => {
    async function loadNotes() {
      dispatch({ type: 'SET_LOADING', payload: true })

      try {
        let loadedNotes: Note[] = []

        if (currentUser) {
          // User is logged in - fetch notes from Firebase
          const q = query(
            collection(db, 'notes'),
            where('userId', '==', currentUser.uid)
          )

          const querySnapshot = await getDocs(q)
          loadedNotes = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date()
          })) as Note[]
        } else {
          // User is not logged in - fetch from localStorage
          const storedNotes = localStorage.getItem('notes')
          loadedNotes = storedNotes ? JSON.parse(storedNotes) : []
        }

        // Sort notes by creation date (newest first)
        loadedNotes.sort((a, b) => normalizeDate(b.createdAt).getTime() - normalizeDate(a.createdAt).getTime())

        dispatch({ type: 'SET_NOTES', payload: loadedNotes })
      } catch (error) {
        console.error('Error loading notes:', error)
        dispatch({ type: 'SET_ERROR', payload: (error as Error).message })
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    loadNotes()
  }, [currentUser])

  // Save notes to localStorage when they change (only if not authenticated)
  useEffect(() => {
    if (!currentUser && state.notes.length > 0) {
      localStorage.setItem('notes', JSON.stringify(state.notes))
    }
  }, [state.notes, currentUser])

  // Add a new note
  const addNote = async (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newNote = {
        ...note,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      if (currentUser) {
        // Save to Firebase
        dispatch({ type: 'SET_LOADING', payload: true })

        // Create note in Firestore
        const noteWithUserId = {
          ...newNote,
          userId: currentUser.uid
        }
        const docRef = await addDoc(collection(db, 'notes'), noteWithUserId)

        // After successful creation, update the UI with the new note
        // Make sure the ID and dates are correctly formatted
        dispatch({
          type: 'ADD_NOTE',
          payload: {
            id: docRef.id,
            ...noteWithUserId,
            createdAt: newNote.createdAt,
            updatedAt: newNote.updatedAt
          } as Note
        })
      } else {
        // Save to local storage
        const id = `local-${Date.now()}`
        dispatch({ type: 'ADD_NOTE', payload: { id, ...newNote } as Note })
      }
    } catch (error) {
      console.error('Error adding note:', error)
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  // Update a note
  const updateNote = async (id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>) => {
    try {
      const updatedNote = {
        id,
        ...updates,
        updatedAt: new Date()
      }

      if (currentUser) {
        // Update in Firebase
        dispatch({ type: 'SET_LOADING', payload: true })
        const noteRef = doc(db, 'notes', id)
        await updateDoc(noteRef, { ...updates, updatedAt: new Date() })
      }

      dispatch({ type: 'UPDATE_NOTE', payload: updatedNote as Note })
    } catch (error) {
      console.error('Error updating note:', error)
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  // Delete a note
  const deleteNote = async (id: string) => {
    try {
      if (currentUser) {
        // Delete from Firebase
        dispatch({ type: 'SET_LOADING', payload: true })
        const noteRef = doc(db, 'notes', id)
        await deleteDoc(noteRef)
      }

      dispatch({ type: 'DELETE_NOTE', payload: id })
    } catch (error) {
      console.error('Error deleting note:', error)
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  // Clear all notes (used when logging out)
  const clearNotes = () => {
    dispatch({ type: 'CLEAR_NOTES' })
  }

  // Context value
  const value: NotesContextType = {
    notes: state.notes,
    filteredNotes: state.filteredNotes,
    loading: state.loading,
    error: state.error,
    searchTerm: state.searchTerm,
    addNote,
    updateNote,
    deleteNote,
    handleSearch,
    clearNotes
  }

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>
}

// Custom hook for using the notes context
export function useNotes(): NotesContextType {
  const context = useContext(NotesContext)
  if (!context) {
    throw new Error('useNotes must be used within NotesProvider')
  }
  return context
}
