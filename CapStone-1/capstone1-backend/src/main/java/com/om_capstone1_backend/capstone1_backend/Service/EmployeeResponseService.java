package com.om_capstone1_backend.capstone1_backend.Service;

import com.om_capstone1_backend.capstone1_backend.Model.EmployeeResponse;
import com.om_capstone1_backend.capstone1_backend.Model.FormModel;
import com.om_capstone1_backend.capstone1_backend.Model.UserModel;
import com.om_capstone1_backend.capstone1_backend.Repository.EmployeeResponseRepository;
import com.om_capstone1_backend.capstone1_backend.Repository.FormRepository;
import com.om_capstone1_backend.capstone1_backend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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

    public ResponseEntity<String> deleteResponse(Long responseId) {
        try {
            if (!employeeResponseRepository.existsById(responseId)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Response not found");
            }

            employeeResponseRepository.deleteById(responseId);
            return ResponseEntity.ok("Response deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting response: " + e.getMessage());
        }
    }

    public ResponseEntity<String> updateResponse(Long responseId, EmployeeResponse updatedResponse) {
        try {
            Optional<EmployeeResponse> existingResponse = employeeResponseRepository.findById(responseId);

            if (existingResponse.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Response not found");
            }

            EmployeeResponse responseToUpdate = existingResponse.get();
            responseToUpdate.setResponses(updatedResponse.getResponses());
            // You might want to update the timestamp as well
            responseToUpdate.setSubmittedAt(LocalDateTime.now());

            employeeResponseRepository.save(responseToUpdate);
            return ResponseEntity.ok("Response updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating response: " + e.getMessage());
        }
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

    public List<EmployeeResponse> getResponsesByAddress(String address) {
        return employeeResponseRepository.findByUser_Address(address);
    }

    // Get responses within a time range
    public List<EmployeeResponse> getResponsesByTimeRange(LocalDateTime startTime, LocalDateTime endTime) {
        return employeeResponseRepository.findBySubmittedAtBetween(startTime, endTime);
    }
}
