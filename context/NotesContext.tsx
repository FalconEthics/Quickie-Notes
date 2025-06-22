import React, { createContext, useContext, useReducer, useEffect, useMemo, useState } from 'react';
import { Note, Attachment } from '@/types';
import { getFromStorage, saveToStorage } from '@/utils/storage';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import _ from 'lodash';
import {
  createNote as createFirestoreNote,
  getNotes as getFirestoreNotes,
  updateNote as updateFirestoreNote,
  deleteNote as deleteFirestoreNote,
  uploadAttachment,
  deleteAttachment
} from '@/config/firebaseService';

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
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_SYNCING'; payload: boolean };

// State Type
interface NotesState {
  notes: Note[];
  filteredNotes: Note[];
  searchQuery: string;
  isLoading: boolean;
  isSyncing: boolean;
}

// Initial State
const initialState: NotesState = {
  notes: [],
  filteredNotes: [],
  searchQuery: '',
  isLoading: true,
  isSyncing: false,
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

    case 'SET_SYNCING':
      return {
        ...state,
        isSyncing: action.payload,
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
  syncNotes: () => Promise<void>;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(notesReducer, initialState);
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [lastSyncTime, setLastSyncTime] = useState<number | null>(null);

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

  // When user logs in, sync notes with cloud
  useEffect(() => {
    if (isAuthenticated && user) {
      syncNotes();
    }
  }, [isAuthenticated, user]);

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

  // Sync notes with cloud if authenticated
  const syncNotes = async () => {
    if (!isAuthenticated || !user) return;

    try {
      dispatch({ type: 'SET_SYNCING', payload: true });

      // Fetch notes from cloud
      const cloudNotes = await getFirestoreNotes(user.id);

      // If there are notes in the cloud but not locally, use cloud version
      if (cloudNotes.length > 0 && state.notes.length === 0) {
        dispatch({ type: 'SET_NOTES', payload: cloudNotes });
      }
      // If there are local notes but no cloud notes, push local notes to cloud
      else if (state.notes.length > 0 && cloudNotes.length === 0) {
        await Promise.all(state.notes.map(async (note) => {
          // Create new note in Firestore without the id (will be assigned by Firestore)
          const { id, ...noteData } = note;
          const newId = await createFirestoreNote(user.id, noteData);

          // Update local note with Firestore ID
          dispatch({
            type: 'UPDATE_NOTE',
            payload: { ...note, id: newId }
          });
        }));
      }
      // If both have notes, merge them with priority to more recent updates
      else {
        // Create a map of cloud notes by ID
        const cloudNotesMap = new Map<string, Note>();
        cloudNotes.forEach(note => cloudNotesMap.set(note.id, note));

        // Update local notes with cloud data if newer
        const updatedNotes = state.notes.map(localNote => {
          const cloudNote = cloudNotesMap.get(localNote.id);
          if (cloudNote && cloudNote.updatedAt > localNote.updatedAt) {
            return cloudNote;
          }
          return localNote;
        });

        // Add cloud notes that don't exist locally
        cloudNotes.forEach(cloudNote => {
          if (!updatedNotes.some(note => note.id === cloudNote.id)) {
            updatedNotes.push(cloudNote);
          }
        });

        dispatch({ type: 'SET_NOTES', payload: updatedNotes });
      }

      setLastSyncTime(Date.now());
    } catch (error) {
      console.error('Failed to sync notes:', error);
    } finally {
      dispatch({ type: 'SET_SYNCING', payload: false });
    }
  };

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

    // If user is authenticated, also save to Firestore
    if (isAuthenticated && user) {
      try {
        // Create note in Firestore
        const { id, ...noteData } = newNote;
        const firestoreId = await createFirestoreNote(user.id, noteData);

        // Update local note with Firestore ID
        dispatch({
          type: 'UPDATE_NOTE',
          payload: { ...newNote, id: firestoreId }
        });

        // Upload attachments if any
        if (attachments.length > 0) {
          const updatedAttachments = await Promise.all(
            attachments.map(async (attachment) => {
              try {
                // In a real implementation, we would convert attachment.uri to blob here
                // For now, we'll just use a mock approach
                const cloudUri = await uploadAttachment(
                  user.id,
                  firestoreId,
                  new Blob(), // This would be the actual file blob
                  attachment.name,
                  attachment.type
                );

                return {
                  ...attachment,
                  uri: cloudUri // Replace local URI with cloud URI
                };
              } catch (error) {
                console.error('Failed to upload attachment:', error);
                return attachment;
              }
            })
          );

          // Update note with cloud attachment URIs
          await updateFirestoreNote(user.id, firestoreId, { attachments: updatedAttachments });

          // Update local note
          dispatch({
            type: 'UPDATE_NOTE',
            payload: {
              ...newNote,
              id: firestoreId,
              attachments: updatedAttachments
            }
          });
        }
      } catch (error) {
        console.error('Failed to save note to cloud:', error);
      }
    }
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

    // If user is authenticated, also update in Firestore
    if (isAuthenticated && user) {
      try {
        // Update note in Firestore
        await updateFirestoreNote(user.id, id, {
          title,
          content,
          updatedAt: updatedNote.updatedAt,
        });

        // Handle attachment changes
        const oldAttachments = new Set(noteToUpdate.attachments.map(att => att.uri));
        const newAttachments = new Set(attachments.map(att => att.uri));

        // Attachments to delete (in old but not in new)
        for (const oldAtt of noteToUpdate.attachments) {
          if (!newAttachments.has(oldAtt.uri)) {
            // Need to delete this attachment
            try {
              await deleteAttachment(user.id, id, oldAtt.name);
            } catch (error) {
              console.error(`Failed to delete attachment ${oldAtt.name}:`, error);
            }
          }
        }

        // New attachments to upload (in new but not in old)
        const attachmentsToUpload = attachments.filter(att => !oldAttachments.has(att.uri));

        if (attachmentsToUpload.length > 0) {
          const updatedAttachments = [...attachments];

          for (let i = 0; i < attachmentsToUpload.length; i++) {
            const attachment = attachmentsToUpload[i];
            const index = attachments.findIndex(att => att.uri === attachment.uri);

            if (index !== -1) {
              try {
                // In a real implementation, we would convert attachment.uri to blob here
                const cloudUri = await uploadAttachment(
                  user.id,
                  id,
                  new Blob(), // This would be the actual file blob
                  attachment.name,
                  attachment.type
                );

                updatedAttachments[index] = {
                  ...attachment,
                  uri: cloudUri // Replace local URI with cloud URI
                };
              } catch (error) {
                console.error('Failed to upload attachment:', error);
              }
            }
          }

          // Update note with cloud attachment URIs
          await updateFirestoreNote(user.id, id, { attachments: updatedAttachments });

          // Update local note
          dispatch({
            type: 'UPDATE_NOTE',
            payload: {
              ...updatedNote,
              attachments: updatedAttachments
            }
          });
        }
      } catch (error) {
        console.error('Failed to update note in cloud:', error);
      }
    }
  };

  const deleteNote = async (id: string) => {
    dispatch({ type: 'DELETE_NOTE', payload: id });

    // If user is authenticated, also delete from Firestore
    if (isAuthenticated && user) {
      try {
        await deleteFirestoreNote(user.id, id);
      } catch (error) {
        console.error('Failed to delete note from cloud:', error);
      }
    }
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
    checkAttachmentLimits,
    syncNotes
  }), [state, isAuthenticated, user]);

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
