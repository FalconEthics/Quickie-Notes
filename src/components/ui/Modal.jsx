import { motion, AnimatePresence } from 'framer-motion';

/**
 * Reusable Modal Component with animations
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to call when modal should close
 * @param {React.ReactNode} props.children - Modal content
 * @param {string} props.title - Modal title
 * @param {React.ReactNode} props.titleIcon - Icon to show next to title
 * @param {string} props.titleClassName - Additional class name for the title
 * @param {boolean} props.preventCloseOnBackdrop - Whether to prevent closing on backdrop click
 * @param {React.ReactNode} props.footer - Footer content (buttons, etc.)
 * @param {string} props.size - Modal size ('sm', 'md', 'lg', 'xl')
 */
export default function Modal({
  isOpen,
  onClose,
  children,
  title,
  titleIcon,
  titleClassName = '',
  preventCloseOnBackdrop = false,
  footer,
  size = 'md',
}) {
  // Size classes mapping
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4',
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

  const handleBackdropClick = () => {
    if (!preventCloseOnBackdrop) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          {/* Backdrop with blur effect */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleBackdropClick}
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          />

          <motion.div
            className={`bg-white rounded-lg shadow-lg w-full ${sizeClasses[size]} relative`}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            {title && (
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className={`text-xl font-semibold flex items-center ${titleClassName}`}>
                  {titleIcon && <span className="mr-2">{titleIcon}</span>}
                  {title}
                </h3>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-red-500 transition-colors"
                  aria-label="Close"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}

            {/* Modal Body */}
            <div className="p-4">
              {children}
            </div>

            {/* Modal Footer */}
            {footer && (
              <div className="flex justify-end space-x-2 p-4 border-t">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
