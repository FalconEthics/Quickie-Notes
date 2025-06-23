import { useState, useEffect } from 'react';
import { useNotes } from '../../context/NotesContext';
import { FaTrash, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function DeleteNoteModal({ isOpen, onClose, noteId, title }) {
  const { deleteNote } = useNotes();

  // Handle deletion confirmation
  const handleDelete = () => {
    deleteNote(noteId);
    onClose();
  };

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.2 }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2, delay: 0.1 }
    }
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
    exit: {
      opacity: 0,
      y: 20,
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          {/* Backdrop with blur effect */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          />

          <motion.div
            className="bg-white rounded-lg shadow-lg w-full max-w-md relative"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-semibold text-red-600 flex items-center">
                <FaTrash className="mr-2" /> Delete Note
              </h3>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-red-500 transition-colors"
                aria-label="Close"
              >
                <FaTimes />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4">
              <p className="text-gray-700 mb-2">
                Are you sure you want to delete this note?
              </p>
              <p className="font-semibold text-gray-800 mb-2">"{title}"</p>
              <p className="text-gray-600 text-sm">
                This action cannot be undone.
              </p>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end space-x-2 p-4 border-t">
              <button
                onClick={onClose}
                className="px-4 py-2 border rounded-md hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <motion.button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaTrash className="mr-1" /> Delete
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
