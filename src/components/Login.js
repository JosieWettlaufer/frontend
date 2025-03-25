import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = ({ setUser }) => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5690/api/users/login", credentials, { withCredentials: true });
      
      // Save token & user
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user)); // Fix: Store user properly

      setUser(res.data.user);
      alert("Login successful!");

      //Navigate to welcome page
      navigate("/welcome");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-4 p-4 border rounded shadow-sm">
      <h2 className="mb-3">Login</h2>

      <div className="mb-3">
        <label htmlFor="username" className="form-label">Username</label>
        <input 
            type="text" 
            className="form-control" 
            name="username" 
            id="username"
            placeholder="Enter username" 
            value={credentials.username} 
            onChange={handleChange} 
          />
      </div>

      <div className="mb-3">
        <label htmlFor="password" className="form-label">Password</label>
        <input 
          type="password" 
          className="form-control"
          name="password" 
          id="password"
          placeholder="Enter password" 
          value={credentials.password} 
          onChange={handleChange} 
        />
      </div>

      <button type="submit" className="btn btn-primary">Login</button>
    </form>
  );
};

export default Login;
