import { Link } from 'react-router-dom';
import { FaExclamationTriangle, FaHome } from 'react-icons/fa';
import Layout from '../components/layout/Layout';

export default function NotFound() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-12">
        <FaExclamationTriangle className="text-yellow-500 text-6xl mb-6" />

        <h1 className="text-4xl font-bold text-gray-800 mb-2">404</h1>
        <h2 className="text-2xl font-medium text-gray-600 mb-6">Page Not Found</h2>

        <p className="text-gray-500 max-w-md text-center mb-8">
          The page you're looking for doesn't exist or has been moved to another URL.
        </p>

        <Link
          to="/"
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          <FaHome className="mr-2" />
          Back to Home
        </Link>
      </div>
    </Layout>
  );
}
