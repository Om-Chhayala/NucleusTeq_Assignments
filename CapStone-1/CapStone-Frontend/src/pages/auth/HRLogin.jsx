import { useNavigate, useLocation } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";
import "./style.css";

const HRLogin = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const who = params.get("who") || "HR"; // Set default role to HR
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:8080/api/users/login", formData, {
        headers: { "Content-Type": "application/json" },
      });

      // Fetch HR profile after login
      const userProfile = await axios.get(`http://localhost:8080/api/users/profile?email=${formData.email}`);

      // Store HR details in localStorage
      localStorage.setItem("userEmail", formData.email);
      localStorage.setItem("role", "HR");

      console.log("HR logged in successfully", userProfile.data);
      navigate("/hr/home");
    } catch (error) {
      setError(error.response?.data || "Login failed");
    }
  };

  return (
    <div className="wrapper">
      <div className="main-section">
        <h3 id="head-text">HR Login Page</h3>

        {error && <p className="error">{error}</p>}

        <div className="input-container">
          <input
            type="text"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <label htmlFor="email" className="label">
            Enter Email
          </label>
          <div className="underline"></div>
        </div>

        <div className="input-container">
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <label htmlFor="password" className="label">
            Enter Password
          </label>
          <div className="underline"></div>
        </div>

        <div className="button-section">
          <button type="button" onClick={handleLogin}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default HRLogin;
