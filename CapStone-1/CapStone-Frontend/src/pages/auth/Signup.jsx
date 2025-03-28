import { useNavigate, useLocation } from "react-router-dom";
import React, { useState } from "react";
import "./style.css";

const Signup = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const who = params.get("who") || "User"; 
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleButton = () => {
    console.log(`Performing login for ${who}`, formData);
    navigate(`/${who.toLowerCase()}/home`);
  };

  return (
    <div className="wrapper">
      {/* <div className="content">
        <h3 id="head-text">{who} SignUp Page</h3>
      </div> */}
      <div className="main-section">
        <div className="input-container">
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <label htmlFor="name" className="label">
            Enter Name
          </label>
          <div className="underline"></div>
        </div>

        <div className="input-container">
          <input
            type="text"
            id="name"
            name="email"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <label htmlFor="name" className="label">
            Enter email
          </label>
          <div className="underline"></div>
        </div>

        <div className="input-container">
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <label htmlFor="name" className="label">
            Enter department
          </label>
          <div className="underline"></div>
        </div>

        <div className="input-container">
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <label htmlFor="name" className="label">
            Enter location
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
          <button type="button" onClick={handleButton}>
            SignUp
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup