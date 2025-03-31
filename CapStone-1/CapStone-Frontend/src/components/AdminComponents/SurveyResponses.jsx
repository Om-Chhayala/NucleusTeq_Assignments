import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SurveyResponses.css";

const SurveyResponses = () => {
  const [surveys, setSurveys] = useState([]);
  const [filteredSurveys, setFilteredSurveys] = useState([]);
  const [department, setDepartment] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedSurvey, setSelectedSurvey] = useState(null);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/employee-responses/all");
        setSurveys(response.data);
        setFilteredSurveys(response.data);
      } catch (error) {
        console.error("Error fetching responses:", error);
      }
    };
    fetchSurveys();
  }, []);

  const handleFilter = async () => {
    if (department) {
      try {
        const response = await axios.get(`http://localhost:8080/api/employee-responses/by-department`, {
          params: { department },
        });
        setFilteredSurveys(response.data);
      } catch (error) {
        console.error("Error fetching department responses:", error.response?.data || error.message);
      }
    } else if (startTime && endTime) {
      try {
        const response = await axios.get("http://localhost:8080/api/employee-responses/by-time-range", {
          params: { startTime, endTime },
        });
        setFilteredSurveys(response.data);
      } catch (error) {
        console.error("Error fetching time range responses:", error.response?.data || error.message);
      }
    } else {
      setFilteredSurveys(surveys);
    }
  };

  return (
    <div className="response-container">
      <div className="fixed-button-container">
        <input
          type="text"
          placeholder="Filter by Department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="response-input"
        />
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="response-input"
        />
        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="response-input"
        />
        <button onClick={handleFilter} className="response-button">Filter</button>
      </div>
      <div className="response-list">
        {filteredSurveys.length === 0 ? (
          <p>No responses found.</p>
        ) : (
          filteredSurveys.map((survey, index) => (
            <div className="response-card" key={index}>
              <div className="response-header">
                <span>Survey Date</span>
                <span>{new Date(survey.submittedAt).toLocaleDateString()}</span>
              </div>
              <p className="response-title">{survey.form.formType}</p>
              <p className="response-description">{survey.form.description}</p>
              <div className="response-footer">By {survey.user.name}</div>
              <button className="response-button" onClick={() => setSelectedSurvey(survey)}>View</button>
            </div>
          ))
        )}
      </div>
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
            <button className="close-button" onClick={() => setSelectedSurvey(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurveyResponses;
