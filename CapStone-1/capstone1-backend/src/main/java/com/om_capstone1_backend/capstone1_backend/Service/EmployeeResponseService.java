package com.om_capstone1_backend.capstone1_backend.Service;

import com.om_capstone1_backend.capstone1_backend.Model.EmployeeResponse;
import com.om_capstone1_backend.capstone1_backend.Model.FormModel;
import com.om_capstone1_backend.capstone1_backend.Model.UserModel;
import com.om_capstone1_backend.capstone1_backend.Repository.EmployeeResponseRepository;
import com.om_capstone1_backend.capstone1_backend.Repository.FormRepository;
import com.om_capstone1_backend.capstone1_backend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
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
    public ResponseEntity<String> createResponse(Long userId, Long formId, List<String> responses, int rating) {
        Optional<UserModel> user = userRepository.findById(userId);
        Optional<FormModel> form = formRepository.findById(formId);

        if (user.isPresent() && form.isPresent()) {
            EmployeeResponse response = new EmployeeResponse(user.get(), form.get(), responses, rating);
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

    public List<EmployeeResponse> getFilteredResponses(
            String department,
            String address,
            LocalDateTime startTime,
            LocalDateTime endTime) {

        Specification<EmployeeResponse> spec = Specification.where(null);

        if (department != null) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("user").get("department"), department));
        }

        if (address != null) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("user").get("address"), address));
        }

        if (startTime != null && endTime != null) {
            spec = spec.and((root, query, cb) ->
                    cb.between(root.get("submittedAt"), startTime, endTime));
        }

        // Correct non-static call on the repository instance
        return employeeResponseRepository.findAll(spec);
    }


}
