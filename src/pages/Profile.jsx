import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaEnvelope, FaCalendar, FaCheck, FaExclamationCircle } from 'react-icons/fa';
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
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  if (!currentUser) return null;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-blue-500 p-6 text-white text-center">
            <h1 className="text-2xl font-bold mb-2">My Profile</h1>
            <p className="text-blue-100">View and manage your account details</p>
          </div>

          {/* User Info */}
          <div className="p-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 flex items-center">
                <FaExclamationCircle className="mr-2" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="bg-green-50 text-green-600 p-3 rounded-md mb-4 flex items-center">
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
                  <FaUserCircle className="w-32 h-32 text-gray-400" />
                )}
              </div>

              <div className="flex-grow">
                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Display Name
                      </label>
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                    </div>

                    <div className="flex space-x-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
                      >
                        {loading ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div>
                    <div className="mb-4">
                      <h2 className="text-xl font-bold text-gray-800">
                        {currentUser.displayName || 'User'}
                      </h2>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-blue-500 text-sm hover:underline"
                      >
                        Edit name
                      </button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600">
                        <FaEnvelope className="mr-2" />
                        <span>{currentUser.email}</span>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <FaCalendar className="mr-2" />
                        <span>Account created: {formatDate(currentUser.metadata?.creationTime)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
