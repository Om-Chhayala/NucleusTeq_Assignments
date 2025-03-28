package com.om_capstone1_backend.capstone1_backend.Service;

import com.om_capstone1_backend.capstone1_backend.Model.FormModel;
import com.om_capstone1_backend.capstone1_backend.Repository.FormRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FormService {

    @Autowired
    private FormRepository formRepository;

    // Create a new form
    public ResponseEntity<String> createForm(FormModel form) {
        formRepository.save(form);
        return ResponseEntity.ok("Form created successfully");
    }

    // Get a form by ID
    public ResponseEntity<FormModel> getFormById(Long id) {
        Optional<FormModel> form = formRepository.findById(id);
        return form.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.badRequest().build());
    }

    // Update an existing form
    public ResponseEntity<String> updateForm(Long id, FormModel updatedForm) {
        if (formRepository.existsById(id)) {
            updatedForm.setFormId(id);
            formRepository.save(updatedForm);
            return ResponseEntity.ok("Form updated successfully");
        }
        return ResponseEntity.badRequest().body("Form not found");
    }

    // Delete a form by ID
    public ResponseEntity<String> deleteForm(Long id) {
        if (formRepository.existsById(id)) {
            formRepository.deleteById(id);
            return ResponseEntity.ok("Form deleted successfully");
        }
        return ResponseEntity.badRequest().body("Form not found");
    }

    // Get all forms
    public List<FormModel> getAllForms() {
        return formRepository.findAll();
    }
}
