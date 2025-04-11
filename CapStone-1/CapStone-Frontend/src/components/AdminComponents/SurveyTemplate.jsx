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
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedSurvey, setEditedSurvey] = useState(null);

  const fetchSurveys = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE_URL}/forms/all`);
      setSurveys(data);
    } catch (error) {
      console.error("Error fetching surveys:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
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
        Array.from(selectedSurveys),
        { headers: { "Content-Type": "application/json" } }
      );
      
      if (response.status === 200) {
        alert("Surveys published successfully!");
        setIsPublishModalOpen(false);
      }
    } catch (error) {
      console.error("Error publishing surveys:", error);
      alert("Failed to publish surveys.");
    } finally {
      fetchSurveys()
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedSurvey({...selectedSurvey});
  };

  const handleEditChange = (field, value) => {
    setEditedSurvey(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleQuestionChange = (index, value) => {
    const updatedQuestions = [...editedSurvey.questions];
    updatedQuestions[index] = value;
    setEditedSurvey(prev => ({
      ...prev,
      questions: updatedQuestions
    }));
  };

  const handleAddQuestion = () => {
    setEditedSurvey(prev => ({
      ...prev,
      questions: [...prev.questions, ""]
    }));
  };

  const handleRemoveQuestion = (index) => {
    const updatedQuestions = editedSurvey.questions.filter((_, i) => i !== index);
    setEditedSurvey(prev => ({
      ...prev,
      questions: updatedQuestions
    }));
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/forms/update/${editedSurvey.formId}`,
        editedSurvey
      );
      
      if (response.status === 200) {
        setSurveys(prev => 
          prev.map(survey => 
            survey.formId === editedSurvey.formId ? editedSurvey : survey
          )
        );
        setSelectedSurvey(editedSurvey);
        setIsEditing(false);
        alert("Survey updated successfully!");
      }
    } catch (error) {
      console.error("Error updating survey:", error);
      alert("Failed to update survey.");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedSurvey(null);
  };

  return (
    <div className="survey-template-container">
      <div className="survey-template-header">
        <h1>Survey Templates</h1>
        <p>Manage and publish survey templates for your organization</p>
      </div>
      
      <div className="survey-template-list-container">
        {isLoading ? (
          <div className="survey-template-loading">
            <div className="survey-template-spinner"></div>
            <p>Loading surveys...</p>
          </div>
        ) : surveys.length === 0 ? (
          <div className="survey-template-no-results">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <p>No surveys available. Create your first survey template.</p>
          </div>
        ) : (
          <div className="survey-template-list">
            {surveys.map((survey) => (
              <div className="survey-template-card" key={survey.formId}>
                <div className="survey-template-card-header">
                  <span className="survey-template-date">
                    {survey.is_active ? "Active" : "Not Active"}
                  </span>
                  <span className="survey-template-badge">{survey.formType}</span>
                </div>
                <h3 className="survey-template-title">{survey.formType}</h3>
                <p className="survey-template-description">{survey.description}</p>
                <div className="survey-template-card-footer">
                  <div className="survey-template-type"></div>
                  <div className="survey-template-actions">
                    <button className="survey-template-button" onClick={() => setSelectedSurvey(survey)}>View</button>
                    <button className="survey-template-button secondary" onClick={() => handleDeleteSurvey(survey.formId)}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedSurvey && (
        <div className="survey-template-modal-overlay" onClick={() => {
          setSelectedSurvey(null);
          setIsEditing(false);
        }}>
          <div className="survey-template-modal" onClick={(e) => e.stopPropagation()}>
            <div className="survey-template-modal-header">
              <h2>Survey Details</h2>
            </div>
            
            <div className="survey-template-modal-info">
              {isEditing ? (
                <>
                  <div className="survey-template-info-item">
                    <span className="survey-template-info-label">Survey Type:</span>
                    <input
                      type="text"
                      value={editedSurvey.formType}
                      onChange={(e) => handleEditChange('formType', e.target.value)}
                      className="survey-template-edit-input"
                    />
                  </div>
                  <div className="survey-template-info-item">
                    <span className="survey-template-info-label">Description:</span>
                    <textarea
                      value={editedSurvey.description}
                      onChange={(e) => handleEditChange('description', e.target.value)}
                      className="survey-template-edit-textarea"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="survey-template-info-item">
                    <span className="survey-template-info-label">Survey Type:</span>
                    <span className="survey-template-info-value">{selectedSurvey.formType}</span>
                  </div>
                  <div className="survey-template-info-item">
                    <span className="survey-template-info-label">Description:</span>
                    <span className="survey-template-info-value">{selectedSurvey.description}</span>
                  </div>
                </>
              )}
            </div>
            
            <div className="survey-template-modal-body">
              <h3>Questions</h3>
              {isEditing ? (
                <>
                  {editedSurvey.questions.map((question, index) => (
                    <div key={index} className="survey-template-question-edit">
                      <div className="survey-template-question-edit-row">
                        <span className="survey-template-question-number">Q{index + 1}</span>
                        <input
                          type="text"
                          value={question}
                          onChange={(e) => handleQuestionChange(index, e.target.value)}
                          className="survey-template-edit-input"
                        />
                        <button 
                          className="survey-template-question-remove"
                          onClick={() => handleRemoveQuestion(index)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                  <button 
                    className="survey-template-button secondary"
                    onClick={handleAddQuestion}
                  >
                    Add Question
                  </button>
                </>
              ) : (
                <>
                  {selectedSurvey.questions && selectedSurvey.questions.map((question, index) => (
                    <div key={index} className="survey-template-survey-item">
                      <div className="survey-template-question">
                        <span className="survey-template-question-number">Q{index + 1}</span>
                        <p>{question}</p>
                      </div>
                    </div>
                  ))}
                  {(!selectedSurvey.questions || selectedSurvey.questions.length === 0) && (
                    <p>No questions available for this survey.</p>
                  )}
                </>
              )}
            </div>
            
            <div className="survey-template-modal-footer">
              {isEditing ? (
                <>
                  <button 
                    className="survey-template-button secondary"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                  <button 
                    className="survey-template-button"
                    onClick={handleSaveEdit}
                  >
                    Save Changes
                  </button>
                </>
              ) : (
                <>
                  <button 
                    className="survey-template-button secondary"
                    onClick={handleEditClick}
                  >
                    Edit
                  </button>
                  <button 
                    className="survey-template-button"
                    onClick={() => {
                      setSelectedSurvey(null);
                      setIsEditing(false);
                    }}
                  >
                    Close
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="survey-template-admin-controls">
        <button className="survey-template-create-button" onClick={() => setIsModalOpen(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Create Survey
        </button>
        <button className="survey-template-publish-button" onClick={handlePublishClick}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
            <polyline points="16 6 12 2 8 6"></polyline>
            <line x1="12" y1="2" x2="12" y2="15"></line>
          </svg>
          Publish Survey
        </button>
      </div>

      <SurveyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSurveyCreated={() => window.location.reload()} />

      {isPublishModalOpen && (
        <div className="survey-template-modal-overlay">
          <div className="survey-template-modal">
            <div className="survey-template-modal-header">
              <h2>Publish Surveys</h2>
              <button className="survey-template-modal-close" onClick={() => setIsPublishModalOpen(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <div className="survey-template-modal-body">
              <p className="survey-template-publish-instructions">Select surveys to publish to employees:</p>
              {surveys.map((survey) => (
                <div key={survey.formId} className="survey-template-publish-item">
                  <div className="survey-template-publish-info">
                    <span className="survey-template-publish-title">{survey.formType}</span>
                    <span className="survey-template-publish-description">{survey.description}</span>
                  </div>
                  <button
                    className={`survey-template-publish-toggle ${selectedSurveys.has(survey.formId) ? "active" : ""}`}
                    onClick={() => handleToggleSurvey(survey.formId)}
                  >
                    {selectedSurveys.has(survey.formId) ? "Added" : "Add"}
                  </button>
                </div>
              ))}
            </div>
            
            <div className="survey-template-modal-footer">
              <button 
                className="survey-template-button secondary"
                onClick={() => setIsPublishModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="survey-template-button" 
                onClick={handlePublishSurveys} 
                disabled={selectedSurveys.size === 0}
              >
                Publish Selected
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurveyTemplate;