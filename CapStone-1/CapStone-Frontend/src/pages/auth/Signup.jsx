import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import axios from "axios"
import "./style.css"

const Signup = () => {
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const who = params.get("who") || "User"
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    contact: "",
    address: "",
  })

  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError(null) // Clear error when user types
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await axios.post("http://localhost:8080/api/users/register", formData, {
        headers: { "Content-Type": "application/json" },
      })

      // Store user details in localStorage
      localStorage.setItem("userEmail", formData.email)

      console.log(`${who} registered successfully`, response.data)
      navigate(`/${who.toLowerCase()}/home`)
    } catch (error) {
      setError(error.response?.data || "Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Field labels with proper formatting
  const fieldLabels = {
    name: "Full Name",
    email: "Email Address",
    password: "Password",
    department: "Department",
    contact: "Contact Number",
    address: "Address",
  }

  return (
    <div className="auth-container">
      <div className="auth-card signup-card">
        <div className="auth-header">
          <h2 className="auth-title">{who} Registration</h2>
          <div className="auth-subtitle">Create your account to get started</div>
        </div>

        <form className="auth-form" onSubmit={handleSignup}>
          {error && <div className="auth-error">{error}</div>}

          <div className="form-grid">
            {Object.keys(formData).map((field) => (
              <div className="form-group" key={field}>
                <label htmlFor={field}>{fieldLabels[field] || field}</label>
                <input
                  type={field === "password" ? "password" : field === "email" ? "email" : "text"}
                  id={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  placeholder={`Enter your ${fieldLabels[field].toLowerCase()}`}
                  required
                />
              </div>
            ))}
          </div>

          <button type="submit" className={`auth-button ${isLoading ? "loading" : ""}`} disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <a href={`/login?who=${who}`} className="auth-link">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup

