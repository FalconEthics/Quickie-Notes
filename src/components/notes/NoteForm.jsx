import { useState } from 'react';
import { useNotes } from '../../context/NotesContext';
import { FaPlus, FaTimes } from 'react-icons/fa';

export default function NoteForm() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { addNote } = useNotes();

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    addNote({
      title,
      content,
    });

    // Reset form
    setTitle('');
    setContent('');
    setIsExpanded(false);
  };

  // Toggle form expansion
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Close form without saving
  const handleClose = () => {
    setTitle('');
    setContent('');
    setIsExpanded(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out mb-8">
      {!isExpanded ? (
        <div
          onClick={toggleExpand}
          className="p-4 cursor-pointer flex items-center justify-center text-gray-500 hover:bg-gray-50"
        >
          <FaPlus className="mr-2" />
          <span>Add a new note...</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Create New Note</h3>
            <button
              type="button"
              onClick={handleClose}
              className="text-gray-500 hover:text-red-500"
            >
              <FaTimes />
            </button>
          </div>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>

          <div className="mb-4">
            <textarea
              placeholder="Note content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="4"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Note
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
