import React, { useEffect, useState } from "react";
import axios from "axios";
import "./HandleEmployees.css";

const HandleEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/users/all");
        setEmployees(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError("Failed to load employees. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter(employee => 
    employee.status !== "DEACTIVATE" && employee.role !== "HR"
  );

  const handleEditEmployee = (employee) => {
    setSelectedEmployee({ ...employee });
    setShowModal(true);
    document.body.classList.add("modal-open");
  };

  const handleAddEmployee = () => {
    setSelectedEmployee({
      id: "",
      name: "",
      email: "",
      password: "",
      department: "",
      contact: "",
      address: "",
      role: "Employee",
    });
    setShowModal(true);
    document.body.classList.add("modal-open");
  };

  const handleCloseModal = () => {
    setShowModal(false);
    document.body.classList.remove("modal-open");
  };

  const handleChange = (e) => {
    setSelectedEmployee({
      ...selectedEmployee,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveEmployee = async () => {
    try {
      if (selectedEmployee.id) {
        await axios.put("http://localhost:8080/api/users/update", selectedEmployee);
        setEmployees(employees.map(emp => 
          emp.id === selectedEmployee.id ? selectedEmployee : emp
        ));
      } else {
        const response = await axios.post(
          "http://localhost:8080/api/users/register",
          selectedEmployee
        );
        const updatedResponse = await axios.get("http://localhost:8080/api/users/all");
      setEmployees(Array.isArray(updatedResponse.data) ? updatedResponse.data : []);
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error saving employee:", error);
    }
  };

  const handleChangeRole = async (employeeId) => {
    try {
      await axios.put(`http://localhost:8080/api/users/change-role/${employeeId}`);
      alert("Role updated successfully");
    } catch (error) {
      alert("Failed to update role. Please try again.");
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await axios.delete(`http://localhost:8080/api/users/delete/${employeeId}`);
        setEmployees(employees.filter(emp => emp.id !== employeeId));
        alert("Employee deleted successfully");
      } catch (error) {
        alert("Failed to delete employee. Please try again.");
      }
    }
  };

  const formatDate = () => new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

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
      ) : filteredEmployees.length === 0 ? (
        <div className="employee-empty-state">
          <p>No active employees found. Add your first employee to get started.</p>
        </div>
      ) : (
        <div className="employee-card-grid">
          {filteredEmployees.map((employee) => (
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
                <div className="employee-detail-item">
                  <span className="employee-detail-label">Role:</span>
                  <span className="employee-role-badge">
                    {employee.role || "USER"}
                  </span>
                </div>
              </div>

              <div className="employee-card-footer">
                <button
                  className="employee-edit-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditEmployee(employee);
                  }}
                >
                  Edit
                </button>
                <button
                  className="employee-delete-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteEmployee(employee.id);
                  }}
                >
                  Delete
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
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={selectedEmployee.name}
                  onChange={handleChange}
                  placeholder="Enter name"
                />
              </div>

              <div className="employee-form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={selectedEmployee.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                />
              </div>

              
                <div className="employee-form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={selectedEmployee.password}
                    onChange={handleChange}
                    placeholder="Create password"
                  />
                </div>
            

              <div className="employee-form-group">
                <label>Department</label>
                <input
                  type="text"
                  name="department"
                  value={selectedEmployee.department}
                  onChange={handleChange}
                  placeholder="Enter department"
                />
              </div>

              <div className="employee-form-group">
                <label>Contact</label>
                <input
                  type="text"
                  name="contact"
                  value={selectedEmployee.contact}
                  onChange={handleChange}
                  placeholder="Enter contact"
                />
              </div>

              <div className="employee-form-group">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={selectedEmployee.address}
                  onChange={handleChange}
                  placeholder="Enter address"
                />
              </div>

              {selectedEmployee.id && (
                <div className="employee-form-group">
                  <label>Role</label>
                  <div className="employee-role-options">
                    <span>Current role: {selectedEmployee.role}</span>
                    <div className="employee-role-buttons">
                      <button onClick={() => handleChangeRole(selectedEmployee.id)}>
                        Promote to HR
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="employee-modal-footer">
              <button className="employee-save-button" onClick={handleSaveEmployee}>
                {selectedEmployee.id ? "Update" : "Create"}
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