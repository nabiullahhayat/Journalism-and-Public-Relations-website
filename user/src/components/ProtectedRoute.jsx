import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getAccessToken } from '../store/authStore';
import { ADMIN_ROUTES } from '../config/routes';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, isInitialized, user } = useAuth();
  const location = useLocation();
  const hasToken = Boolean(getAccessToken());
  const hasSession = isAuthenticated && hasToken && Boolean(user?.role);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C79C78]" />
      </div>
    );
  }

  if (!hasSession) {
    return <Navigate to={ADMIN_ROUTES.login} state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">403</h1>
          <p className="text-xl text-gray-600 mb-8">Access Denied</p>
          <p className="text-gray-500">
            You don&apos;t have permission to access this resource.
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
