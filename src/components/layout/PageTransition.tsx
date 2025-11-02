import { useLocation } from 'react-router-dom'
import { motion, Variants } from 'framer-motion'
import type { PageTransitionProps } from '../../types'

export default function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation()

  // Page transition variants
  const pageVariants: Variants = {
    initial: {
      opacity: 0,
      x: 10
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    exit: {
      opacity: 0,
      x: -10,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  }

  return (
    <motion.div
      key={location.pathname}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      {children}
    </motion.div>
  )
}
