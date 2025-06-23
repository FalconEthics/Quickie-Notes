import { useState, useEffect } from 'react';
import { useNotes } from '../../context/NotesContext';
import { motion } from 'framer-motion';
import Modal from '../ui/Modal';

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

  // Handle close for confirm dialog
  const handleConfirmClose = () => {
    setIsConfirmDiscardOpen(false);
  };

  // Modal footer buttons
  const modalFooter = (
    <>
      <button
        onClick={handleDiscardAttempt}
        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
      >
        Discard
      </button>
      <motion.button
        onClick={handleSave}
        disabled={!hasChanges}
        className={`px-4 py-2 rounded-md text-white transition-colors ${
          hasChanges
            ? 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'
            : 'bg-blue-300 dark:bg-blue-800/50 cursor-not-allowed'
        }`}
        whileHover={hasChanges ? { scale: 1.05 } : {}}
        whileTap={hasChanges ? { scale: 0.95 } : {}}
      >
        Save
      </motion.button>
    </>
  );

  // Confirm dialog footer
  const confirmFooter = (
    <>
      <button
        onClick={handleConfirmClose}
        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
      >
        Cancel
      </button>
      <motion.button
        onClick={confirmDiscard}
        className="px-4 py-2 bg-red-500 dark:bg-red-600 text-white rounded-md hover:bg-red-600 dark:hover:bg-red-700 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Discard
      </motion.button>
    </>
  );

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleDiscardAttempt}
        title="Edit Note"
        preventCloseOnBackdrop={hasChanges}
        footer={modalFooter}
      >
        {/* Title (read-only) */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
          <input
            type="text"
            value={note?.title || ''}
            disabled
            className="w-full px-3 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 dark:border-gray-600"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Note: Title cannot be changed</p>
        </div>

        {/* Content */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content</label>
          <textarea
            value={content}
            onChange={handleContentChange}
            rows="6"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          />
        </div>
      </Modal>

      {/* Discard Confirmation Dialog */}
      <Modal
        isOpen={isConfirmDiscardOpen}
        onClose={handleConfirmClose}
        title="Discard Changes?"
        size="sm"
        footer={confirmFooter}
      >
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          You have unsaved changes that will be lost. This action cannot be undone.
        </p>
      </Modal>
    </>
  );
}
