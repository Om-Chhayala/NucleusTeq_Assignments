import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./FormSubmission.css";

const FormSubmission = () => {
  const { surveyId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [success, setSuccess] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userResponse = await axios.get(
          `http://localhost:8080/api/users/profile?email=${userEmail}`
        );
        setUserId(userResponse.data.id);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    const fetchSurvey = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/forms/${surveyId}`
        );
        const fetchedQuestions = response.data.questions.map((q, index) => ({
          id: index + 1,
          questionText: q,
        }));

        setQuestions(fetchedQuestions);
        setResponses(
          fetchedQuestions.reduce((acc, q) => ({ ...acc, [q.id]: "" }), {})
        );
      } catch (error) {
        console.error("Error fetching survey questions:", error);
        setError("Failed to load survey questions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    fetchSurvey();
  }, [surveyId, userEmail]);

  const handleChange = (questionId, value) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
  };

  const showToastNotification = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await axios.post("http://localhost:8080/api/employee-responses/create", {
        userId,
        formId: surveyId,
        responses: Object.values(responses),
      });
      setSuccess(true);
      showToastNotification("Survey submitted successfully!");
      setTimeout(() => {
        navigate("/employee/home");
      }, 2000);
    } catch (error) {
      console.error("Error submitting survey:", error);
      setError("Failed to submit survey. Please try again.");
      setSubmitting(false);
    }
  };

  const openPreviewModal = () => {
    setShowPreviewModal(true);
  };

  const closePreviewModal = () => {
    setShowPreviewModal(false);
  };

  const nextQuestion = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevQuestion = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isCurrentQuestionAnswered = () => {
    const currentQuestion = questions[currentStep];
    return currentQuestion && responses[currentQuestion.id]?.trim() !== "";
  };

  const areAllQuestionsAnswered = () => {
    return questions.every(question => responses[question.id]?.trim() !== "");
  };

  const isLastQuestion = currentStep === questions.length - 1;
  const progressPercentage = questions.length > 0 
    ? ((currentStep + 1) / questions.length) * 100 
    : 0;

  if (loading) {
    return (
      <div className="loading-container">
        <div className="card">
          <div className="card-content">
            <div className="loading-indicator">
              <div className="spinner"></div>
              <p>Loading survey questions...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="success-container">
        <div className="card">
          <div className="card-content">
            <div className="success-message">
              <div className="success-icon">✓</div>
              <h2>Survey Submitted!</h2>
              <p>Thank you for completing the survey. You will be redirected shortly.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !questions.length) {
    return (
      <div className="error-container">
        <div className="card">
          <div className="card-content">
            <div className="error-message">
              <p>{error}</p>
              <button className="button primary-button" onClick={() => navigate("/employee/home")}>
                Return Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="survey-page">
      {showToast && (
        <div className="toast-notification">
          <div className="toast-content">
            <div className="toast-icon">✓</div>
            <p>{toastMessage}</p>
          </div>
        </div>
      )}
      
      <button 
        className="home-button" 
        onClick={() => navigate("/employee/home")}
      >
        ← Home
      </button>
      
      <div className="survey-container">
        <div className="card-header">
          <h2>Survey Questions</h2>
          <p className="question-counter">
            Question {currentStep + 1} of {questions.length}
          </p>
          <div className="progress-container">
            <div 
              className="progress-bar" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
        
        <div className="card-content">
          {questions.length === 0 ? (
            <p className="no-questions">No questions available for this survey.</p>
          ) : (
            <div className="question-section">
              <div className="question-card fade-in">
                <div className="question-text">
                  {questions[currentStep]?.questionText}
                </div>
                <div className="textarea-container">
                  <textarea
                    className="response-textarea"
                    value={responses[questions[currentStep]?.id] || ""}
                    onChange={(e) => handleChange(questions[currentStep]?.id, e.target.value)}
                    placeholder="Type your answer here..."
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="card-footer">
          <button 
            className="button secondary-button" 
            onClick={prevQuestion} 
            disabled={currentStep === 0}
          >
            Previous
          </button>
          
          <div className="right-buttons">
            {!isLastQuestion ? (
              <button 
                className="button primary-button" 
                onClick={nextQuestion} 
                disabled={!isCurrentQuestionAnswered()}
              >
                Next
              </button>
            ) : (
              <button 
                className="button submit-button" 
                onClick={openPreviewModal} 
                disabled={!isCurrentQuestionAnswered() || submitting}
              >
                {submitting ? "Submitting..." : "Review & Submit"}
              </button>
            )}
          </div>
        </div>
      </div>

      {showPreviewModal && (
        <div className="modal-overlay">
          <div className="preview-modal">
            <div className="modal-header">
              <h3>Review Your Responses</h3>
              <button className="close-button" onClick={closePreviewModal}>×</button>
            </div>
            <div className="modal-content">
              {questions.map((question, index) => (
                <div key={question.id} className="preview-item">
                  <div className="preview-question">
                    <span className="question-number">Q{index + 1}:</span> {question.questionText}
                  </div>
                  <div className="preview-answer">{responses[question.id]}</div>
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <p className="confirmation-text">Are you sure you want to submit this survey?</p>
              <div className="modal-buttons">
                <button className="button secondary-button" onClick={closePreviewModal}>
                  Edit Responses
                </button>
                <button 
                  className="button submit-button" 
                  onClick={handleSubmit}
                  disabled={submitting || !areAllQuestionsAnswered()}
                >
                  {submitting ? "Submitting..." : "Submit Survey"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormSubmission;