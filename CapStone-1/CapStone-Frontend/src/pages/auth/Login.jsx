import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./style.css"

const Login = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const who = params.get("who") || "Employee";
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null); // Clear error when user types
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await axios.post("http://localhost:8080/api/users/login", formData, {
        headers: { "Content-Type": "application/json" },
      });

      // Fetch user profile after login
      const userProfile = await axios.get(`http://localhost:8080/api/users/profile?email=${formData.email}`);

      // Store user details in localStorage
      localStorage.setItem("userEmail", formData.email);

      if (who === "HR" && userProfile.data.role !== "HR") {
        setShowModal(true);
        setTimeout(() => {
          setShowModal(false);
          navigate("/");
        }, 3000);
        return;
      }
      
      if (who === "HR") {
        localStorage.setItem("role", "HR");
      }

      console.log(`${who} logged in successfully`, userProfile.data);
      navigate(`/${who.toLowerCase()}/home`);
    } catch (error) {
      setError(error.response?.data || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2 className="auth-title">{who} Login</h2>
            <div className="auth-subtitle">Welcome back! Please enter your details</div>
          </div>

          <form className="auth-form" onSubmit={handleLogin}>
            {error && <div className="auth-error">{error}</div>}

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>

            <button 
              type="submit" 
              className={`auth-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account?{" "}
              <a href={`/signup?who=${who}`} className="auth-link">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Modal for non-HR users trying to access HR page */}
      {showModal && (
        <div className="login-modal-overlay">
          <div className="login-modal">
            <div className="login-modal-content">
              <h3 className="login-modal-title">Access Denied</h3>
              <p className="login-modal-message">You are not authorized to access the HR portal. Redirecting to home page...</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;