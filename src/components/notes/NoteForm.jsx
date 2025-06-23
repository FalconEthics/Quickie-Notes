import { useState } from 'react';
import { useNotes } from '../../context/NotesContext';
import { FaPlus, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

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

  // Animation variants for form expansion
  const formVariants = {
    collapsed: {
      height: "auto",
      opacity: 1,
    },
    expanded: {
      height: "auto",
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    exit: {
      height: "auto",
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="bg-white dark:bg-[#181818] rounded-lg shadow-md overflow-hidden mb-8 transition-colors duration-300">
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          <motion.div
            key="collapsed"
            variants={formVariants}
            initial="collapsed"
            animate="collapsed"
            exit="exit"
            onClick={toggleExpand}
            className="p-4 cursor-pointer flex items-center justify-center text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#393B41] transition-colors duration-200"
          >
            <FaPlus className="mr-2" />
            <span>Add a new note...</span>
          </motion.div>
        ) : (
          <motion.form
            key="expanded"
            variants={formVariants}
            initial={{ opacity: 0, height: "auto" }}
            animate="expanded"
            exit="exit"
            onSubmit={handleSubmit}
            className="p-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">Create New Note</h3>
              <button
                type="button"
                onClick={handleClose}
                className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
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
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-[#393B41] dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                autoFocus
              />
            </div>

            <div className="mb-4">
              <textarea
                placeholder="Note content..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="4"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none dark:bg-[#393B41] dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors"
              >
                Add Note
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
