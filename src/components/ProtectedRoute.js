import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ user }) => {
  // Check if the user is authenticated
  const isAuthenticated = !!user;
  
  // If not authenticated, redirect to the login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Otherwise, render the protected content
  return <Outlet />;
};

export default ProtectedRoute;