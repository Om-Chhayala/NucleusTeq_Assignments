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
  

  return (
    <div className="card-container">
      <button className="add-employee-button" onClick={handleAddEmployee}>
        Add Employee
      </button>

      {loading ? (
        <p className="loading-text">Loading employees...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : employees.length === 0 ? (
        <p className="no-employees">No employees found</p>
      ) : (
        employees.map((employee) => (
          <div className="card" key={employee.id}>
            <div className="main-content">
              <div className="header">
                <span>Department:</span>
                <span>{employee.department || "N/A"}</span>
              </div>
              <p className="heading">{employee.name}</p>
              <p className="description">Email: {employee.email}</p>
              <p className="description">Contact: {employee.contact || "N/A"}</p>
              <p className="description">Address: {employee.address || "N/A"}</p>
            </div>
            <button className="edit-button" onClick={() => handleEditEmployee(employee)}>
              Edit
            </button>
          </div>
        ))
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{selectedEmployee.id ? "Edit Employee" : "Add Employee"}</h2>
            <div className="modal-content">
              <input type="text" name="name" value={selectedEmployee.name} onChange={handleChange} placeholder="Name" />
              <input type="email" name="email" value={selectedEmployee.email} onChange={handleChange} placeholder="Email" />
              {!selectedEmployee.id && (
                <input type="password" name="password" value={selectedEmployee.password} onChange={handleChange} placeholder="Password" />
              )}
              <input type="text" name="contact" value={selectedEmployee.contact} onChange={handleChange} placeholder="Contact" />
              <input type="text" name="department" value={selectedEmployee.department} onChange={handleChange} placeholder="Department" />
              <input type="text" name="address" value={selectedEmployee.address} onChange={handleChange} placeholder="Address" />
            </div>
            <div className="modal-buttons">
              <button className="save-button" onClick={handleSaveEmployee}>Save</button>
              <button className="cancel-button" onClick={handleCloseModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HandleEmployees;
