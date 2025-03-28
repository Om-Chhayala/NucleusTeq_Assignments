import React, { useState } from "react";
import "./Home-Style.css";
import EmployeeHome from "../../components/EmployeeComponents/EmployeeHome";
import EmployeePrevSurvey from "../../components/EmployeeComponents/EmployeePrevSurvey";
import EmployeeProfile from "../../components/EmployeeComponents/EmployeeProfile";


const Home = () => {
  const [selectedTab, setSelectedTab] = useState("home");

  return (
    <>
      <div className="employee-home-header">
        <div className="container">
          <div className="tabs">
            <input
              type="radio"
              id="radio-1"
              name="tabs"
              defaultChecked={selectedTab === "home"}
              onChange={() => setSelectedTab("home")}
            />
            <label className="tab" htmlFor="radio-1">Home</label>

            <input
              type="radio"
              id="radio-2"
              name="tabs"
              onChange={() => setSelectedTab("surveys")}
            />
            <label className="tab" htmlFor="radio-2">Surveys</label>

            <input
              type="radio"
              id="radio-3"
              name="tabs"
              onChange={() => setSelectedTab("profile")}
            />
            <label className="tab" htmlFor="radio-3">Profile</label>

            <span className="glider"></span>
          </div>
        </div>
      </div>

      <div className="employee-home-survey-profile-container">
        {selectedTab === "home" && <EmployeeHome />}
        {selectedTab === "surveys" && <EmployeePrevSurvey />}
        {selectedTab === "profile" && <EmployeeProfile />}
      </div>
    </>
  );
};

export default Home;
