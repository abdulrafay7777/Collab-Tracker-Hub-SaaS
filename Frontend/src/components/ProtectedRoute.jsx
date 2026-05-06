import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute Component
 * 
 * CONCEPT: Role-based route protection
 * 
 * This component acts as a gatekeeper for routes that require specific roles.
 * It checks if the user's role matches the allowed roles before rendering the content.
 * 
 * USAGE:
 * <ProtectedRoute 
 *   allowedRoles={['CEO', 'Manager']} 
 *   element={<CEODashboard />} 
 * />
 * 
 * LOGIC:
 * 1. Get current user and their role from AuthContext
 * 2. Check if user role is in the allowedRoles array
 * 3. If yes: render the requested element
 * 4. If no: redirect to unauthorized or login page
 * 5. If not authenticated: redirect to login
 */

const ProtectedRoute = ({ element, allowedRoles = [] }) => {
  const auth = useAuth();
  const { currentUser, isAuthenticated } = auth;

  // Not logged in - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but no allowedRoles specified - allow access
  if (allowedRoles.length === 0) {
    return element;
  }

  // Check if user's role is in the allowed roles
  if (allowedRoles.includes(currentUser?.userRole)) {
    return element;
  }

  // User doesn't have permission - show unauthorized page
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0514]">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">Access Denied</h1>
        <p className="text-gray-400 mb-6">
          You don't have permission to access this dashboard.
        </p>
        <p className="text-gray-500 text-sm">
          Current Role: <span className="text-white font-semibold">{currentUser?.userRole}</span>
        </p>
      </div>
    </div>
  );
};

export default ProtectedRoute;
