package com.om_capstone1_backend.capstone1_backend.Controller;

import com.om_capstone1_backend.capstone1_backend.Model.FormModel;
import com.om_capstone1_backend.capstone1_backend.Service.FormService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/forms")
public class FormController {

    @Autowired
    private FormService formService;

    // Create a new form
    @PostMapping("/create")
    public ResponseEntity<String> createForm(@RequestBody FormModel form) {
        return formService.createForm(form);
    }

    // Get a form by ID
    @GetMapping("/{id}")
    public ResponseEntity<FormModel> getFormById(@PathVariable Long id) {
        return formService.getFormById(id);
    }

    // Update an existing form
    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateForm(@PathVariable Long id, @RequestBody FormModel form) {
        return formService.updateForm(id, form);
    }

    // Delete a form by ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteForm(@PathVariable Long id) {
        return formService.deleteForm(id);
    }

    // Get all forms
    @GetMapping("/all")
    public List<FormModel> getAllForms() {
        return formService.getAllForms();
    }
}
