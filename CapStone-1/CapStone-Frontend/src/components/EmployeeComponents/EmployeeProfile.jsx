import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./EmployeeProfile.css";

const EmployeeProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    department: "",
    address: "",
  });

  const fetchUserProfile = async () => {
    try {
      const userEmail = localStorage.getItem("userEmail"); // Fetch email only
      if (!userEmail) {
        navigate("/login"); // Redirect if user is not found
        return;
      }

      // Fetch user details using email
      const response = await axios.get(`http://localhost:8080/api/users/profile?email=${userEmail}`);
      setFormData(response.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put("http://localhost:8080/api/users/update", formData, {
        headers: { "Content-Type": "application/json" },
      });

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("userEmail");
    navigate("/");
  };

  const handleDeactivate = async () => {
    try {
      await axios.put(`http://localhost:8080/api/users/deactivate/${formData.id}`);
      alert("Account deactivated.");
      localStorage.removeItem("userEmail");
      navigate("/");
    } catch (error) {
      console.error("Error deactivating account:", error);
      alert("Failed to deactivate account.");
    }
  };

  return (
    <div className="profile-outer-container">
      <div className="left-profile-container">
        <img className="employee-image" src="../../../src/assets/jk.jpeg" alt="profile-icon" />
        <p className="employee-name">{formData.name}</p>
        <p className="employee-email">{formData.email}</p>
        <p className="employee-department">{formData.department}</p>
        <p className="employee-address">{formData.address}</p>
        <button onClick={handleSignOut}>Sign Out</button>
        <button onClick={handleDeactivate}>Deactivate</button>
      </div>

      <div className="right-profile-container">
        {["name", "email", "contact", "department", "address"].map((field, index) => (
          <div className="input-container" key={index}>
            <input type="text" id={field} name={field} value={formData[field] || ""} onChange={handleChange} required />
            <label htmlFor={field} className="label">
              Enter {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <div className="underline"></div>
          </div>
        ))}
        <button id="save-changes-button" onClick={handleSaveChanges}>
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EmployeeProfile;
