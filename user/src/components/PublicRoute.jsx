import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ADMIN_ROUTES } from '../config/routes';

const PublicRoute = ({ children, redirectIfAuthenticated = false }) => {
  const { isAuthenticated, isInitialized, user } = useAuth();
  const location = useLocation();
  const isLoginPage = location.pathname === ADMIN_ROUTES.login;

  if (!isLoginPage && !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C79C78]" />
      </div>
    );
  }

  if (redirectIfAuthenticated && isAuthenticated && user?.role) {
    return <Navigate to={ADMIN_ROUTES.dashboard} replace />;
  }

  return children;
};

export default PublicRoute;
