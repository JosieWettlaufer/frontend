import "../node_modules/bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS for styling
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useParams,
} from "react-router-dom"; // Import React Router for navigation and dynamic routes
import { useState, useEffect } from "react"; // Import React hooks
import Register from "./components/Register"; // Import Register component
import Login from "./components/Login"; // Import Login component
import Header from "./components/Header"; // Import Header component

import Dashboard from "./components/Dashboard"; // Import Dashboard component
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute component for routing with authentication
import Welcome from "./components/Welcome"; // Import Welcome component
import RecipePage from "./components/RecipePage"; // Import RecipePage component
import ThemeToggle from "./components/ThemeToggle";

const App = () => {
  const [user, setUser] = useState(null); // State to store the current user
  const [pages, setPages] = useState([]); // State to store the user's pages

  // Effect to load user data from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token"); // Get token from localStorage
    const storedUser = localStorage.getItem("user"); // Get user data from localStorage

    if (storedToken && storedUser) {
      setUser(JSON.parse(storedUser)); // Convert stored user data from string back to object
    }
  }, []); // Empty dependency array means this effect runs only once when the component mounts

  // Effect to fetch pages data when user is authenticated
  useEffect(() => {
    if (user && user.id) {
      fetchUserPages(); // Fetch the user's pages if a user exists
    }
  }, [user]); // This effect runs when the user state changes

  // Function to fetch user pages from the backend
  const fetchUserPages = async () => {
    try {
      console.log("Fetching user pages...");
      const token = localStorage.getItem("token"); // Get the token from localStorage
      if (!token) {
        console.log("No token found"); // Log message if token is not available
        return;
      }

      // Fetch the user's pages from the backend
      const response = await fetch("http://localhost:5690/api/users/dashboard", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token as authorization header
        },
      });

      if (!response.ok) {
        console.error("Dashboard fetch failed:", await response.text()); // Log error if fetch fails
        return;
      }

      const data = await response.json(); // Parse the response to JSON
      console.log("Pages data received:", data);

      // If valid pages data is returned, set it to state
      if (data.pages && Array.isArray(data.pages)) {
        setPages(data.pages);
      } else {
        console.error("Invalid pages data:", data);
        setPages([]); // Set an empty array if data is invalid
      }
    } catch (error) {
      console.error("Error fetching pages:", error); // Log any error that occurs during fetch
    }
  };

  // Component to handle dynamic page routing with ID parameter
  const RecipePageWrapper = () => {
    const { pageId } = useParams(); // Get the pageId parameter from the URL
    const page = pages.find((p) => p._id === pageId); // Find the page by ID from the pages state

    return <RecipePage user={user} page={page} refreshPages={fetchUserPages} />; // Render the RecipePage component with the user, page, and refresh function
  };

  return (
    <Router> {/* Wrap everything in Router to enable routing */}
      {/* Header Component */}
      <Header user={user} setUser={setUser} />

      <Routes>
        <Route path="/register" element={<Register />} /> {/* Route to Register page */}
        <Route path="/login" element={<Login setUser={setUser} />} /> {/* Route to Login page */}
        <Route path="/welcome" element={<Welcome user={user} />} /> {/* Route to Welcome page */}

        {/* Protected routes that require authentication */}
        <Route element={<ProtectedRoute user={user} />}>
        {/* Route to Dashboard page */}
          <Route                    
            path="/dashboard"
            element={
              <Dashboard
                user={user}
                pages={pages}
                refreshPages={fetchUserPages}
              />
            }
          /> 
          {/* Route to Themes page */}
            <Route path="/Themes" element={<ThemeToggle />} />
          {/* Dynamic route for recipe pages with pageId parameter */}
          <Route path="/recipe/:pageId" element={<RecipePageWrapper />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
