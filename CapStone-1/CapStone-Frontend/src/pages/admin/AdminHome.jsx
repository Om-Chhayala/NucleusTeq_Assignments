import React, { useState } from "react";
import "./AdminHomeStyle.css";
import SurveyTemplate from "../../components/AdminComponents/SurveyTemplate";
import HandleEmployess from "../../components/AdminComponents/HandleEmployess";
import SurveyResponses from "../../components/AdminComponents/SurveyResponses";

const AdminHome = () => {
  const [selectedTab, setSelectedTab] = useState("Create");

  return (
    <>
      <div className="hr-home-header">
        <div className="admin-container">
          <div className="admin-tabs">
            <input
              type="radio"
              id="admin-radio-1"
              name="tabs"
              defaultChecked={selectedTab === "Create"}
              onChange={() => setSelectedTab("Create")}
            />
            <label
              className={`admin-tab ${selectedTab === "Create" ? "active" : ""}`}
              htmlFor="admin-radio-1"
            >
              Create
            </label>

            <input
              type="radio"
              id="admin-radio-2"
              name="tabs"
              onChange={() => setSelectedTab("Employees")}
            />
            <label
              className={`admin-tab ${selectedTab === "Employees" ? "active" : ""}`}
              htmlFor="admin-radio-2"
            >
              Employees
            </label>

            <input
              type="radio"
              id="admin-radio-3"
              name="tabs"
              onChange={() => setSelectedTab("Responses")}
            />
            <label
              className={`admin-tab ${selectedTab === "Responses" ? "active" : ""}`}
              htmlFor="admin-radio-3"
            >
              Responses
            </label>
          </div>
        </div>
      </div>

      <div className="admin-content-container">
        {selectedTab === "Create" && <SurveyTemplate />}
        {selectedTab === "Employees" && <HandleEmployess />}
        {selectedTab === "Responses" && <SurveyResponses />}
      </div>
    </>
  );
};

export default AdminHome;
