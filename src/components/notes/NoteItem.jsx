import { useState } from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNotes } from '../../context/NotesContext';
import EditNoteModal from './EditNoteModal';
import DeleteNoteModal from './DeleteNoteModal';

export default function NoteItem({ note }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Format date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Animation variants for note item
  const noteVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };

  return (
    <motion.div
      className="bg-white dark:bg-[#181818] rounded-lg shadow-md p-4 h-full flex flex-col transition-colors duration-300"
      variants={noteVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
    >
      <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">{note.title}</h3>

      <div className="text-gray-600 dark:text-gray-300 mb-4 flex-grow overflow-hidden">
        {/* Only show the first few lines of content */}
        <p className="line-clamp-4">{note.content || "No content"}</p>
      </div>

      <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {formatDate(note.createdAt)}
        </span>

        <div className="flex space-x-2">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="text-yellow-500 hover:text-yellow-700 dark:text-[#9B7D56] dark:hover:text-yellow-300 transition-colors"
            aria-label="Edit note"
          >
            <FaEdit />
          </button>

          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
            aria-label="Delete note"
          >
            <FaTrash />
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      <EditNoteModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        note={note}
      />

      {/* Delete Modal */}
      <DeleteNoteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        noteId={note.id}
        title={note.title}
      />
    </motion.div>
  );
}
