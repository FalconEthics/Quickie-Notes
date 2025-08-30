import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUserCircle, FaEnvelope, FaCalendar, FaCheck, FaExclamationCircle, FaInfoCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/layout/Layout';

export default function Profile() {
  const { currentUser, updateUserProfile, loading: authLoading } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !currentUser) {
      navigate('/login');
    } else if (currentUser) {
      setDisplayName(currentUser.displayName || '');
    }
  }, [currentUser, authLoading, navigate]);

  // Format date
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';

    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Handle name update
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (displayName.trim() === currentUser?.displayName) {
      setIsEditing(false);
      return;
    }

    try {
      setLoading(true);
      setError('');

      await updateUserProfile({ displayName });

      setSuccess('Name updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setDisplayName(currentUser?.displayName || '');
    setIsEditing(false);
    setError('');
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 dark:border-yellow-400"></div>
        </div>
      </Layout>
    );
  }

  if (!currentUser) return null;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-[#181818] rounded-lg shadow-md overflow-hidden transition-colors duration-300">
          {/* Header */}
          <div className="bg-yellow-500 dark:bg-yellow-600 p-6 text-white text-center">
            <h1 className="text-2xl font-bold mb-2">My Profile</h1>
            <p className="text-yellow-100">View and manage your account details</p>
          </div>

          {/* User Info */}
          <div className="p-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md mb-4 flex items-center">
                <FaExclamationCircle className="mr-2" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-3 rounded-md mb-4 flex items-center">
                <FaCheck className="mr-2" />
                <span>{success}</span>
              </div>
            )}

            <div className="flex flex-col md:flex-row items-center mb-6">
              <div className="md:mr-6 mb-4 md:mb-0 flex-shrink-0">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt="Profile"
                    className="w-32 h-32 rounded-full"
                  />
                ) : (
                  <FaUserCircle className="w-32 h-32 text-gray-400 dark:text-gray-500" />
                )}
              </div>

              <div className="flex-grow">
                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Display Name
                      </label>
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-[#393B41] dark:border-gray-600 dark:text-gray-100"
                        autoFocus
                      />
                    </div>

                    <div className="flex space-x-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:bg-yellow-300 dark:disabled:bg-yellow-800 transition-colors"
                      >
                        {loading ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-[#393B41] transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div>
                    <div className="mb-4">
                      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                        {currentUser.displayName || 'User'}
                      </h2>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-yellow-500 dark:text-[#9B7D56] text-sm hover:underline"
                      >
                        Edit name
                      </button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <FaEnvelope className="mr-2" />
                        <span>{currentUser.email}</span>
                      </div>

                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <FaCalendar className="mr-2" />
                        <span>Account created: {formatDate(currentUser.metadata?.creationTime)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* About App Section */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
              <Link
                to="/about"
                className="flex items-center justify-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-[#393B41] transition-colors group"
              >
                <FaInfoCircle className="text-yellow-500 dark:text-[#9B7D56] mr-3 text-lg group-hover:scale-110 transition-transform" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">About This App</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
