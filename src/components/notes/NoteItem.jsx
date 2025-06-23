import { useState } from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';
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

  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-full flex flex-col animate-fadeIn">
      <h3 className="text-lg font-semibold mb-2 text-gray-800">{note.title}</h3>

      <div className="text-gray-600 mb-4 flex-grow overflow-hidden">
        {/* Only show the first few lines of content */}
        <p className="line-clamp-4">{note.content || "No content"}</p>
      </div>

      <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
        <span className="text-xs text-gray-500">
          {formatDate(note.createdAt)}
        </span>

        <div className="flex space-x-2">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="text-blue-500 hover:text-blue-700 transition-colors"
            aria-label="Edit note"
          >
            <FaEdit />
          </button>

          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="text-red-500 hover:text-red-700 transition-colors"
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
    </div>
  );
}
