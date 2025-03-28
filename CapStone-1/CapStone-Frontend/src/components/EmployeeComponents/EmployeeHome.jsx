import React from "react";
import "./EmployeeHome.css";
import { useNavigate } from "react-router-dom";

const articles = [
  {
    title: "Working Environment Survey",
    description:
      "Learn the various methods to use front-end technologies within React.",
    owner: "@prachi___",
    surveyDate: "03/01/2024",
  },
  {
    title: "Mental Health Survey",
    description:
      "A deep dive into React Hooks and how they improve state management.",
    owner: "@sajal",
    surveyDate: "10/02/2024",
  },
  {
    title: "Physical Health Survey",
    description:
      "Which one should you use? A comparison between CSS Grid and Flexbox.",
    owner: "@Sucksham",
    surveyDate: "25/02/2024",
  },
];

let filledSurvey = false;

const EmployeeHome = () => {
  
  const navigate = useNavigate();
  const handleFillSurvey = () => {
    navigate("/employee/fillsurvey");
  };

  return (
    <div className="card-container">
      {articles.map((article, index) => (
        <div className="card" key={index}>
          <div className="main-content">
            <div className="header">
              <span>Survey Date</span>
              <span>{article.surveyDate}</span>
            </div>
            <p className="heading">{article.title}</p>
            <p className="description">{article.description}</p>
          </div>
          <div className="footer">By {article.owner}</div>
          <button className="read-more" onClick={handleFillSurvey}>
            {!filledSurvey ? "Fill Survey" : "Edit Survey"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default EmployeeHome;
