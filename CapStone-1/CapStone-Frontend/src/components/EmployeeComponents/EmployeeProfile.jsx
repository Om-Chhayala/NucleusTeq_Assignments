import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./EmployeeProfile.css";
import image from "../../assets/jk.jpeg";

const EmployeeProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    department: "",
    address: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = async () => {
    setIsLoading(true);
    try {
      const userEmail = localStorage.getItem("userEmail");
      if (!userEmail) {
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `http://localhost:8080/api/users/profile?email=${userEmail}`
      );
      setFormData(response.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setIsLoading(false);
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
      
      setIsEditing(false);
      
      const successMessage = document.getElementById("profile-success-toast");
      successMessage.classList.add("show-toast");
      setTimeout(() => {
        successMessage.classList.remove("show-toast");
      }, 3000);
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
      localStorage.removeItem("userEmail");
      navigate("/");
    } catch (error) {
      console.error("Error deactivating account:", error);
      alert("Failed to deactivate account.");
    }
  };

  const toggleEditMode = () => setIsEditing(!isEditing);
  
  const cancelEdit = () => {
    fetchUserProfile();
    setIsEditing(false);
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  if (isLoading) {
    return (
      <div className="emp-profile-loader">
        <div className="emp-loader-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="emp-profile-page">
      <div className="emp-profile-card">
        <header className="emp-profile-header">
          <h1>Employee Profile</h1>
          <p>Manage your personal information and account settings</p>
        </header>

        <div className="emp-profile-body">
          <aside className="emp-profile-sidebar">
            <div className="emp-avatar-container">
              <img src={image} alt={formData.name} className="emp-avatar-img" />
            </div>
            
            <div className="emp-user-summary">
              <h2 className="emp-user-name">{formData.name}</h2>
              <p className="emp-user-email">{formData.email}</p>
              
              
            </div>
            
            <div className="emp-action-buttons">
              <button className="emp-btn emp-btn-primary" onClick={toggleEditMode}>
                {isEditing ? "Cancel Edit" : "Edit Profile"}
              </button>
              <div className="emp-btn-group">
                <button className="emp-btn emp-btn-secondary" onClick={handleSignOut}>
                  Sign Out
                </button>
                <button 
                  className="emp-btn emp-btn-danger" 
                  onClick={() => setShowDeactivateModal(true)}
                >
                  Deactivate
                </button>
              </div>
            </div>
          </aside>
          
          <main className="emp-profile-main">
            <div className="emp-section-header">
              <h3>{isEditing ? "Edit Your Information" : "Personal Information"}</h3>
              {isEditing && (
                <p className="emp-edit-hint">
                  Make changes to your profile and click Save Changes when done.
                </p>
              )}
            </div>
            
            <form className="emp-profile-form">
              <div className="emp-form-row">
                <div className="emp-form-group">
                  <label htmlFor="name" className="emp-form-label">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="emp-form-input"
                    required
                  />
                </div>
                
                <div className="emp-form-group">
                  <label htmlFor="email" className="emp-form-label">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="emp-form-input"
                    required
                  />
                </div>
              </div>
              
              <div className="emp-form-row">
                <div className="emp-form-group">
                  <label htmlFor="contact" className="emp-form-label">Contact Number</label>
                  <input
                    type="text"
                    id="contact"
                    name="contact"
                    value={formData.contact || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="emp-form-input"
                  />
                </div>
                
                <div className="emp-form-group">
                  <label htmlFor="department" className="emp-form-label">Department</label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    value={formData.department || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="emp-form-input"
                  />
                </div>
              </div>
              
              <div className="emp-form-group emp-form-full-width">
                <label htmlFor="address" className="emp-form-label">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="emp-form-input"
                />
              </div>
              
              {isEditing && (
                <div className="emp-form-actions">
                  <button 
                    type="button" 
                    className="emp-btn emp-btn-secondary" 
                    onClick={cancelEdit}
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="emp-btn emp-btn-primary" 
                    onClick={handleSaveChanges}
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          </main>
        </div>
      </div>
      
      {/* Success Toast */}
      <div id="profile-success-toast" className="emp-success-toast">
        Profile updated successfully!
      </div>
      
      {/* Deactivate Account Modal */}
      {showDeactivateModal && (
        <div className="emp-modal-overlay">
          <div className="emp-modal-container">
            <h3 className="emp-modal-title">Deactivate Account</h3>
            <p className="emp-modal-text">
              Are you sure you want to deactivate your account? This action cannot be undone.
            </p>
            <div className="emp-modal-actions">
              <button 
                className="emp-btn emp-btn-secondary" 
                onClick={() => setShowDeactivateModal(false)}
              >
                Cancel
              </button>
              <button 
                className="emp-btn emp-btn-danger" 
                onClick={handleDeactivate}
              >
                Yes, Deactivate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeProfile;