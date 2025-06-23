import { useEffect } from 'react';
import Layout from '../components/layout/Layout';
import NoteForm from '../components/notes/NoteForm';
import NoteItem from '../components/notes/NoteItem';
import { useNotes } from '../context/NotesContext';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { filteredNotes, loading } = useNotes();
  const { currentUser } = useAuth();

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        {/* Greeting section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {currentUser
              ? `Welcome back, ${currentUser.displayName || 'User'}!`
              : 'Welcome to Quickie Notes!'}
          </h1>
          <p className="text-gray-600">
            {currentUser
              ? 'Your notes are synced to your account.'
              : 'Create and manage your notes. Sign in to sync them across devices.'}
          </p>
        </div>

        {/* Note form */}
        <NoteForm />

        {/* Notes grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {filteredNotes.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-medium text-gray-600 mb-2">No notes found</h3>
                <p className="text-gray-500">
                  {currentUser?.searchTerm
                    ? 'Try a different search term.'
                    : 'Click "Add a new note..." to create your first note.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredNotes.map(note => (
                  <NoteItem key={note.id} note={note} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
