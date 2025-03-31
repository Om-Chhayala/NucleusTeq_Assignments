import React, { useEffect, useState } from "react";
import axios from "axios";
import "./HandleEmployees.css";

const HandleEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch all employees from the backend
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/users/all");
        setEmployees(Array.isArray(response.data) ? response.data : response.data.employees || []);
      } catch (err) {
        setError("Failed to load employees. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  // Open Edit Modal & Load Employee Data
  const handleEditEmployee = (employee) => {
    setSelectedEmployee({ ...employee });
    setShowModal(true);
    document.body.classList.add("modal-open"); // Prevent background scroll
  };

  // Open Add Employee Modal
  const handleAddEmployee = () => {
    setSelectedEmployee({
      id: "",
      name: "",
      email: "",
      password: "",
      department: "",
      contact: "",
      address: "",
    });
    setShowModal(true);
    document.body.classList.add("modal-open"); // Prevent background scroll
  };

  // Close Modal
  const handleCloseModal = () => {
    setShowModal(false);
    document.body.classList.remove("modal-open"); // Allow scrolling again
  };

  // Handle Input Change
  const handleChange = (e) => {
    setSelectedEmployee({ ...selectedEmployee, [e.target.name]: e.target.value });
  };

  // Save Employee (Add or Update)
  const handleSaveEmployee = async () => {
    try {
      if (selectedEmployee.id) {
        // Update existing employee
        await axios.put("http://localhost:8080/api/users/update", selectedEmployee, {
          headers: { "Content-Type": "application/json" },
        });
        setEmployees(employees.map(emp => (emp.id === selectedEmployee.id ? selectedEmployee : emp)));
      } else {
        // Add new employee
        const response = await axios.post("http://localhost:8080/api/users/register", selectedEmployee, {
          headers: { "Content-Type": "application/json" },
        });
  
        console.log("New Employee Response:", response.data); // Debugging
  
        // Ensure response contains the new employee
        const newEmployee = response.data?.id ? response.data : { ...selectedEmployee, id: response.data.id || Date.now() };
        setEmployees([...employees, newEmployee]);
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error saving employee:", error);
    }
  };
  
  // Format date for display
  const formatDate = () => {
    const date = new Date();
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Get initials from name
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="employee-container">
      <button className="add-employee-button" onClick={handleAddEmployee}>
        <span>+</span> Add Employee
      </button>

      {loading ? (
        <div className="employee-loading">
          <div className="employee-spinner"></div>
          <p>Loading employees...</p>
        </div>
      ) : error ? (
        <div className="employee-error">{error}</div>
      ) : employees.length === 0 ? (
        <div className="employee-empty-state">
          <p>No employees found. Add your first employee to get started.</p>
        </div>
      ) : (
        <div className="employee-card-grid">
          {employees.map((employee) => (
            <div className="employee-card" key={employee.id}>
              <div className="employee-card-header">
                <div className="employee-department-badge">
                  {employee.department || "Unassigned"}
                </div>
                <div className="employee-date">{formatDate()}</div>
              </div>
              
              <h3 className="employee-name">{employee.name}</h3>
              
              <div className="employee-details">
                <div className="employee-detail-item">
                  <span className="employee-detail-label">Email:</span>
                  <span>{employee.email}</span>
                </div>
                <div className="employee-detail-item">
                  <span className="employee-detail-label">Contact:</span>
                  <span>{employee.contact || "N/A"}</span>
                </div>
                <div className="employee-detail-item">
                  <span className="employee-detail-label">Address:</span>
                  <span>{employee.address || "N/A"}</span>
                </div>
              </div>
              
              <div className="employee-card-footer">
                {/* <div className="employee-user">
                  <div className="employee-user-avatar">
                    {getInitials(employee.name)}
                  </div>
                </div> */}
                <button 
                  className="employee-edit-button" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditEmployee(employee);
                  }}
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="employee-modal-overlay">
          <div className="employee-modal">
            <div className="employee-modal-header">
              <h2>{selectedEmployee.id ? "Edit Employee" : "Add Employee"}</h2>
            </div>
            
            <div className="employee-modal-content">
              <div className="employee-form-group">
                <label className="employee-form-label">Name</label>
                <input 
                  className="employee-form-input"
                  type="text" 
                  name="name" 
                  value={selectedEmployee.name} 
                  onChange={handleChange} 
                  placeholder="Enter employee name" 
                />
              </div>
              
              <div className="employee-form-group">
                <label className="employee-form-label">Email</label>
                <input 
                  className="employee-form-input"
                  type="email" 
                  name="email" 
                  value={selectedEmployee.email} 
                  onChange={handleChange} 
                  placeholder="Enter email address" 
                />
              </div>
              
              {!selectedEmployee.id && (
                <div className="employee-form-group">
                  <label className="employee-form-label">Password</label>
                  <input 
                    className="employee-form-input"
                    type="password" 
                    name="password" 
                    value={selectedEmployee.password} 
                    onChange={handleChange} 
                    placeholder="Create password" 
                  />
                </div>
              )}
              
              <div className="employee-form-group">
                <label className="employee-form-label">Department</label>
                <input 
                  className="employee-form-input"
                  type="text" 
                  name="department" 
                  value={selectedEmployee.department} 
                  onChange={handleChange} 
                  placeholder="Enter department" 
                />
              </div>
              
              <div className="employee-form-group">
                <label className="employee-form-label">Contact</label>
                <input 
                  className="employee-form-input"
                  type="text" 
                  name="contact" 
                  value={selectedEmployee.contact} 
                  onChange={handleChange} 
                  placeholder="Enter contact number" 
                />
              </div>
              
              <div className="employee-form-group">
                <label className="employee-form-label">Address</label>
                <input 
                  className="employee-form-input"
                  type="text" 
                  name="address" 
                  value={selectedEmployee.address} 
                  onChange={handleChange} 
                  placeholder="Enter address" 
                />
              </div>
            </div>
            
            <div className="employee-modal-footer">
              <button className="employee-save-button" onClick={handleSaveEmployee}>
                {selectedEmployee.id ? "Update Employee" : "Add Employee"}
              </button>
              <button className="employee-cancel-button" onClick={handleCloseModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HandleEmployees;