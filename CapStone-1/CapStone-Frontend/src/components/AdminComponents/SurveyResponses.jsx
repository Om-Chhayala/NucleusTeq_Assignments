import React, { useEffect, useState } from "react";
import axios from "axios";
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import "./SurveyResponses.css";

// PDF Document Styles
const pdfStyles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica'
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    textAlign: 'center',
    color: '#2c3e50',
    fontWeight: 'bold'
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: 'center',
    color: '#7f8c8d'
  },
  header: {
    fontSize: 14,
    marginBottom: 10,
    color: '#3498db',
    fontWeight: 'bold'
  },
  surveyItem: {
    marginBottom: 20,
    padding: 15,
    border: '1px solid #eee',
    borderRadius: 5,
    backgroundColor: '#f9f9f9'
  },
  surveyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#2c3e50'
  },
  surveyInfo: {
    fontSize: 12,
    marginBottom: 3,
    color: '#34495e'
  },
  question: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#2c3e50'
  },
  answer: {
    fontSize: 12,
    marginLeft: 10,
    color: '#7f8c8d',
    marginBottom: 8
  },
  divider: {
    borderBottom: '1px solid #eee',
    marginVertical: 10
  },
  footer: {
    position: 'absolute',
    fontSize: 10,
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#95a5a6'
  }
});

// PDF Document Component
const SurveyPDFDocument = ({ surveys, filters }) => (
  <Document>
    <Page style={pdfStyles.page}>
      <Text style={pdfStyles.title}>Survey Responses Report</Text>
      <Text style={pdfStyles.subtitle}>
        Generated on: {new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </Text>
      
      {filters && (
        <View style={{ marginBottom: 15 }}>
          <Text style={pdfStyles.header}>Filters Applied:</Text>
          <Text style={pdfStyles.surveyInfo}>
            Department: {filters.department || 'All'}
          </Text>
          <Text style={pdfStyles.surveyInfo}>
            Address: {filters.address || 'All'}
          </Text>
          <Text style={pdfStyles.surveyInfo}>
            Date Range: {filters.startTime ? new Date(filters.startTime).toLocaleDateString() : 'Any'} - 
            {filters.endTime ? new Date(filters.endTime).toLocaleDateString() : 'Any'}
          </Text>
        </View>
      )}
      
      <Text style={pdfStyles.header}>Survey Responses ({surveys.length}):</Text>
      
      {surveys.map((survey, index) => (
        <View key={index} style={pdfStyles.surveyItem} break={index !== 0}>
          <Text style={pdfStyles.surveyTitle}>{survey.form.formType}</Text>
          <Text style={pdfStyles.surveyInfo}>Submitted by: {survey.user.name}</Text>
          <Text style={pdfStyles.surveyInfo}>Department: {survey.user.department}</Text>
          <Text style={pdfStyles.surveyInfo}>Address: {survey.user.address}</Text>
          <Text style={pdfStyles.surveyInfo}>
            Date: {new Date(survey.submittedAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
          
          <Text style={pdfStyles.header}>Questions & Responses:</Text>
          {survey.form.questions.map((question, qIndex) => (
            <View key={qIndex}>
              <Text style={pdfStyles.question}>Q{qIndex + 1}: {question}</Text>
              <Text style={pdfStyles.answer}>A: {survey.responses[qIndex] || 'No response'}</Text>
              {qIndex < survey.form.questions.length - 1 && (
                <View style={pdfStyles.divider} />
              )}
            </View>
          ))}
        </View>
      ))}
      
      <Text style={pdfStyles.footer} fixed>
        Confidential Survey Data - © {new Date().getFullYear()} Your Organization
      </Text>
    </Page>
  </Document>
);

const SurveyResponses = () => {
  const [surveys, setSurveys] = useState([]);
  const [filteredSurveys, setFilteredSurveys] = useState([]);
  const [department, setDepartment] = useState("");
  const [address, setAddress] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentFilters, setCurrentFilters] = useState({});

  useEffect(() => {
    const fetchSurveys = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("http://localhost:8080/api/employee-responses/all");
        setSurveys(response.data);
        setFilteredSurveys(response.data);
      } catch (error) {
        console.error("Error fetching responses:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSurveys();
  }, []);

  const handleFilter = async () => {
    setIsLoading(true);
    const filters = { department, address, startTime, endTime };
    setCurrentFilters(filters);
    
    try {
      let filteredData = [...surveys];
      
      if (department) {
        const response = await axios.get(`http://localhost:8080/api/employee-responses/by-department`, {
          params: { department },
        });
        filteredData = response.data;
      }
      
      if (address) {
        const response = await axios.get(`http://localhost:8080/api/employee-responses/by-address`, {
          params: { address },
        });
        filteredData = filteredData.filter(survey => 
          response.data.some(r => r.id === survey.id)
        );
      }
      
      if (startTime && endTime) {
        const response = await axios.get("http://localhost:8080/api/employee-responses/by-time-range", {
          params: { startTime, endTime },
        });
        filteredData = filteredData.filter(survey => 
          response.data.some(r => r.id === survey.id)
        );
      }
      
      setFilteredSurveys(filteredData);
    } catch (error) {
      console.error("Error filtering responses:", error.response?.data || error.message);
      setFilteredSurveys([]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetFilters = () => {
    setDepartment("");
    setAddress("");
    setStartTime("");
    setEndTime("");
    setCurrentFilters({});
    setFilteredSurveys(surveys);
  };

  const PDFDownloadButton = () => (
    <PDFDownloadLink 
      document={<SurveyPDFDocument surveys={filteredSurveys} filters={currentFilters} />} 
      fileName={`survey_responses_${new Date().toISOString().slice(0,10)}.pdf`}
      style={{ textDecoration: 'none' }}
    >
      {({ loading }) => (
        <button 
          className={`survey-responses-button ${loading ? 'pdf-loading' : 'pdf-button'}`}
          disabled={loading || filteredSurveys.length === 0}
        >
          {loading ? (
            <span className="pdf-button-content">
              <span className="pdf-spinner"></span>
              Generating PDF...
            </span>
          ) : (
            <span className="pdf-button-content">
              <svg className="pdf-icon" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                <polyline points="14 2 14 8 20 8" />
                <path d="M8 13h8" />
                <path d="M8 17h8" />
                <path d="M10 9H8v2h2V9z" />
              </svg>
              Export to PDF
            </span>
          )}
        </button>
      )}
    </PDFDownloadLink>
  );

  return (
    <div className="survey-responses-container">
      <div className="survey-responses-header">
        <h1>Survey Responses</h1>
        <p>View and filter employee survey responses</p>
      </div>
      
      <div className="survey-responses-filter-container">
        <div className="survey-responses-filter-group">
          <label htmlFor="department">Department</label>
          <input
            id="department"
            type="text"
            placeholder="Filter by Department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="survey-responses-filter-input"
          />
        </div>
        
        <div className="survey-responses-filter-group">
          <label htmlFor="address">Address</label>
          <input
            id="address"
            type="text"
            placeholder="Filter by Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="survey-responses-filter-input"
          />
        </div>
        
        <div className="survey-responses-filter-group">
          <label htmlFor="startTime">Start Date</label>
          <input
            id="startTime"
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="survey-responses-filter-input"
          />
        </div>
        
        <div className="survey-responses-filter-group">
          <label htmlFor="endTime">End Date</label>
          <input
            id="endTime"
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="survey-responses-filter-input"
          />
        </div>
        
        <div className="survey-responses-filter-actions">
          <button onClick={handleFilter} className="survey-responses-button">
            Apply Filters
          </button>
          <button onClick={resetFilters} className="survey-responses-button secondary">
            Reset
          </button>
          <PDFDownloadButton />
        </div>
      </div>
      
      <div className="survey-responses-list-container">
        {isLoading ? (
          <div className="survey-responses-loading">
            <div className="survey-responses-spinner"></div>
            <p>Loading surveys...</p>
          </div>
        ) : filteredSurveys.length === 0 ? (
          <div className="survey-responses-no-results">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <p>No responses found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="survey-responses-list">
            {filteredSurveys.map((survey, index) => (
              <div className="survey-responses-card" key={index} onClick={() => setSelectedSurvey(survey)}>
                <div className="survey-responses-card-header">
                  <span className="survey-responses-date">
                    {new Date(survey.submittedAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                  <span className="survey-responses-badge">{survey.form.formType}</span>
                </div>
                <h3 className="survey-responses-title">{survey.form.formType}</h3>
                <p className="survey-responses-description">{survey.form.description}</p>
                <div className="survey-responses-card-footer">
                  <div className="survey-responses-user">
                    <div className="survey-responses-user-avatar">
                      {survey.user.name.charAt(0)}
                    </div>
                    <span>{survey.user.name}</span>
                    <span className="survey-responses-user-address">{survey.user.address}</span>
                  </div>
                  <button className="survey-responses-button">View</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {selectedSurvey && (
        <div className="survey-responses-modal-overlay" onClick={() => setSelectedSurvey(null)}>
          <div className="survey-responses-modal" onClick={(e) => e.stopPropagation()}>
            <div className="survey-responses-modal-header">
              <h2>{selectedSurvey.form.formType}</h2>
            </div>
            
            <div className="survey-responses-modal-info">
              <div className="survey-responses-info-item">
                <span className="survey-responses-info-label">Submitted by:</span>
                <span className="survey-responses-info-value">{selectedSurvey.user.name}</span>
              </div>
              <div className="survey-responses-info-item">
                <span className="survey-responses-info-label">Department:</span>
                <span className="survey-responses-info-value">{selectedSurvey.user.department}</span>
              </div>
              <div className="survey-responses-info-item">
                <span className="survey-responses-info-label">Address:</span>
                <span className="survey-responses-info-value">{selectedSurvey.user.address}</span>
              </div>
              <div className="survey-responses-info-item">
                <span className="survey-responses-info-label">Date:</span>
                <span className="survey-responses-info-value">
                  {new Date(selectedSurvey.submittedAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <div className="survey-responses-info-item">
                <span className="survey-responses-info-label">Description:</span>
                <span className="survey-responses-info-value">{selectedSurvey.form.description}</span>
              </div>
            </div>
            
            <div className="survey-responses-modal-body">
              <h3>Responses</h3>
              {selectedSurvey.form.questions.map((question, index) => (
                <div key={index} className="survey-responses-survey-item">
                  <div className="survey-responses-question">
                    <span className="survey-responses-question-number">Q{index + 1}</span>
                    <p>{question}</p>
                  </div>
                  <div className="survey-responses-answer">
                    <span className="survey-responses-answer-label">Response:</span>
                    <p>{selectedSurvey.responses[index]}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="survey-responses-modal-footer">
              <button className="survey-responses-button" onClick={() => setSelectedSurvey(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurveyResponses;