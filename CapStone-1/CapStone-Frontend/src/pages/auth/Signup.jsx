import { useNavigate, useLocation } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";
import "./style.css";

const Signup = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const who = params.get("who") || "User";  
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    contact: "",
    address: "",
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    try {
      const response = await axios.post("http://localhost:8080/api/users/register", formData, {
        headers: { "Content-Type": "application/json" },
      });

      // Store user details in localStorage
      localStorage.setItem("userEmail", formData.email);

      console.log(`${who} registered successfully`, response.data);
      navigate(`/${who.toLowerCase()}/home`);
    } catch (error) {
      setError(error.response?.data || "Registration failed");
    }
  };

  return (
    <div className="wrapper">
      <div className="main-section">
        <h3 id="head-text">{who} SignUp Page</h3>

        {error && <p className="error">{error}</p>}

        {Object.keys(formData).map((field) => (
          <div className="input-container" key={field}>
            <input
              type={field === "password" ? "password" : "text"}
              id={field}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              required
            />
            <label htmlFor={field} className="label">
              Enter {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <div className="underline"></div>
          </div>
        ))}

        <div className="button-section">
          <button type="button" onClick={handleSignup}>
            SignUp
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
