import { useNotes } from '../../context/NotesContext';
import { FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Modal from '../ui/Modal';

export default function DeleteNoteModal({ isOpen, onClose, noteId, title }) {
  const { deleteNote } = useNotes();

  // Handle deletion confirmation
  const handleDelete = () => {
    deleteNote(noteId);
    onClose();
  };

  // Modal footer buttons
  const modalFooter = (
    <>
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
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Note"
      titleIcon={<FaTrash />}
      titleClassName="text-red-600"
      footer={modalFooter}
    >
      <p className="text-gray-700 mb-2">
        Are you sure you want to delete this note?
      </p>
      <p className="font-semibold text-gray-800 mb-2">"{title}"</p>
      <p className="text-gray-600 text-sm">
        This action cannot be undone.
      </p>
    </Modal>
  );
}
