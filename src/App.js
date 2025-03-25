import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter as Router, Route, Routes, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Register from "./components/Register";
import Login from "./components/Login";
import Header from './components/Header';

import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Welcome from './components/Welcome';
import RecipePage from './components/RecipePage';

const App = () => {
  const [user, setUser] = useState(null);
  const [pages, setPages] = useState([]);
  
  // Effect to load user data from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setUser(JSON.parse(storedUser)); // Convert back to object
    }
  }, []);

  // Effect to fetch pages data when user is authenticated
  useEffect(() => {
    if (user && user.id) {
      fetchUserPages();
    }
  }, [user]);

  // Function to fetch user pages from the backend
  // In App.js
const fetchUserPages = async () => {
  try {
    console.log("Fetching user pages...");
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token found");
      return;
    }

    const response = await fetch("http://localhost:5690/api/users/dashboard", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error("Dashboard fetch failed:", await response.text());
      return;
    }

    const data = await response.json();
    console.log("Pages data received:", data);
    
    if (data.pages && Array.isArray(data.pages)) {
      setPages(data.pages);
    } else {
      console.error("Invalid pages data:", data);
      setPages([]);
    }
  } catch (error) {
    console.error("Error fetching pages:", error);
  }
};

  // Component to handle dynamic page routing with ID parameter
  const RecipePageWrapper = () => {
    const { pageId } = useParams();
    const page = pages.find(p => p._id === pageId);
    
    return (
      <RecipePage 
        user={user} 
        page={page} 
        refreshPages={fetchUserPages}
      />
    );
  };

  return (
    <Router>
      {/*Header*/}
      <Header user={user} setUser={setUser} />

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/welcome" element={<Welcome user={user} />} />
        
        <Route element={<ProtectedRoute user={user} />}>
    <Route path="/dashboard" element={<Dashboard user={user} pages={pages} refreshPages={fetchUserPages} />} />
    {/* This is the correct route pattern for recipe pages */}
    <Route path="/recipe/:pageId" element={<RecipePageWrapper />} />
  </Route>
      </Routes>
    </Router>
  );
}

export default App;