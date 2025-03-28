import React, { useState } from "react";
import "./EmployeeProfile.css";
const EmployeeProfile = () => {
  const [formData, setFormData] = useState({
    name: "Om Chhayala",
    email: "om20082003@gmail.com",
    contact : "12345677",
    department: "Full Stack Development",
    address: "Indore Madhya Pradesh",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div className="profile-outer-container">
        <div className="left-profile-container">
          <img
            className="employee-image"
            src="../../../src/assets/jk.jpeg"
            alt="profile-icon"
          />
          <p className="employee-name">Om Chhayala</p>
          <p className="employee-email">om20082003@gmail.com</p>
          <p className="employee-department">Full Stack Developer</p>
          <p className="employee-address">Indore, Madhya Pradesh</p>
          <button>Sign Out</button>
          <button>Deactivate</button>
        </div>

        <div className="right-profile-container">
          {["name", "email", "contact", "department", "address"].map((field, index) => (
            <div className="input-container" key={index}>
              <input
                type="text"
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
          <button id = "save-changes-button">Save Changes</button>
        </div>
      </div>
    </>
  );
};

export default EmployeeProfile;
