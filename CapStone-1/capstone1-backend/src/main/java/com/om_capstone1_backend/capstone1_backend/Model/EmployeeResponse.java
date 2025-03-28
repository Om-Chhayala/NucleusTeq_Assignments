package com.om_capstone1_backend.capstone1_backend.Model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "employee_responses")
public class EmployeeResponse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserModel user; // Foreign key from Users table

    @ManyToOne
    @JoinColumn(name = "form_id", nullable = false)
    private FormModel form; // Foreign key from Forms table

    @ElementCollection
    @CollectionTable(name = "employee_response_answers", joinColumns = @JoinColumn(name = "response_id"))
    @Column(name = "answer", nullable = false)
    private List<String> responses; // List of responses in sequence

    @Column(nullable = false)
    private LocalDateTime submittedAt; // Timestamp when the response was submitted

    // Constructors
    public EmployeeResponse() {}

    public EmployeeResponse(UserModel user, FormModel form, List<String> responses, LocalDateTime submittedAt) {
        this.user = user;
        this.form = form;
        this.responses = responses;
        this.submittedAt = submittedAt;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserModel getUser() {
        return user;
    }

    public void setUser(UserModel user) {
        this.user = user;
    }

    public FormModel getForm() {
        return form;
    }

    public void setForm(FormModel form) {
        this.form = form;
    }

    public List<String> getResponses() {
        return responses;
    }

    public void setResponses(List<String> responses) {
        this.responses = responses;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }
}
