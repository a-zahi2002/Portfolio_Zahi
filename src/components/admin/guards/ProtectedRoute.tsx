import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Route guard that redirects unauthenticated users to the admin login page.
 * Shows a loading indicator while auth state is being determined.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-charcoal-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Verifying session…</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    // Redirect to login, preserving the attempted URL for post-login redirect
    return <Navigate to="/.admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
