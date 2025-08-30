import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useRouteError,
  isRouteErrorResponse,
  useLocation
} from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { NotesProvider } from './context/NotesContext'
import { ThemeProvider } from './context/ThemeContext'

// Lazy-loaded components
const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Auth/Login'))
const Register = lazy(() => import('./pages/Auth/Register'))
const Profile = lazy(() => import('./pages/Profile'))
const About = lazy(() => import('./pages/About'))
const NotFound = lazy(() => import('./pages/NotFound'))

// Error Boundary Component
function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-red-50 dark:bg-red-900/20">
        <h1 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-4">
          {error.status} {error.statusText}
        </h1>
        <p className="text-gray-700 dark:text-gray-300 mb-4">{error.data?.message || "Something went wrong!"}</p>
        <a href="/" className="text-blue-500 dark:text-blue-400 underline">Go back home</a>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-red-50 dark:bg-red-900/20">
      <h1 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-4">Oops!</h1>
      <p className="text-gray-700 dark:text-gray-300 mb-4">Sorry, an unexpected error has occurred.</p>
      <p className="text-gray-500 dark:text-gray-400 mb-4">{error.message || "Unknown error"}</p>
      <a href="/" className="text-blue-500 dark:text-blue-400 underline">Go back home</a>
    </div>
  );
}

// Loading Spinner Component
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
    </div>
  );
}

// Routes with AnimatePresence
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} errorElement={<ErrorBoundary />} />
        <Route path="/login" element={<Login />} errorElement={<ErrorBoundary />} />
        <Route path="/register" element={<Register />} errorElement={<ErrorBoundary />} />
        <Route path="/profile" element={<Profile />} errorElement={<ErrorBoundary />} />
        <Route path="/about" element={<About />} errorElement={<ErrorBoundary />} />
        <Route path="/404" element={<NotFound />} errorElement={<ErrorBoundary />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

// App Component with Routes
function App() {
  return (
    <StrictMode>
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <NotesProvider>
              <Suspense fallback={<LoadingSpinner />}>
                <AnimatedRoutes />
              </Suspense>
            </NotesProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </StrictMode>
  );
}

createRoot(document.getElementById('root')).render(<App />);
