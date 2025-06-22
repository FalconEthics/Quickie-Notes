import React, { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import { Note, Attachment } from '@/types';
import { getFromStorage, saveToStorage } from '@/utils/storage';
import { useRouter } from 'expo-router';
import _ from 'lodash';

// Constants
const NOTES_STORAGE_KEY = 'quickie_notes_data';
const MAX_NOTES_PER_USER = 20;
const MAX_ATTACHMENTS_PER_NOTE = 2;
const MAX_ATTACHMENT_SIZE = 150 * 1024; // 150KB

// Action Types
type NotesAction =
  | { type: 'ADD_NOTE'; payload: Note }
  | { type: 'UPDATE_NOTE'; payload: Note }
  | { type: 'DELETE_NOTE'; payload: string }
  | { type: 'SET_NOTES'; payload: Note[] }
  | { type: 'SET_SEARCH_QUERY'; payload: string };

// State Type
interface NotesState {
  notes: Note[];
  filteredNotes: Note[];
  searchQuery: string;
  isLoading: boolean;
}

// Initial State
const initialState: NotesState = {
  notes: [],
  filteredNotes: [],
  searchQuery: '',
  isLoading: true,
};

// Reducer Function
const notesReducer = (state: NotesState, action: NotesAction): NotesState => {
  switch (action.type) {
    case 'ADD_NOTE':
      if (state.notes.length >= MAX_NOTES_PER_USER) {
        // Don't add if max notes limit reached
        return state;
      }
      const newNotes = [action.payload, ...state.notes];
      return {
        ...state,
        notes: newNotes,
        filteredNotes: filterNotesByQuery(newNotes, state.searchQuery),
      };

    case 'UPDATE_NOTE':
      const updatedNotes = state.notes.map(note =>
        note.id === action.payload.id ? action.payload : note
      );
      return {
        ...state,
        notes: updatedNotes,
        filteredNotes: filterNotesByQuery(updatedNotes, state.searchQuery),
      };

    case 'DELETE_NOTE':
      const notesAfterDelete = state.notes.filter(note => note.id !== action.payload);
      return {
        ...state,
        notes: notesAfterDelete,
        filteredNotes: filterNotesByQuery(notesAfterDelete, state.searchQuery),
      };

    case 'SET_NOTES':
      return {
        ...state,
        notes: action.payload,
        filteredNotes: filterNotesByQuery(action.payload, state.searchQuery),
        isLoading: false,
      };

    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.payload,
        filteredNotes: filterNotesByQuery(state.notes, action.payload),
      };

    default:
      return state;
  }
};

// Helper function to filter notes by search query
const filterNotesByQuery = (notes: Note[], query: string): Note[] => {
  if (!query) return notes;
  const lowerCaseQuery = query.toLowerCase();
  return notes.filter(note =>
    note.title.toLowerCase().includes(lowerCaseQuery)
  );
};

// Context Setup
interface NotesContextType {
  state: NotesState;
  addNote: (title: string, content: string, attachments: Attachment[]) => Promise<void>;
  updateNote: (id: string, title: string, content: string, attachments: Attachment[]) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
  checkAttachmentLimits: (currentAttachments: Attachment[], newAttachments: Attachment[]) => {
    withinSizeLimit: boolean;
    withinCountLimit: boolean;
  };
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(notesReducer, initialState);
  const router = useRouter();

  // Load notes from storage on initial render
  useEffect(() => {
    const loadNotes = async () => {
      try {
        const storedNotes = await getFromStorage(NOTES_STORAGE_KEY);
        if (storedNotes) {
          dispatch({ type: 'SET_NOTES', payload: JSON.parse(storedNotes) });
        } else {
          dispatch({ type: 'SET_NOTES', payload: [] });
        }
      } catch (error) {
        console.error('Failed to load notes:', error);
        dispatch({ type: 'SET_NOTES', payload: [] });
      }
    };

    loadNotes();
  }, []);

  // Save notes to storage whenever they change
  useEffect(() => {
    const saveNotes = async () => {
      if (!state.isLoading) {
        await saveToStorage(NOTES_STORAGE_KEY, JSON.stringify(state.notes));
      }
    };

    // Use debounce to avoid excessive storage operations
    const debouncedSave = _.debounce(saveNotes, 500);
    debouncedSave();

    return () => {
      debouncedSave.cancel();
    };
  }, [state.notes, state.isLoading]);

  const addNote = async (title: string, content: string, attachments: Attachment[]) => {
    if (state.notes.length >= MAX_NOTES_PER_USER) {
      alert('You have reached the maximum limit of 20 notes.');
      return;
    }

    const newNote: Note = {
      id: Date.now().toString(),
      title,
      content,
      attachments,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    dispatch({ type: 'ADD_NOTE', payload: newNote });
  };

  const updateNote = async (id: string, title: string, content: string, attachments: Attachment[]) => {
    const noteToUpdate = state.notes.find(note => note.id === id);

    if (!noteToUpdate) return;

    const updatedNote: Note = {
      ...noteToUpdate,
      title,
      content,
      attachments,
      updatedAt: Date.now(),
    };

    dispatch({ type: 'UPDATE_NOTE', payload: updatedNote });
  };

  const deleteNote = async (id: string) => {
    dispatch({ type: 'DELETE_NOTE', payload: id });
  };

  const setSearchQuery = (query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  };

  const checkAttachmentLimits = (currentAttachments: Attachment[], newAttachments: Attachment[]) => {
    // Check if adding new attachments would exceed the count limit
    const totalCount = currentAttachments.length + newAttachments.length;
    const withinCountLimit = totalCount <= MAX_ATTACHMENTS_PER_NOTE;

    // Check if any new attachment exceeds the size limit
    const withinSizeLimit = newAttachments.every(att => att.size <= MAX_ATTACHMENT_SIZE);

    return { withinSizeLimit, withinCountLimit };
  };

  const contextValue = useMemo(() => ({
    state,
    addNote,
    updateNote,
    deleteNote,
    setSearchQuery,
    checkAttachmentLimits
  }), [state]);

  return (
    <NotesContext.Provider value={contextValue}>
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = (): NotesContextType => {
  const context = useContext(NotesContext);

  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }

  return context;
};
