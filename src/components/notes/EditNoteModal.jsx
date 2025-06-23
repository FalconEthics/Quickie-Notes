import { useState, useEffect } from 'react';
import { useNotes } from '../../context/NotesContext';
import { FaTimes } from 'react-icons/fa';

export default function EditNoteModal({ isOpen, onClose, note }) {
  const [content, setContent] = useState('');
  const [isConfirmDiscardOpen, setIsConfirmDiscardOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const { updateNote } = useNotes();

  // Initialize form when note changes
  useEffect(() => {
    if (note) {
      setContent(note.content || '');
      setHasChanges(false);
    }
  }, [note, isOpen]);

  // Check if content changed compared to original
  const checkChanges = (newContent) => {
    setHasChanges(newContent !== (note?.content || ''));
  };

  // Handle content change
  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    checkChanges(newContent);
  };

  // Handle save
  const handleSave = () => {
    updateNote(note.id, {
      content,
    });
    onClose();
  };

  // Handle discard attempt
  const handleDiscardAttempt = () => {
    if (hasChanges) {
      setIsConfirmDiscardOpen(true);
    } else {
      onClose();
    }
  };

  // Confirm discard and close
  const confirmDiscard = () => {
    setIsConfirmDiscardOpen(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md animate-scaleIn">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold text-gray-800">Edit Note</h3>
          <button
            onClick={handleDiscardAttempt}
            className="text-gray-500 hover:text-red-500"
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4">
          {/* Title (read-only) */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={note?.title || ''}
              disabled
              className="w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-800"
            />
            <p className="text-xs text-gray-500 mt-1">Note: Title cannot be changed</p>
          </div>

          {/* Content */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea
              value={content}
              onChange={handleContentChange}
              rows="6"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end space-x-2 p-4 border-t">
          <button
            onClick={handleDiscardAttempt}
            className="px-4 py-2 border rounded-md hover:bg-gray-100"
          >
            Discard
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className={`px-4 py-2 rounded-md text-white ${
              hasChanges ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-300 cursor-not-allowed'
            }`}
          >
            Save
          </button>
        </div>

        {/* Discard Confirmation Dialog */}
        {isConfirmDiscardOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-4 animate-scaleIn">
              <h4 className="text-lg font-semibold mb-3">Discard Changes?</h4>
              <p className="text-gray-600 mb-4">
                You have unsaved changes that will be lost. This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsConfirmDiscardOpen(false)}
                  className="px-4 py-2 border rounded-md hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDiscard}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Discard
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
