import React from "react";
import { Navigate, Outlet } from "react-router-dom";

/**
 * ProtectedRoute component that wraps routes requiring authentication.
 * If the user is not authenticated, they will be redirected to the login page.
 * If authenticated, it renders the nested route content.
 *
 * @param {Object} props - The component's props.
 * @param {Object} props.user - The user object containing user data. If the user is not authenticated, this will be `null` or `undefined`.
 * @returns {JSX.Element} A `Navigate` component for redirecting to the login page or an `Outlet` component for rendering protected content.
 */
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
