import Navbar from './Navbar';
import Footer from './Footer';
import PageTransition from './PageTransition';
import { useTheme } from '../../context/ThemeContext';

export default function Layout({ children }) {
  const { isDarkMode } = useTheme();

  return (
    <div className="flex flex-col min-h-screen max-w-full overflow-hidden bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-6 overflow-x-hidden">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </div>
  );
}
