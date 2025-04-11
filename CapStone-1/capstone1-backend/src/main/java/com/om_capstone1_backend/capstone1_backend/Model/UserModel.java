package com.om_capstone1_backend.capstone1_backend.Model;

import jakarta.persistence.*;

@Entity
@Table(name = "users", uniqueConstraints = @UniqueConstraint(columnNames = "email"))
public class UserModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Unique identifier for each employee

    @Column(nullable = false)
    private String name; // Employee's full name

    @Column(nullable = false, unique = true)
    private String email; // Employee's unique email (used for login)

    @Column(nullable = false)
    private String password; // Encrypted password for authentication

    @Column(nullable = false)
    private String role; // Role of the user (default EMPLOYEE)

    @Column(nullable = false)
    private String status; // Status of the user (ACTIVE/DEACTIVATED)

    @Column(nullable = false)
    private String department; // Department of the user

    @Column(nullable = false)
    private String contact; // Contact number of the user

    @Column(nullable = false)
    private String address; // Address of the user

    // Constructors
    public UserModel() {
        this.role = "EMPLOYEE";
        this.status = "ACTIVE";
    }

    public UserModel(Long id, String name, String email, String password, String role, String status, String department, String contact, String address) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role.toUpperCase();
        this.status = status;
        this.department = department;
        this.contact = contact;
        this.address = address;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role.toUpperCase();
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}
