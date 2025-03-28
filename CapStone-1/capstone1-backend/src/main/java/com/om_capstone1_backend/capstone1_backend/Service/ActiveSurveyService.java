package com.om_capstone1_backend.capstone1_backend.Service;

import com.om_capstone1_backend.capstone1_backend.Model.ActiveSurveyForm;
import com.om_capstone1_backend.capstone1_backend.Model.FormModel;
import com.om_capstone1_backend.capstone1_backend.Repository.ActiveSurveyRepository;
import com.om_capstone1_backend.capstone1_backend.Repository.FormRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ActiveSurveyService {

    @Autowired
    private ActiveSurveyRepository activeSurveyRepository;

    @Autowired
    private FormRepository formRepository;

    // Store active survey forms
    public ResponseEntity<String> storeActiveSurveyForms(List<Long> formIds) {
        for (Long formId : formIds) {
            activeSurveyRepository.save(new ActiveSurveyForm(formId, LocalDateTime.now()));
        }
        return ResponseEntity.ok("Active survey forms stored successfully");
    }

    // Fetch complete forms that are currently active
    public List<FormModel> getActiveSurveyForms() {
        List<Long> activeFormIds = activeSurveyRepository.findAll()
                .stream()
                .map(ActiveSurveyForm::getFormId)
                .collect(Collectors.toList());
        return formRepository.findAllById(activeFormIds);
    }

    // Scheduled task to delete expired surveys every 24 hours
    @Scheduled(fixedRate = 86400000) // Runs every 24 hours
    public void deleteExpiredSurveys() {
        LocalDateTime expiryTime = LocalDateTime.now().minusHours(24);
        List<ActiveSurveyForm> expiredSurveys = activeSurveyRepository.findByCreatedAtBefore(expiryTime);
        activeSurveyRepository.deleteAll(expiredSurveys);
    }
}
