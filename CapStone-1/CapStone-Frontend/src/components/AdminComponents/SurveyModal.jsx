import React, { useState } from "react";
import axios from "axios";
import "./SurveyModal.css";

const SurveyModal = ({ isOpen, onClose, onSurveyCreated }) => {
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

      // ✅ Call `onSurveyCreated` to update list without reload
      onSurveyCreated(response.data);

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
    <div className="modal-overlay">
      <div className="modal">
        <h2>Create New Survey</h2>

        {error && <p className="error">{error}</p>}

        <div className="modal-content">
          <label>Form Type:</label>
          <input
            type="text"
            value={formType}
            onChange={(e) => setFormType(e.target.value)}
            placeholder="Enter form type"
          />

          <label>Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
          />

          <label>Questions:</label>
          {questions.map((q, index) => (
            <div className="question-row" key={index}>
              <input
                type="text"
                value={q}
                onChange={(e) => handleChangeQuestion(index, e.target.value)}
                placeholder={`Enter question ${index + 1}`}
              />
              {questions.length > 1 && (
                <button className="remove-question" onClick={() => handleRemoveQuestion(index)}>
                  ✖
                </button>
              )}
            </div>
          ))}

          <button className="add-question" onClick={handleAddQuestion}>
            + Add Question
          </button>
        </div>

        <div className="modal-buttons">
          <button className="save-button" onClick={handleSubmit}>
            Create Survey
          </button>
          <button className="cancel-button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SurveyModal;
