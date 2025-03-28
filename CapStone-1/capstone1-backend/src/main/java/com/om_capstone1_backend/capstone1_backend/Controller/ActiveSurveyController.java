package com.om_capstone1_backend.capstone1_backend.Controller;

import com.om_capstone1_backend.capstone1_backend.Model.FormModel;
import com.om_capstone1_backend.capstone1_backend.Service.ActiveSurveyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/active-surveys")
@CrossOrigin(origins = "*")
public class ActiveSurveyController {

    @Autowired
    private ActiveSurveyService activeSurveyService;

    // Store active survey forms
    @PostMapping("/store")
    public ResponseEntity<String> storeActiveSurveyForms(@RequestBody List<Long> formIds) {
        return activeSurveyService.storeActiveSurveyForms(formIds);
    }

    // Fetch active survey forms
    @GetMapping("/fetch")
    public ResponseEntity<List<FormModel>> getActiveSurveyForms() {
        return ResponseEntity.ok(activeSurveyService.getActiveSurveyForms());
    }
}
