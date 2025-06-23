import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaSearch, FaSignInAlt, FaUserCircle, FaSignOutAlt, FaHome } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useNotes } from '../../context/NotesContext';
import ThemeToggle from '../ui/ThemeToggle';

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [isSearchAnimating, setIsSearchAnimating] = useState(false);
  const { currentUser, logout } = useAuth();
  const { handleSearch, clearNotes } = useNotes();
  const navigate = useNavigate();
  const location = useLocation(); // Get current location
  const searchRef = useRef(null);

  // Check if currently on profile page
  const isProfilePage = location.pathname === '/profile';

  // Handle search animation timing
  useEffect(() => {
    if (isSearchOpen) {
      setIsSearchAnimating(true);
    } else if (!isSearchOpen && isSearchAnimating) {
      const timer = setTimeout(() => {
        setIsSearchAnimating(false);
      }, 300); // Match this with the animation duration
      return () => clearTimeout(timer);
    }
  }, [isSearchOpen]);

  // Create a stable search handler that doesn't depend on handleSearch
  const searchHandler = useCallback((term) => {
    setSearchInput(term);
    handleSearch(term);
  }, [handleSearch]);

  // Reset search when component unmounts, using a ref to avoid dependency issues
  useEffect(() => {
    // No cleanup function to prevent calling handleSearch on unmount
    // This avoids the infinite loop
  }, []);

  // Handle search input changes
  const handleSearchChange = (e) => {
    const value = e.target.value;
    searchHandler(value);
  };

  // Toggle search input visibility
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) {
      searchHandler('');
    }
  };

  // Handle user logout
  const handleLogout = async () => {
    try {
      await logout();
      clearNotes();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <nav className="bg-white shadow-md py-4 px-6 flex items-center justify-between transition-colors duration-300 dark:bg-[#181818] dark:shadow-black">
      {/* Logo and App Name */}
      <Link to="/" className="flex items-center">
        <img
          src="/icon.png"
          alt="Quickie-Notes Logo"
          className="h-8 w-8 mr-2"
        />
        <span className="text-xl font-bold text-yellow-600 dark:text-[#9B7D56]">Quickie-Notes</span>
      </Link>

      {/* Right Side - Search, Auth, Profile */}
      <div className="flex items-center space-x-4">
        {/* Search - Only show if user is logged in */}
        {currentUser && (
          <div className="relative">
            {(isSearchOpen || isSearchAnimating) ? (
              <div
                ref={searchRef}
                className="flex items-center bg-gray-100 dark:bg-[#393B41] rounded-full overflow-hidden animate-expandDown"
              >
                <input
                  type="text"
                  placeholder="Search notes by title..."
                  value={searchInput}
                  onChange={handleSearchChange}
                  className="py-1 px-3 outline-none bg-gray-100 dark:bg-[#393B41] dark:text-gray-200 w-40 md:w-64"
                  autoFocus
                />
                <button
                  onClick={toggleSearch}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-[#9B7D56] transition-colors duration-200"
                >
                  <FaSearch />
                </button>
              </div>
            ) : (
              <button
                onClick={toggleSearch}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-[#9B7D56] transition-colors duration-200"
              >
                <FaSearch />
              </button>
            )}
          </div>
        )}

        {/* Auth Buttons */}
        {currentUser ? (
          <>
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-600 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-[#9B7D56] transition-colors duration-200"
            >
              <FaSignOutAlt className="mr-1" />
              <span className="hidden md:inline">Logout</span>
            </button>
            {isProfilePage ? (
              <Link
                to="/"
                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-[#9B7D56] transition-colors duration-200"
              >
                <FaHome className="text-2xl" />
                <span className="hidden md:inline ml-1">Home</span>
              </Link>
            ) : (
              <Link
                to="/profile"
                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-[#9B7D56] transition-colors duration-200"
              >
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt="Profile"
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <FaUserCircle className="text-2xl" />
                )}
                <span className="hidden md:inline ml-1">Profile</span>
              </Link>
            )}

            {/* Below Feature Doesn't work - bug needs to be fixed */}
            {/* Theme Toggle */}
            {/*<div className="ml-2">*/}
            {/*  <ThemeToggle />*/}
            {/*</div>*/}
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="flex items-center text-gray-600 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-[#9B7D56] transition-colors duration-200"
            >
              <FaSignInAlt className="mr-1" />
              <span>Login / Sign Up</span>
            </Link>

            {/* Below Feature Doesn't work - bug needs to be fixed */}
            {/* Theme Toggle */}
            {/*<div className="ml-2">*/}
            {/*  <ThemeToggle />*/}
            {/*</div>*/}
          </>
        )}
      </div>
    </nav>
  );
}
