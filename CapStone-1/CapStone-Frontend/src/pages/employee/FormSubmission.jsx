import React, { useState } from "react";
import "./formSubmission.css";

const fields = ["name", "email", "contact", "department", "address"];

const FormSubmission = () => {
  const [formData, setFormData] = useState(
    Object.fromEntries(fields.map((field) => [field, ""]))
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
  };

  return (
    <div className="form-page-container">
      {/* Fixed Home Button */}
      <button className="home-button" onClick={() => (window.location.href = "/")}>
        Home
      </button>

      <form className="form-container" onSubmit={handleSubmit}>
        {fields.map((field, index) => (
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
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <div className="underline"></div>
          </div>
        ))}
        <button type="submit" className="save-button">Save Changes</button>
      </form>
    </div>
  );
};

export default FormSubmission;
