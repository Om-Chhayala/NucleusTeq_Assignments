import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./formSubmission.css";

const FormSubmission = () => {
  const { surveyId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);

  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userResponse = await axios.get(
          `http://localhost:8080/api/users/profile?email=${userEmail}`
        );
        console.log(userResponse.data);
        
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

  const handleSubmit = async () => {
    try {
      console.log(userId);
      console.log(surveyId);
      console.log(responses);
      
      
      
      await axios.post("http://localhost:8080/api/employee-responses/create", {
        userId,
        formId: surveyId,
        responses: Object.values(responses),
      });
      alert("Survey submitted successfully!");
      navigate("/employee/home");
    } catch (error) {
      console.error("Error submitting survey:", error);
      alert("Failed to submit survey. Please try again.");
    }
  };

  return (
    <div className="survey-page">
      <button className="home-button" onClick={() => navigate("/hr/home")}>
        Home
      </button>
      <div className="survey-container">
        <h2>Survey Questions</h2>
        {loading ? (
          <p>Loading questions...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : questions.length === 0 ? (
          <p>No questions available for this survey.</p>
        ) : (
          <div className="question-list">
            {questions.map((q) => (
              <div key={q.id} className="question-card">
                <div className="input-container">
                  <input
                    type="text"
                    className="question-input"
                    id={`question-${q.id}`}
                    value={responses[q.id]}
                    onChange={(e) => handleChange(q.id, e.target.value)}
                    required
                  />
                  <label htmlFor={`question-${q.id}`} className="label">
                    {q.id}) {q.questionText}
                  </label>
                  <span className="underline"></span>
                </div>
              </div>
            ))}
          </div>
        )}
        <button
          className="submit-button"
          onClick={handleSubmit}
          disabled={loading || questions.length === 0}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default FormSubmission;
