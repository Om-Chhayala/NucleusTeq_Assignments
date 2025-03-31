import React, { useState } from "react";
import axios from "axios";
import "./SurveyModal.css"; // Changed the CSS filename to match component name

const SurveyCreationModal = ({ isOpen, onClose, onSurveyCreated }) => {
  const [formType, setFormType] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([""]);
  const [error, setError] = useState("");

  const handleAddQuestion = () => {
    setQuestions([...questions, ""]);
  };

  const handleRemoveQuestion = (index) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const handleChangeQuestion = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = value;
    setQuestions(updatedQuestions);
  };

  const handleReset = () => {
    setFormType("");
    setDescription("");
    setQuestions([""]);
    setError("");
  };

  const handleSubmit = async () => {
    if (!formType || !description || questions.some((q) => q.trim() === "")) {
      setError("All fields are required!");
      return;
    }

    const surveyData = { formType, description, questions };

    try {
      const response = await axios.post("http://localhost:8080/api/forms/create", surveyData, {
        headers: { "Content-Type": "application/json" },
      });

      // Call `onSurveyCreated` to update list without reload
      onSurveyCreated(response.data);

      // Show success message and close modal
      alert("Survey created successfully!");
      handleReset();
      onClose();
    } catch (error) {
      console.error("Error creating survey:", error);
      setError("Failed to create survey. Try again.");
    }
  };

  const handleCancel = () => {
    handleReset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="survey-modal-overlay">
      <div className="survey-modal-container">
        <h2 className="survey-modal-title">Create New Survey</h2>

        {error && <p className="survey-modal-error">{error}</p>}

        <div className="survey-modal-content">
          <div className="survey-form-group">
            <label className="survey-form-label">Form Type:</label>
            <input
              className="survey-form-input"
              type="text"
              value={formType}
              onChange={(e) => setFormType(e.target.value)}
              placeholder="Enter form type (e.g., Customer Feedback, Product Survey)"
            />
          </div>

          <div className="survey-form-group">
            <label className="survey-form-label">Description:</label>
            <textarea
              className="survey-form-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a brief description of this survey's purpose"
              rows="3"
            />
          </div>

          <div className="survey-form-group">
            <label className="survey-form-label">Questions:</label>
            <div className="survey-questions-container">
              {questions.map((q, index) => (
                <div className="survey-question-item" key={index}>
                  <input
                    className="survey-question-input"
                    type="text"
                    value={q}
                    onChange={(e) => handleChangeQuestion(index, e.target.value)}
                    placeholder={`Enter question ${index + 1}`}
                  />
                  {questions.length > 1 && (
                    <button 
                      className="survey-question-remove-btn" 
                      onClick={() => handleRemoveQuestion(index)}
                      aria-label="Remove question"
                    >
                      <span className="survey-question-remove-icon">✖</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            <button className="survey-add-question-btn" onClick={handleAddQuestion}>
              <span className="survey-add-icon">+</span> Add Question
            </button>
          </div>
        </div>

        <div className="survey-modal-actions">
          <button className="survey-submit-btn" onClick={handleSubmit}>
            Create Survey
          </button>
          <button className="survey-cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SurveyCreationModal;