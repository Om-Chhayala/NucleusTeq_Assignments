"use client"

import { useEffect, useState } from "react"
import "./EmployeeHome.css"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { showToast } from "../Toasters/toast-container"

const EmployeeHome = () => {
  const navigate = useNavigate()
  const [surveys, setSurveys] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchActiveSurveys = async () => {
      setIsLoading(true);
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          throw new Error("User ID not found");
        }
  
        const response = await axios.get(
          `http://localhost:8080/api/active-surveys/fetch?userId=${userId}`
        );
        setSurveys(response.data);
      } catch (error) {
        console.error("Error fetching active surveys:", error);
        showToast("Failed to load surveys", "error");
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchActiveSurveys();
  }, []); 

  const handleFillSurvey = (formId) => {
    navigate(`/employee/fillsurvey/${formId}`)
  }

  return (
    <div className="employee-home-container">
      <div className="employee-home-header">
        <h1>Available Surveys</h1>
        <p>Complete surveys assigned to you</p>
      </div>

      <div className="employee-home-list-container">
        {isLoading ? (
          <div className="employee-home-loading">
            <div className="employee-home-spinner"></div>
            <p>Loading surveys...</p>
          </div>
        ) : surveys.length === 0 ? (
          <div className="employee-home-no-results">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <p>No active surveys available.</p>
          </div>
        ) : (
          <div className="employee-home-list">
            {surveys.map((survey) => (
              <div className="employee-home-card" key={survey.formId}>
                <div className="employee-home-card-header">
                  <span className="employee-home-date">
                    {survey.createdAt||
                      new Date().toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                  </span>
                  <span className="employee-home-badge">{survey.title || "Survey"}</span>
                </div>
                <h3 className="employee-home-title">{survey.formType}</h3>
                <p className="employee-home-description">{survey.description}</p>
                <div className="employee-home-card-footer">
                  <div className="employee-home-owner">
                    <span>By {survey.owner || "Admin"}</span>
                  </div>
                  <div className="employee-home-actions">
                    <button className="employee-home-button" onClick={() => handleFillSurvey(survey.formId)}>
                      Fill Survey
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default EmployeeHome

