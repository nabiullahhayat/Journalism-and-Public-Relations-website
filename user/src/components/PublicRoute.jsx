import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PublicRoute = ({ children, redirectIfAuthenticated = false }) => {
  const { isAuthenticated, isInitialized, isLoading } = useAuth();

  // Wait for auth initialization
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C79C78]"></div>
      </div>
    );
  }

  // If user is authenticated and we should redirect, go to dashboard
  if (redirectIfAuthenticated && isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Otherwise, render the public content
  return children;
};

export default PublicRoute;
