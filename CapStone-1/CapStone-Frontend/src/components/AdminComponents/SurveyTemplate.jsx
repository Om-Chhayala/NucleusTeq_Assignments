import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SurveyTemplate.css";
import SurveyModal from "./SurveyModal";

const API_BASE_URL = "http://localhost:8080/api";

const SurveyTemplate = () => {
  const [surveys, setSurveys] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [selectedSurveys, setSelectedSurveys] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/forms/all`);
        setSurveys(data);
      } catch (error) {
        console.error("Error fetching surveys:", error);
      }
    };
    fetchSurveys();
  }, []);

  const handleFillSurvey = (id) => navigate(`/employee/fillsurvey/${id}`);

  const handleDeleteSurvey = async (id) => {
    if (window.confirm("Are you sure you want to delete this survey?")) {
      try {
        await axios.delete(`${API_BASE_URL}/forms/delete/${id}`);
        setSurveys((prev) => prev.filter((survey) => survey.formId !== id));
      } catch (error) {
        console.error("Error deleting survey:", error);
        alert("Failed to delete survey.");
      }
    }
  };

  const handlePublishClick = () => {
    setSelectedSurveys(new Set());
    setIsPublishModalOpen(true);
  };

  const handleToggleSurvey = (formId) => {
    setSelectedSurveys((prev) => {
      const updated = new Set(prev);
      updated.has(formId) ? updated.delete(formId) : updated.add(formId);
      return updated;
    });
  };

  const handlePublishSurveys = async () => {
    if (selectedSurveys.size === 0) {
      alert("No surveys selected for publishing.");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:8080/api/active-surveys/store",
        Array.from(selectedSurveys), // Pass only the array
        { headers: { "Content-Type": "application/json" } }
      );
      
      if (response.status === 200) {
        alert("Surveys published successfully!");
        setIsPublishModalOpen(false);
      }
    } catch (error) {
      console.error("Error publishing surveys:", error);
      alert("Failed to publish surveys.");
    }
  };

  return (
    <>
      <div className="survey-card-container">  
        {surveys.length === 0 ? (
          <p className="no-surveys">No surveys available</p>
        ) : (
          surveys.map((survey) => (
            <div className="survey-card" key={survey.formId}>
              <div className="main-content">
                <p className="survey-card-heading">{survey.formType}</p>
                <p className="survey-card-description">{survey.description}</p>
              </div>
              <div className="survey-card-button-group">
                <button className="survey-view-button" onClick={() => handleFillSurvey(survey.formId)}>View</button>
                <button className="survey-delete-button" onClick={() => handleDeleteSurvey(survey.formId)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="survey-button-container">
        <button className="survey-create-button" onClick={() => setIsModalOpen(true)}>Create Survey</button>
        <button className="survey-publish-button" onClick={handlePublishClick}>Publish Survey</button>
      </div>

      <SurveyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSurveyCreated={() => window.location.reload()} />

      {isPublishModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Publish Surveys</h2>
            <div className="modal-content">
              {surveys.map((survey) => (
                <div key={survey.formId} className="survey-item">
                  <span>{survey.formType}</span>
                  <button
                    className="add-button"
                    onClick={() => handleToggleSurvey(survey.formId)}
                    style={{ backgroundColor: selectedSurveys.has(survey.formId) ? "green" : "" }}
                  >
                    {selectedSurveys.has(survey.formId) ? "Added" : "Add"}
                  </button>
                </div>
              ))}
            </div>
            <div className="modal-buttons">
              <button className="save-button" onClick={handlePublishSurveys} disabled={selectedSurveys.size === 0}>
                Publish
              </button>
              <button className="cancel-button" onClick={() => setIsPublishModalOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SurveyTemplate;