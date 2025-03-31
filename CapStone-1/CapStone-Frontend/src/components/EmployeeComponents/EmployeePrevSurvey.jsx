import React, { useEffect, useState } from "react";
import axios from "axios";
import "./EmployeePrevSurvey.css";

const EmployeePrevSurvey = () => {
  const [surveys, setSurveys] = useState([]);
  const [userId, setUserId] = useState(null);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
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
      try {
        const response = await axios.get(`http://localhost:8080/api/employee-responses/by-id?id=${userId}`);
        setSurveys(response.data);
      } catch (error) {
        console.error("Error fetching previous surveys:", error);
      }
    };

    if (userId) {
      fetchSurveys();
    }
  }, [userId]);

  return (
    <div className="card-container">
      {surveys.length === 0 ? (
        <p>No previous surveys found.</p>
      ) : (
        surveys.map((survey, index) => (
          <div className="card" key={index}>
            <div className="main-content">
              <div className="header">
                <span>Survey Date</span>
                <span>{new Date(survey.submittedAt).toLocaleDateString()}</span>
              </div>
              <p className="heading">{survey.form.formType}</p>
              <p className="description">{survey.form.description}</p>
            </div>
            <div className="footer">By {survey.user.name}</div>
            <button className="read-more" onClick={() => setSelectedSurvey(survey)}>View</button>
          </div>
        ))
      )}
      {selectedSurvey && (
        <div className="modal-overlay" onClick={() => setSelectedSurvey(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Survey Responses</h2>
            <p><strong>Survey Type:</strong> {selectedSurvey.form.formType}</p>
            <p><strong>Description:</strong> {selectedSurvey.form.description}</p>
            <h3>Responses</h3>
            {selectedSurvey.form.questions.map((question, index) => (
              <div key={index} className="response-item">
                <p><strong>Q{index + 1}:</strong> {question}</p>
                <p><strong>Response:</strong> {selectedSurvey.responses[index]}</p>
              </div>
            ))}
            <button onClick={() => setSelectedSurvey(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeePrevSurvey;