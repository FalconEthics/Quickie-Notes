import { useNotes } from '../../context/NotesContext';
import { FaTrash, FaTimes } from 'react-icons/fa';

export default function DeleteNoteModal({ isOpen, onClose, noteId, title }) {
  const { deleteNote } = useNotes();

  // Handle deletion confirmation
  const handleDelete = () => {
    deleteNote(noteId);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md animate-scaleIn">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold text-red-600 flex items-center">
            <FaTrash className="mr-2" /> Delete Note
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500"
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
            className="px-4 py-2 border rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center"
          >
            <FaTrash className="mr-1" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}
