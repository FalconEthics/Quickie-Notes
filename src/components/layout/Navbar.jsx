import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaSearch, FaSignInAlt, FaUserCircle, FaSignOutAlt, FaHome } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useNotes } from '../../context/NotesContext';

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const { currentUser, logout } = useAuth();
  const { handleSearch, clearNotes } = useNotes();
  const navigate = useNavigate();
  const location = useLocation(); // Get current location

  // Check if currently on profile page
  const isProfilePage = location.pathname === '/profile';

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
    <nav className="bg-white shadow-md py-4 px-6 flex items-center justify-between">
      {/* Logo and App Name */}
      <Link to="/" className="flex items-center">
        <img
          src="/icon.png"
          alt="Quickie-Notes Logo"
          className="h-8 w-8 mr-2"
        />
        <span className="text-xl font-bold text-blue-600">Quickie-Notes</span>
      </Link>

      {/* Right Side - Search, Auth, Profile */}
      <div className="flex items-center space-x-4">
        {/* Search - Only show if user is logged in */}
        {currentUser && (
          <div className="relative">
            {isSearchOpen ? (
              <div className="flex items-center bg-gray-100 rounded-full overflow-hidden transition-all duration-300 ease-in-out">
                <input
                  type="text"
                  placeholder="Search notes by title..."
                  value={searchInput}
                  onChange={handleSearchChange}
                  className="py-1 px-3 outline-none bg-gray-100 w-40 md:w-64"
                />
                <button
                  onClick={toggleSearch}
                  className="p-2 text-gray-600 hover:text-blue-500"
                >
                  <FaSearch />
                </button>
              </div>
            ) : (
              <button
                onClick={toggleSearch}
                className="p-2 text-gray-600 hover:text-blue-500 transition-all duration-300"
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
              className="flex items-center text-gray-600 hover:text-blue-500"
            >
              <FaSignOutAlt className="mr-1" />
              <span className="hidden md:inline">Logout</span>
            </button>
            {isProfilePage ? (
              <Link
                to="/"
                className="flex items-center text-gray-600 hover:text-blue-500"
              >
                <FaHome className="text-2xl" />
                <span className="hidden md:inline ml-1">Home</span>
              </Link>
            ) : (
              <Link
                to="/profile"
                className="flex items-center text-gray-600 hover:text-blue-500"
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
          </>
        ) : (
          <Link
            to="/login"
            className="flex items-center text-gray-600 hover:text-blue-500"
          >
            <FaSignInAlt className="mr-1" />
            <span>Login / Sign Up</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
