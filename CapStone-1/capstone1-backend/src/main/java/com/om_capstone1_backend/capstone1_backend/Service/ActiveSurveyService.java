package com.om_capstone1_backend.capstone1_backend.Service;

import com.om_capstone1_backend.capstone1_backend.Model.ActiveSurveyForm;
import com.om_capstone1_backend.capstone1_backend.Model.EmployeeResponse;
import com.om_capstone1_backend.capstone1_backend.Model.FormModel;
import com.om_capstone1_backend.capstone1_backend.Model.UserModel;
import com.om_capstone1_backend.capstone1_backend.Repository.ActiveSurveyRepository;
import com.om_capstone1_backend.capstone1_backend.Repository.EmployeeResponseRepository;
import com.om_capstone1_backend.capstone1_backend.Repository.FormRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ActiveSurveyService {

    @Autowired
    private ActiveSurveyRepository activeSurveyRepository;

    @Autowired
    private FormRepository formRepository;

    @Autowired
    private EmployeeResponseRepository employeeResponseRepository;

    // Store active survey forms
    public ResponseEntity<String> storeActiveSurveyForms(List<Long> formIds) {
        // Input validation
        if (formIds == null || formIds.isEmpty()) {
            return ResponseEntity.badRequest().body("Form IDs list cannot be empty");
        }

        LocalDateTime now = LocalDateTime.now();

        // Save all active surveys in batch
        List<ActiveSurveyForm> activeSurveys = formIds.stream()
                .map(formId -> new ActiveSurveyForm(formId, now))
                .toList();
        activeSurveyRepository.saveAll(activeSurveys);  // Batch save

        // Update is_active status for each form
        for (Long formId : formIds) {
            Optional<FormModel> formOptional = formRepository.findById(formId);
            if (formOptional.isPresent()) {
                FormModel form = formOptional.get();
                form.setIs_active(true);
                formRepository.save(form);  // Save the updated status
            } else {
                // Log or handle missing form (optional)
                System.out.println("Form not found with ID: " + formId);
            }
        }

        return ResponseEntity.ok("Active survey forms stored successfully");
    }

    // Fetch complete forms that are currently active
    public List<FormModel> getActiveSurveyForms(Long userId) {
        // Get forms already filled by user
        Set<Long> alreadyFilledForms = employeeResponseRepository.findByUser_Id(userId)
                .stream()
                .map(EmployeeResponse::getForm)
                .map(FormModel::getFormId)
                .collect(Collectors.toSet());

        List<Long> activeFormIds = activeSurveyRepository.findAll()
                .stream()
                .map(ActiveSurveyForm::getFormId)
                .filter(formId -> !alreadyFilledForms.contains(formId))
                .collect(Collectors.toList());

        return formRepository.findAllById(activeFormIds);
    }

    // Scheduled task to delete expired surveys every 24 hours
    @Scheduled(fixedRate = 86400000) // Runs every 24 hours
    public void deleteExpiredSurveys() {
        LocalDateTime expiryThreshold = LocalDateTime.now().minusHours(24);
        List<ActiveSurveyForm> expiredSurveys = activeSurveyRepository
                .findByCreatedAtBefore(expiryThreshold);


        if (!expiredSurveys.isEmpty()) {
            // Get all form IDs from expired surveys
            List<Long> expiredFormIds = expiredSurveys.stream()
                    .map(ActiveSurveyForm::getFormId)
                    .collect(Collectors.toList());

            // Delete expired active survey records
            activeSurveyRepository.deleteAll(expiredSurveys);

            // Update is_active status to false for all expired forms
            List<FormModel> formsToUpdate = formRepository.findAllById(expiredFormIds);
            formsToUpdate.forEach(form -> form.setIs_active(false));
            formRepository.saveAll(formsToUpdate);

            System.out.println("Expired surveys cleaned up: " + expiredSurveys.size());
        }
    }
}
