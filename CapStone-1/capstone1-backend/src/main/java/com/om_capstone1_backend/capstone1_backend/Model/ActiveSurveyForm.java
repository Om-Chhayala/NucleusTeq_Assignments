package com.om_capstone1_backend.capstone1_backend.Model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "active_survey_forms")
public class ActiveSurveyForm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long formId; // ID of the form that is active

    @Column(nullable = false)
    private LocalDateTime createdAt; // Timestamp when the form was activated

    // Constructors
    public ActiveSurveyForm() {}

    public ActiveSurveyForm(Long formId, LocalDateTime createdAt) {
        this.formId = formId;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getFormId() {
        return formId;
    }

    public void setFormId(Long formId) {
        this.formId = formId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
