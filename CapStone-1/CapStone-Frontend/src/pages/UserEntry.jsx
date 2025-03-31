import React from "react";
import { useNavigate } from "react-router-dom";
import "./UserEntry.css";

const UserEntry = () => {
  const navigate = useNavigate();

  const handleButton = (who, action) => () => {
    navigate(`/${action}?who=${who}`);
  };

  return (
    <div className="wrapper">
      <div className="content">
        <h3 id="head-text">LOGIN WITH YOUR RESPECTIVE ROLES</h3>
      </div>
      <div className="Container">
        <div className="section">
          <h2>Employee</h2>
          <div className="button-section">
            <button type="button" onClick={handleButton("Employee", "login")}>
              Login
            </button>
            <button type="button" onClick={handleButton("Employee", "signup")}>
              Signup
            </button>
          </div>
        </div>
        <div className="section">
          <h2>Administrator</h2>
          <div className="button-section">
            <button type="button" onClick={handleButton("HR", "login")}>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserEntry;
