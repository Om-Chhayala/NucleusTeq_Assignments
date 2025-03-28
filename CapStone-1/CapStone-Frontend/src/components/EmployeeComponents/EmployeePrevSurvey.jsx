import "./EmployeePrevSurvey.css"

const EmployeePrevSurvey = () => {

  
const articles = [
  {
    title: "Working Environment Survey",
    description: "Learn the various methods to use front-end technologies within React.",
    owner: "@prachi___",
    surveyDate: "03/01/2024",
  },
  {
    title: "Mental Health Survey",
    description: "A deep dive into React Hooks and how they improve state management.",
    owner: "@sajal",
    surveyDate: "10/02/2024",
  },
  
];



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
          <button className="read-more">View</button>
          
        </div>
      ))}
    </div>
  )
}

export default EmployeePrevSurvey