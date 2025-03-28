import React from "react";
import { useLocation, Link, useNavigate } from "react-router-dom"; // Import Link and useNavigate

/**
 * Header component that displays different content based on the current route.
 * It conditionally renders the header and a logout button, depending on the user's login status.
 * 
 * @param {Object} props - Component properties.
 * @param {Object|null} props.user - The current logged-in user or null if not logged in.
 * @param {Function} props.setUser - Function to update the user state.
 * @returns {JSX.Element} The rendered Header component.
 */
function Header({ user, setUser }) {
  const location = useLocation(); // Get the current location (route)
  const navigate = useNavigate(); // Get the navigate function from React Router

  /**
   * Renders the header title based on the current route.
   * 
   * @returns {JSX.Element} The header element with a dynamic title.
   */
  const renderHeader = () => {
    if (location.pathname === "/register") {
      return <h1>Register for an Account</h1>;
    } else if (location.pathname === "/login") {
      return <h1>Welcome Back! Please Login</h1>;
    } else {
      return <h1>Baker Buddy</h1>; // Default header
    }
  };

  /**
   * Handles logging out the user.
   * Clears the local storage, resets the user state, and navigates to the login page.
   */
  const handleLogout = () => {
    // Only proceed if setUser is a function
    if (typeof setUser === "function") {
      localStorage.removeItem("token");
      localStorage.removeItem("user"); // Clear user data
      setUser(null); // Reset state
      navigate("/login"); // Redirect to login using React Router
    } else {
      console.error("setUser is not a function");
    }
  };

  /**
   * Conditionally renders the logout button if the user is logged in and is not on the login or register page.
   * 
   * @returns {JSX.Element|null} The logout button if conditions are met, otherwise null.
   */
  const renderLogout = () => {
    if (
      user &&
      location.pathname !== "/register" &&
      location.pathname !== "/login"
    ) {
      return (
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      );
    }
    return null;
  };

  return (
    <header className="p-3 bg-light border-bottom">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center">
          <div>{renderHeader()}</div>

          <nav>
            <ul className="nav">
              <li className="nav-item mx-2">
                <Link to="/register" className="nav-link">
                  Register
                </Link>
              </li>
              <li className="nav-item mx-2">
                <Link to="/login" className="nav-link">
                  Login
                </Link>
              </li>
              <li className="nav-item mx-2">{renderLogout()}</li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
