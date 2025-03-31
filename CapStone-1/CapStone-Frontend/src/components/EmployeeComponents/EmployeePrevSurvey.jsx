import React, { useEffect, useState } from "react";
import axios from "axios";
import "./EmployeePrevSurvey.css";

const EmployeePrevSurvey = () => {
  const [surveys, setSurveys] = useState([]);
  const [userId, setUserId] = useState(null);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const userResponse = await axios.get(
          `http://localhost:8080/api/users/profile?email=${userEmail}`
        );
        setUserId(userResponse.data.id);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    if (userEmail) {
      fetchUserId();
    }
  }, [userEmail]);

  useEffect(() => {
    const fetchSurveys = async () => {
      if (!userId) return;
      setIsLoading(true);
      try {
        const response = await axios.get(`http://localhost:8080/api/employee-responses/by-id?id=${userId}`);
        setSurveys(response.data);
      } catch (error) {
        console.error("Error fetching previous surveys:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchSurveys();
    }
  }, [userId]);

  return (
    <div className="prev-survey-container">
      <div className="prev-survey-header">
        <h1>Previous Surveys</h1>
        <p>View your completed survey responses</p>
      </div>
      
      <div className="prev-survey-list-container">
        {isLoading ? (
          <div className="prev-survey-loading">
            <div className="prev-survey-spinner"></div>
            <p>Loading surveys...</p>
          </div>
        ) : surveys.length === 0 ? (
          <div className="prev-survey-no-results">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <p>No previous surveys found.</p>
          </div>
        ) : (
          <div className="prev-survey-list">
            {surveys.map((survey, index) => (
              <div className="prev-survey-card" key={index}>
                <div className="prev-survey-card-header">
                  <span className="prev-survey-date">
                    {new Date(survey.submittedAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                  <span className="prev-survey-badge">{survey.form.formType}</span>
                </div>
                <h3 className="prev-survey-title">{survey.form.formType}</h3>
                <p className="prev-survey-description">{survey.form.description}</p>
                <div className="prev-survey-card-footer">
                  <div className="prev-survey-owner">
                    <span>By {survey.user.name}</span>
                  </div>
                  <div className="prev-survey-actions">
                    <button 
                      className="prev-survey-button" 
                      onClick={() => setSelectedSurvey(survey)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedSurvey && (
        <div className="prev-survey-modal-overlay" onClick={() => setSelectedSurvey(null)}>
          <div className="prev-survey-modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Survey Responses</h2>
            <p><strong>Survey Type:</strong> {selectedSurvey.form.formType}</p>
            <p><strong>Description:</strong> {selectedSurvey.form.description}</p>
            <p><strong>Date Submitted:</strong> {new Date(selectedSurvey.submittedAt).toLocaleDateString()}</p>
            <h3>Your Responses</h3>
            {selectedSurvey.form.questions.map((question, index) => (
              <div key={index} className="prev-survey-response-item">
                <p className="prev-survey-question"><strong>Q{index + 1}:</strong> {question}</p>
                <p className="prev-survey-answer">{selectedSurvey.responses[index]}</p>
              </div>
            ))}
            <button className="prev-survey-modal-button" onClick={() => setSelectedSurvey(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeePrevSurvey;