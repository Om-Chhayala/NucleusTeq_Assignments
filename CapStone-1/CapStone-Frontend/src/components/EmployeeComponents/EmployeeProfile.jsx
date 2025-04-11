"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import "./EmployeeProfile.css"
import image from "../../assets/jk.jpeg"
import { showToast } from "../Toasters/toast-container"

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const EmployeeProfile = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    department: "",
    address: "",
  })
  const [isEditing, setIsEditing] = useState(false)
  const [showDeactivateModal, setShowDeactivateModal] = useState(false)
  const [showSignOutModal, setShowSignOutModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeSection, setActiveSection] = useState("history") // Default to history view

  // New states for form responses and chart
  const [formResponses, setFormResponses] = useState([])
  const [availableForms, setAvailableForms] = useState([])
  const [selectedFormId, setSelectedFormId] = useState(null)
  const [chartData, setChartData] = useState(null)

  const fetchUserProfile = async () => {
    setIsLoading(true)
    try {
      const userEmail = localStorage.getItem("userEmail")
      if (!userEmail) {
        navigate("/login")
        return
      }

      const response = await axios.get(`http://localhost:8080/api/users/profile?email=${userEmail}`)
      setFormData(response.data)
    } catch (error) {
      console.error("Error fetching user profile:", error)
      showToast("Failed to load profile", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUserResponses = async () => {
    try {
      const userId = formData.id
      if (!userId) return

      const response = await axios.get(`http://localhost:8080/api/employee-responses/by-id?id=${userId}`)
      setFormResponses(response.data)

      // Extract unique forms
      const uniqueForms = [...new Map(response.data.map((item) => [item.form.formId, item.form])).values()]
      setAvailableForms(uniqueForms)

      // Set default selected form if available
      if (uniqueForms.length > 0 && !selectedFormId) {
        setSelectedFormId(uniqueForms[0].formId)
      }
    } catch (error) {
      console.error("Error fetching user responses:", error)
      showToast("Failed to load response data", "error")
    }
  }

  useEffect(() => {
    fetchUserProfile()
  }, [])

  useEffect(() => {
    if (formData.id) {
      fetchUserResponses()
    }
  }, [formData.id])

  useEffect(() => {
    prepareChartData()
  }, [selectedFormId, formResponses])

  const prepareChartData = () => {
    if (!selectedFormId || formResponses.length === 0) return

    // Filter responses for the selected form
    const filteredResponses = formResponses.filter((response) => response.form.formId === selectedFormId)

    // Sort by date
    const sortedResponses = [...filteredResponses].sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt))

    // Prepare data for chart
    const labels = sortedResponses.map((response) => {
      const date = new Date(response.submittedAt)
      return date.toLocaleDateString()
    })

    const ratings = sortedResponses.map((response) => response.rating)

    setChartData({
      labels,
      datasets: [
        {
          label: "Rating",
          data: ratings,
          borderColor: "#3a7bd5",
          backgroundColor: "rgba(58, 123, 213, 0.2)",
          tension: 0.3,
          pointBackgroundColor: "#3a7bd5",
          pointBorderColor: "#fff",
          pointRadius: 5,
          pointHoverRadius: 7,
          fill: true,
        },
      ],
    })
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSaveChanges = async () => {
    try {
      await axios.put("http://localhost:8080/api/users/update", formData, {
        headers: { "Content-Type": "application/json" },
      })

      setIsEditing(false)
      showToast("Profile updated successfully", "success")
    } catch (error) {
      console.error("Error updating profile:", error)
      showToast("Failed to update profile", "error")
    }
  }

  const openSignOutModal = () => {
    setShowSignOutModal(true)
  }

  const handleSignOut = () => {
    localStorage.removeItem("userEmail")
    showToast("Signed out successfully", "info")
    setShowSignOutModal(false)
    navigate("/")
  }

  const handleDeactivate = async () => {
    try {
      await axios.put(`http://localhost:8080/api/users/deactivate/${formData.id}`)
      localStorage.removeItem("userEmail")
      showToast("Account deactivated successfully", "info")
      navigate("/")
    } catch (error) {
      console.error("Error deactivating account:", error)
      showToast("Failed to deactivate account", "error")
    }
  }

  const toggleEditMode = () => {
    setIsEditing(!isEditing)
  }

  const cancelEdit = () => {
    fetchUserProfile()
    setIsEditing(false)
  }

  const openDeactivateModal = () => {
    setShowDeactivateModal(true)
  }

  const handleFormChange = (formId) => {
    setSelectedFormId(Number.parseInt(formId))
  }

  const toggleSection = (section) => {
    setActiveSection(section)
  }

  // Get the selected form details
  const selectedForm = availableForms.find((form) => form.formId === selectedFormId) || {}

  if (isLoading) {
    return (
      <div className="emp-profile-loader">
        <div className="emp-loader-spinner"></div>
        <p>Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="emp-profile-page">
      <div className="emp-profile-card">
        <header className="emp-profile-header">
          {/* <h1>Employee Profile</h1> */}
          {/* <p>Manage your personal information and account settings</p> */}
        </header>

        <div className="emp-profile-body">
          <aside className="emp-profile-sidebar">
            <div className="emp-avatar-container">
              <img src={image || "/placeholder.svg"} alt={formData.name} className="emp-avatar-img" />
            </div>

            <div className="emp-user-summary">
              <h2 className="emp-user-name">{formData.name}</h2>
              <p className="emp-user-email">{formData.email}</p>
            </div>

            {/* Section Toggle Buttons */}
            <div className="emp-section-toggle">
              <button
                className={`emp-section-btn ${activeSection === "history" ? "active" : ""}`}
                onClick={() => toggleSection("history")}
              >
                <span className="emp-section-icon">📊</span>
                <span>Analysis</span>
              </button>
              <button
                className={`emp-section-btn ${activeSection === "profile" ? "active" : ""}`}
                onClick={() => toggleSection("profile")}
              >
                <span className="emp-section-icon">👤</span>
                <span>Personal</span>
              </button>
            </div>

            <div className="emp-action-buttons">
              <button className="emp-btn emp-btn-primary" onClick={toggleEditMode}>
                {isEditing ? "Cancel Edit" : "Edit Profile"}
              </button>
              <div className="emp-btn-group">
                <button className="emp-btn emp-btn-secondary" onClick={openSignOutModal}>
                  Sign Out
                </button>
                <button className="emp-btn emp-btn-danger" onClick={openDeactivateModal}>
                  Deactivate
                </button>
              </div>
            </div>
          </aside>

          <main className="emp-profile-main">
            {/* Rating Chart Section */}
            {activeSection === "history" && (
              <div className="emp-chart-section">
                <div className="emp-section-header">
                  <h3>Rating History</h3>
                  <p className="emp-edit-hint">Track your feedback ratings over time</p>
                </div>

                {availableForms.length > 0 ? (
                  <>
                    <div className="emp-form-selector-container">
                      <div className="emp-form-selector-header">
                        <span className="emp-form-selector-label">Select Form:</span>
                        <div className="emp-form-tabs">
                          {availableForms.map((form) => (
                            <button
                              key={form.formId}
                              className={`emp-form-tab ${selectedFormId === form.formId ? "active" : ""}`}
                              onClick={() => handleFormChange(form.formId)}
                            >
                              {form.formType}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="emp-selected-form-info">
                        <div className="emp-selected-form-description">
                          <span className="emp-info-label">Description:</span>
                          <span className="emp-info-data">
                            {selectedForm.description || "No description available"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="emp-chart-container">
                      {chartData && chartData.labels && chartData.labels.length > 0 ? (
                        <Line
                          data={chartData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                position: "top",
                                labels: {
                                  font: {
                                    family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                                    size: 12,
                                  },
                                  color: "#333",
                                },
                              },
                              title: {
                                display: true,
                                text: `Rating History: ${selectedForm.formType || "Selected Form"}`,
                                font: {
                                  family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                                  size: 16,
                                  weight: "bold",
                                },
                                color: "#333",
                                padding: {
                                  top: 10,
                                  bottom: 20,
                                },
                              },
                              tooltip: {
                                backgroundColor: "rgba(58, 123, 213, 0.8)",
                                titleFont: {
                                  family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                                  size: 14,
                                },
                                bodyFont: {
                                  family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                                  size: 13,
                                },
                                padding: 12,
                                cornerRadius: 6,
                                callbacks: {
                                  label: (context) => `Rating: ${context.parsed.y}`,
                                },
                              },
                            },
                            scales: {
                              y: {
                                beginAtZero: true,
                                max: 10,
                                grid: {
                                  color: "rgba(0, 0, 0, 0.05)",
                                },
                                ticks: {
                                  color: "#666",
                                  font: {
                                    family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                                  },
                                },
                                title: {
                                  display: true,
                                  text: "Rating (0-10)",
                                  color: "#666",
                                  font: {
                                    family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                                    size: 12,
                                  },
                                },
                              },
                              x: {
                                grid: {
                                  color: "rgba(0, 0, 0, 0.05)",
                                },
                                ticks: {
                                  color: "#666",
                                  font: {
                                    family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                                  },
                                  maxRotation: 45,
                                  minRotation: 45,
                                },
                                title: {
                                  display: true,
                                  text: "Submission Date",
                                  color: "#666",
                                  font: {
                                    family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                                    size: 12,
                                  },
                                },
                              },
                            },
                          }}
                        />
                      ) : (
                        <div className="emp-no-chart-data">
                          <div className="emp-no-data-icon">📊</div>
                          <p>No rating data available for this form</p>
                          <span>Submit a response to see your ratings here</span>
                        </div>
                      )}
                    </div>

                    <div className="emp-chart-stats">
                      <div className="emp-stat-card">
                        <div className="emp-stat-value">
                          {chartData && chartData.datasets && chartData.datasets[0].data.length > 0
                            ? Math.max(...chartData.datasets[0].data)
                            : "-"}
                        </div>
                        <div className="emp-stat-label">Highest Rating</div>
                      </div>
                      <div className="emp-stat-card">
                        <div className="emp-stat-value">
                          {chartData && chartData.datasets && chartData.datasets[0].data.length > 0
                            ? (
                                chartData.datasets[0].data.reduce((a, b) => a + b, 0) /
                                chartData.datasets[0].data.length
                              ).toFixed(1)
                            : "-"}
                        </div>
                        <div className="emp-stat-label">Average Rating</div>
                      </div>
                      <div className="emp-stat-card">
                        <div className="emp-stat-value">
                          {chartData && chartData.labels ? chartData.labels.length : 0}
                        </div>
                        <div className="emp-stat-label">Total Responses</div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="emp-no-data-container">
                    <div className="emp-no-data-icon">📋</div>
                    <h3>No Forms Available</h3>
                    <p>You haven't submitted any form responses yet.</p>
                  </div>
                )}
              </div>
            )}

            {/* Profile Information Section */}
            {activeSection === "profile" && (
              <div className="emp-profile-info-section">
                <div className="emp-section-header">
                  <h3>{isEditing ? "Edit Your Information" : "Personal Information"}</h3>
                  {isEditing && (
                    <p className="emp-edit-hint">Make changes to your profile and click Save Changes when done.</p>
                  )}
                </div>

                <form className="emp-profile-form">
                  <div className="emp-form-row">
                    <div className="emp-form-group">
                      <label htmlFor="name" className="emp-form-label">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name || ""}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="emp-form-input"
                        required
                      />
                    </div>

                    <div className="emp-form-group">
                      <label htmlFor="email" className="emp-form-label">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email || ""}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="emp-form-input"
                        required
                      />
                    </div>
                  </div>

                  <div className="emp-form-row">
                    <div className="emp-form-group">
                      <label htmlFor="contact" className="emp-form-label">
                        Contact Number
                      </label>
                      <input
                        type="text"
                        id="contact"
                        name="contact"
                        value={formData.contact || ""}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="emp-form-input"
                      />
                    </div>

                    <div className="emp-form-group">
                      <label htmlFor="department" className="emp-form-label">
                        Department
                      </label>
                      <input
                        type="text"
                        id="department"
                        name="department"
                        value={formData.department || ""}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="emp-form-input"
                      />
                    </div>
                  </div>

                  <div className="emp-form-group emp-form-full-width">
                    <label htmlFor="address" className="emp-form-label">
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="emp-form-input"
                    />
                  </div>

                  {isEditing && (
                    <div className="emp-form-actions">
                      <button type="button" className="emp-btn emp-btn-secondary" onClick={cancelEdit}>
                        Cancel
                      </button>
                      <button type="button" className="emp-btn emp-btn-primary" onClick={handleSaveChanges}>
                        Save Changes
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Sign Out Confirmation Modal */}
      {showSignOutModal && (
        <div className="emp-modal-overlay" onClick={() => setShowSignOutModal(false)}>
          <div className="emp-modal-container" onClick={(e) => e.stopPropagation()}>
            <h3 className="emp-modal-title emp-title-warning">Sign Out</h3>
            <p className="emp-modal-text">Are you sure you want to sign out?</p>
            <div className="emp-modal-actions">
              <button
                className="emp-btn emp-btn-secondary"
                onClick={() => {
                  setShowSignOutModal(false)
                }}
              >
                Cancel
              </button>
              <button className="emp-btn emp-btn-warning" onClick={handleSignOut}>
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deactivate Account Modal */}
      {showDeactivateModal && (
        <div className="emp-modal-overlay" onClick={() => setShowDeactivateModal(false)}>
          <div className="emp-modal-container" onClick={(e) => e.stopPropagation()}>
            <h3 className="emp-modal-title">Deactivate Account</h3>
            <p className="emp-modal-text">
              Are you sure you want to deactivate your account? This action cannot be undone.
            </p>
            <div className="emp-modal-actions">
              <button
                className="emp-btn emp-btn-secondary"
                onClick={() => {
                  setShowDeactivateModal(false)
                  showToast("Deactivation cancelled", "info")
                }}
              >
                Cancel
              </button>
              <button className="emp-btn emp-btn-danger" onClick={handleDeactivate}>
                Yes, Deactivate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EmployeeProfile
