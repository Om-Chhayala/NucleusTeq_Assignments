package com.om_capstone1_backend.capstone1_backend.Model;

import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import java.util.List;

@Entity
@Table(name = "forms")
public class FormModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long formId; // Unique identifier for each form

    @Column(nullable = false)
    private String description; // Description of the form

    @ElementCollection
    @CollectionTable(name = "form_questions", joinColumns = @JoinColumn(name = "form_id"))
    @OnDelete(action = OnDeleteAction.CASCADE) // ✅ Fix: Proper cascading delete
    @Column(name = "question", nullable = false)
    private List<String> questions; // List of questions

    @Column(nullable = false)
    private String formType; // Type of form (e.g., survey, feedback)

    @Column(name = "is_active")
    private Boolean is_active = false;

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

    public void setIs_active(Boolean is_active) {this.is_active = is_active;}

    public Boolean getIs_active() {return is_active;}
}
