import Navbar from './Navbar';
import Footer from './Footer';
import PageTransition from './PageTransition';
import { useTheme } from '../../context/ThemeContext';
import { useEffect, useState } from 'react';

export default function Layout({ children }) {
  const { isDarkMode } = useTheme();
  const [bgImage, setBgImage] = useState(null);

  // Set the background image based on the system theme or user preference
  useEffect(() => {
    // Use the browser's preferred theme for background image
    setBgImage(isDarkMode ? '/darkBG.png' : '/lightBG.png');
  }, [isDarkMode]);

  // Show nothing until we determine the background to avoid flicker
  if (bgImage === null) return null;

  return (
    <div
      className="flex flex-col min-h-screen max-w-full overflow-hidden text-gray-900 dark:text-gray-100 transition-all duration-300
      bg-[url('/lightBG.png')] dark:bg-[url('/darkBG.png')] bg-cover bg-center bg-no-repeat bg-fixed"
    >
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-6 overflow-x-hidden">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </div>
  );
}
