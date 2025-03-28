import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * Welcome component that displays a personalized greeting if the user is logged in.
 * If the user is not logged in, it prompts them to log in.
 * 
 * @param {Object} props - Component props
 * @param {Object|null} props.user - The user object or null if not logged in
 * @param {Function} props.setUser - Function to set the user state (if needed for logout or other actions)
 * 
 * @returns {JSX.Element} The rendered Welcome component
 */
const Welcome = ({ user, setUser }) => {
  const navigate = useNavigate();

  // If user is null or undefined, handle it gracefully
  if (!user) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-warning">
          Please log in to view this page.
        </div>
        <button className="btn btn-primary" onClick={() => navigate("/login")}>
          Go to Login
        </button>
      </div>
    );
  }

  // If we have a user, show the welcome page
  return (
    <div className="container mt-5">
      <div className="card p-4 shadow">
        <h1 className="text-center mb-4">Welcome, {user.username}!</h1>

        <div className="d-grid gap-3">
          <button
            className="btn btn-primary btn-lg"
            onClick={() => navigate("/Dashboard")}
          >
            View Recipe Pages
          </button>

          <button
            className="btn btn-secondary btn-lg"
            onClick={() => navigate("/themes")}
          >
            Themes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
