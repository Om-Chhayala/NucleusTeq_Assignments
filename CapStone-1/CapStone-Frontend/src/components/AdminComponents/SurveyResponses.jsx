import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SurveyResponses.css";

const SurveyResponses = () => {
  const [surveys, setSurveys] = useState([]);
  const [filteredSurveys, setFilteredSurveys] = useState([]);
  const [department, setDepartment] = useState("");
  const [address, setAddress] = useState(""); // Changed from location to address
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSurveys = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("http://localhost:8080/api/employee-responses/all");
        setSurveys(response.data);
        setFilteredSurveys(response.data);
      } catch (error) {
        console.error("Error fetching responses:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSurveys();
  }, []);

  const handleFilter = async () => {
    setIsLoading(true);
    
    try {
      let filteredData = [...surveys];
      
      if (department) {
        const response = await axios.get(`http://localhost:8080/api/employee-responses/by-department`, {
          params: { department },
        });
        filteredData = response.data;
      }
      
      if (address) {
        const response = await axios.get(`http://localhost:8080/api/employee-responses/by-address`, {
          params: { address },
        });
        // If we already filtered by department, filter those results further
        filteredData = filteredData.filter(survey => 
          response.data.some(r => r.id === survey.id)
        );
      }
      
      if (startTime && endTime) {
        const response = await axios.get("http://localhost:8080/api/employee-responses/by-time-range", {
          params: { startTime, endTime },
        });
        // Apply time range filter to existing filtered results
        filteredData = filteredData.filter(survey => 
          response.data.some(r => r.id === survey.id)
        );
      }
      
      setFilteredSurveys(filteredData);
    } catch (error) {
      console.error("Error filtering responses:", error.response?.data || error.message);
      setFilteredSurveys([]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetFilters = () => {
    setDepartment("");
    setAddress("");
    setStartTime("");
    setEndTime("");
    setFilteredSurveys(surveys);
  };

  return (
    <div className="survey-responses-container">
      <div className="survey-responses-header">
        <h1>Survey Responses</h1>
        <p>View and filter employee survey responses</p>
      </div>
      
      <div className="survey-responses-filter-container">
        <div className="survey-responses-filter-group">
          <label htmlFor="department">Department</label>
          <input
            id="department"
            type="text"
            placeholder="Filter by Department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="survey-responses-filter-input"
          />
        </div>
        
        <div className="survey-responses-filter-group">
          <label htmlFor="address">Address</label>
          <input
            id="address"
            type="text"
            placeholder="Filter by Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="survey-responses-filter-input"
          />
        </div>
        
        <div className="survey-responses-filter-group">
          <label htmlFor="startTime">Start Date</label>
          <input
            id="startTime"
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="survey-responses-filter-input"
          />
        </div>
        
        <div className="survey-responses-filter-group">
          <label htmlFor="endTime">End Date</label>
          <input
            id="endTime"
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="survey-responses-filter-input"
          />
        </div>
        
        <div className="survey-responses-filter-actions">
          <button onClick={handleFilter} className="survey-responses-button">
            Apply Filters
          </button>
          <button onClick={resetFilters} className="survey-responses-button secondary">
            Reset
          </button>
        </div>
      </div>
      
      <div className="survey-responses-list-container">
        {isLoading ? (
          <div className="survey-responses-loading">
            <div className="survey-responses-spinner"></div>
            <p>Loading surveys...</p>
          </div>
        ) : filteredSurveys.length === 0 ? (
          <div className="survey-responses-no-results">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <p>No responses found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="survey-responses-list">
            {filteredSurveys.map((survey, index) => (
              <div className="survey-responses-card" key={index} onClick={() => setSelectedSurvey(survey)}>
                <div className="survey-responses-card-header">
                  <span className="survey-responses-date">
                    {new Date(survey.submittedAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                  <span className="survey-responses-badge">{survey.form.formType}</span>
                </div>
                <h3 className="survey-responses-title">{survey.form.formType}</h3>
                <p className="survey-responses-description">{survey.form.description}</p>
                <div className="survey-responses-card-footer">
                  <div className="survey-responses-user">
                    <div className="survey-responses-user-avatar">
                      {survey.user.name.charAt(0)}
                    </div>
                    <span>{survey.user.name}</span>
                    <span className="survey-responses-user-address">{survey.user.address}</span>
                  </div>
                  <button className="survey-responses-button">View</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {selectedSurvey && (
        <div className="survey-responses-modal-overlay" onClick={() => setSelectedSurvey(null)}>
          <div className="survey-responses-modal" onClick={(e) => e.stopPropagation()}>
            <div className="survey-responses-modal-header">
              <h2>{selectedSurvey.form.formType}</h2>
              <button 
                className="survey-responses-modal-close" 
                onClick={() => setSelectedSurvey(null)}
              >
                &times;
              </button>
            </div>
            
            <div className="survey-responses-modal-info">
              <div className="survey-responses-info-item">
                <span className="survey-responses-info-label">Submitted by:</span>
                <span className="survey-responses-info-value">{selectedSurvey.user.name}</span>
              </div>
              <div className="survey-responses-info-item">
                <span className="survey-responses-info-label">Department:</span>
                <span className="survey-responses-info-value">{selectedSurvey.user.department}</span>
              </div>
              <div className="survey-responses-info-item">
                <span className="survey-responses-info-label">Address:</span>
                <span className="survey-responses-info-value">{selectedSurvey.user.address}</span>
              </div>
              <div className="survey-responses-info-item">
                <span className="survey-responses-info-label">Date:</span>
                <span className="survey-responses-info-value">
                  {new Date(selectedSurvey.submittedAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <div className="survey-responses-info-item">
                <span className="survey-responses-info-label">Description:</span>
                <span className="survey-responses-info-value">{selectedSurvey.form.description}</span>
              </div>
            </div>
            
            <div className="survey-responses-modal-body">
              <h3>Responses</h3>
              {selectedSurvey.form.questions.map((question, index) => (
                <div key={index} className="survey-responses-survey-item">
                  <div className="survey-responses-question">
                    <span className="survey-responses-question-number">Q{index + 1}</span>
                    <p>{question}</p>
                  </div>
                  <div className="survey-responses-answer">
                    <span className="survey-responses-answer-label">Response:</span>
                    <p>{selectedSurvey.responses[index]}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="survey-responses-modal-footer">
              <button className="survey-responses-button" onClick={() => setSelectedSurvey(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurveyResponses;