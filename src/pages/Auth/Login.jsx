import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle, FaGithub, FaEnvelope, FaLock, FaExclamationCircle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/layout/Layout';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle, loginWithGithub } = useAuth();
  const navigate = useNavigate();

  // Handle email/password login
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.code === 'auth/invalid-credential'
          ? 'Invalid email or password'
          : 'Failed to log in. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      console.error('Google login error:', err);
      setError('Failed to sign in with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle GitHub login
  const handleGithubLogin = async () => {
    try {
      setError('');
      setLoading(true);
      await loginWithGithub();
      navigate('/');
    } catch (err) {
      console.error('GitHub login error:', err);
      setError('Failed to sign in with GitHub. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto bg-white dark:bg-[#181818] rounded-lg shadow-md p-6 mt-10 transition-colors duration-300">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">Log in to Quickie Notes</h2>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md mb-4 flex items-center">
            <FaExclamationCircle className="mr-2" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1" htmlFor="email">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 dark:text-gray-400">
                <FaEnvelope />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500
                dark:bg-[#393B41] dark:border-gray-600 dark:text-gray-100 transition-colors"
                placeholder="Email address"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 dark:text-gray-400">
                <FaLock />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500
                dark:bg-[#393B41] dark:border-gray-600 dark:text-gray-100 transition-colors"
                placeholder="Password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:bg-yellow-300
            dark:disabled:bg-yellow-800 transition-colors"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <div className="my-4 flex items-center">
          <hr className="flex-grow border-gray-300 dark:border-gray-600" />
          <span className="px-3 text-gray-500 dark:text-gray-400 text-sm">OR</span>
          <hr className="flex-grow border-gray-300 dark:border-gray-600" />
        </div>

        <div className="space-y-3">
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-white dark:bg-[#393B41] border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-2 px-4 rounded-md
            hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center justify-center transition-colors"
            disabled={loading}
          >
            <FaGoogle className="text-red-500 mr-2" />
            Continue with Google
          </button>

          <button
            onClick={handleGithubLogin}
            className="w-full bg-[#181818] dark:bg-[#393B41] text-white py-2 px-4 rounded-md hover:bg-gray-900 dark:hover:bg-gray-600
            flex items-center justify-center transition-colors"
            disabled={loading}
          >
            <FaGithub className="mr-2" />
            Continue with GitHub
          </button>
        </div>

        <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-yellow-500 dark:text-[#9B7D56] hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </Layout>
  );
}
