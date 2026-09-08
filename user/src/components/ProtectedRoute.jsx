import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getAccessToken } from '../store/authStore';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, isInitialized, user, isLoading } = useAuth();
  const location = useLocation();
  const hasToken = Boolean(getAccessToken());

  // Wait for auth initialization
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C79C78]"></div>
      </div>
    );
  }

  // Not authenticated or missing token - redirect to login
  if (!isAuthenticated || !hasToken) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">403</h1>
          <p className="text-xl text-gray-600 mb-8">Access Denied</p>
          <p className="text-gray-500">
            You don't have permission to access this resource.
          </p>
        </div>
      </div>
    );
  }

  // Authenticated and authorized
  return children;
};

export default ProtectedRoute;
