import React, { useEffect, useState } from "react";
import "./EmployeeHome.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EmployeeHome = () => {
  const navigate = useNavigate();
  const [surveys, setSurveys] = useState([]);

  useEffect(() => {
    // Fetch active surveys from backend
    axios.get("http://localhost:8080/api/active-surveys/fetch")
      .then((response) => {
        setSurveys(response.data);
        console.log(response.data);
        
      })
      .catch((error) => {
        console.error("Error fetching active surveys:", error);
      });
  }, []);

  const handleFillSurvey = (formId) => {
    navigate(`/employee/fillsurvey/${formId}`);
  };

  return (
    <div className="card-container">
      {surveys.length > 0 ? (
        surveys.map((survey) => (
          <div className="card" key={survey.formId}>
            <div className="main-content">
              <div className="header">
                <span>Survey Date</span>
                <span>{survey.createdAt}</span>
              </div>
              <p className="heading">{survey.title}</p>
              <p className="description">{survey.description}</p>
            </div>
            <div className="footer">By {survey.owner}</div>
            <button className="read-more" onClick={() => handleFillSurvey(survey.formId)}>
              Fill Survey 
            </button>
          </div>
        ))
      ) : (
        <p>No active surveys available.</p>
      )}
    </div>
  );
};

export default EmployeeHome;
