import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';  // Import Link and useNavigate

function Header({ user, setUser }) {
  const location = useLocation();  // Get the current location (route)
  const navigate = useNavigate();  // Get the navigate function
  
  // Conditional header content based on the current route
  const renderHeader = () => {
    if (location.pathname === '/register') {
      return <h1>Register for an Account</h1>;
    } else if (location.pathname === '/login') {
      return <h1>Welcome Back! Please Login</h1>;
    } else {
      return <h1>Baker Buddy</h1>;  // Default header
    }
  };

  const handleLogout = () => {
    // Only proceed if setUser is a function
    if (typeof setUser === 'function') {
      localStorage.removeItem("token"); 
      localStorage.removeItem("user"); // Clear user data
      setUser(null); // Reset state
      navigate('/login'); // Redirect to login using React Router
    } else {
      console.error("setUser is not a function");
    }
  };

  const renderLogout = () => {
    if (user && location.pathname !== '/register' && location.pathname !== '/login') {
      return (
        <button 
          className="btn btn-danger"
          onClick={handleLogout}
        >
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
                <Link to="/register" className="nav-link">Register</Link>
              </li>
              <li className="nav-item mx-2">
                <Link to="/login" className="nav-link">Login</Link>
              </li>
              <li className="nav-item mx-2">
                {renderLogout()}
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;