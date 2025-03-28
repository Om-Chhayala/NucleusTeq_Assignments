package com.om_capstone1_backend.capstone1_backend.Model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "forms")
public class FormModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long formId; // Unique identifier for each form

    @Column(nullable = false)
    private String description; // Description of the form

    @ElementCollection // ✅ Fix: Used for storing list of primitive types
    @CollectionTable(name = "form_questions", joinColumns = @JoinColumn(name = "form_id"))
    @Column(name = "question", nullable = false)
    private List<String> questions; // List of questions

    @Column(nullable = false)
    private String formType; // Type of form (e.g., survey, feedback)

    // Constructors
    public FormModel() {}

    public FormModel(Long formId, String description, List<String> questions, String formType) {
        this.formId = formId;
        this.description = description;
        this.questions = questions;
        this.formType = formType;
    }

    // Getters and Setters
    public Long getFormId() {
        return formId;
    }

    public void setFormId(Long formId) {
        this.formId = formId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getQuestions() {
        return questions;
    }

    public void setQuestions(List<String> questions) {
        this.questions = questions;
    }

    public String getFormType() {
        return formType;
    }

    public void setFormType(String formType) {
        this.formType = formType;
    }
}
