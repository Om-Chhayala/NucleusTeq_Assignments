package com.om_capstone1_backend.capstone1_backend.Service;

import com.om_capstone1_backend.capstone1_backend.Model.EmployeeResponse;
import com.om_capstone1_backend.capstone1_backend.Model.FormModel;
import com.om_capstone1_backend.capstone1_backend.Model.UserModel;
import com.om_capstone1_backend.capstone1_backend.Repository.EmployeeResponseRepository;
import com.om_capstone1_backend.capstone1_backend.Repository.FormRepository;
import com.om_capstone1_backend.capstone1_backend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class EmployeeResponseService {

    @Autowired
    private EmployeeResponseRepository employeeResponseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FormRepository formRepository;

    // Create an employee response
    public ResponseEntity<String> createResponse(Long userId, Long formId, List<String> responses) {
        Optional<UserModel> user = userRepository.findById(userId);
        Optional<FormModel> form = formRepository.findById(formId);

        if (user.isPresent() && form.isPresent()) {
            EmployeeResponse response = new EmployeeResponse(user.get(), form.get(), responses, LocalDateTime.now());
            employeeResponseRepository.save(response);
            return ResponseEntity.ok("Response submitted successfully");
        }
        return ResponseEntity.badRequest().body("Invalid User ID or Form ID");
    }

    // Get all employee responses
    public List<EmployeeResponse> getAllResponses() {
        return employeeResponseRepository.findAll();
    }

    // Get responses by employee name
    public List<EmployeeResponse> getResponsesById(Long id) {
        return employeeResponseRepository.findByUser_Id(id);
    }

    // Get responses by department
    public List<EmployeeResponse> getResponsesByDepartment(String department) {
        return employeeResponseRepository.findByUser_Department(department);
    }

    // Get responses within a time range
    public List<EmployeeResponse> getResponsesByTimeRange(LocalDateTime startTime, LocalDateTime endTime) {
        return employeeResponseRepository.findBySubmittedAtBetween(startTime, endTime);
    }
}
