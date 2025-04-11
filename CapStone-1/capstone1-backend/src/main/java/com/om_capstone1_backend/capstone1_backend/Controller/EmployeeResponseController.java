package com.om_capstone1_backend.capstone1_backend.Controller;

import com.om_capstone1_backend.capstone1_backend.Model.EmployeeResponse;
import com.om_capstone1_backend.capstone1_backend.Service.EmployeeResponseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/employee-responses")
public class EmployeeResponseController {

    @Autowired
    private EmployeeResponseService employeeResponseService;

    // Create an employee response (All Data Passed in Body)
    @PostMapping("/create")
    public ResponseEntity<String> createResponse(@RequestBody Map<String, Object> requestData) {
        Long userId = Long.valueOf(requestData.get("userId").toString());
        Long formId = Long.valueOf(requestData.get("formId").toString());
        List<String> responses = (List<String>) requestData.get("responses");
        int rating = Integer.parseInt(requestData.get("rating"));

        return employeeResponseService.createResponse(userId, formId, responses, rating);
    }
    // Delete an employee response
    @DeleteMapping("/{responseId}")
    public ResponseEntity<String> deleteResponse(@PathVariable Long responseId) {
        return employeeResponseService.deleteResponse(responseId);
    }
    // Update an employee response
    @PutMapping("/{responseId}")
    public ResponseEntity<String> updateResponse(
            @PathVariable Long responseId,
            @RequestBody EmployeeResponse updatedResponse) {
        return employeeResponseService.updateResponse(responseId, updatedResponse);
    }
    // Get all responses
    @GetMapping("/all")
    public ResponseEntity<List<EmployeeResponse>> getAllResponses() {
        return ResponseEntity.ok(employeeResponseService.getAllResponses());
    }

    // Get responses by employee name
    @GetMapping("/by-id")
    public ResponseEntity<List<EmployeeResponse>> getResponsesById(@RequestParam Long id) {
        return ResponseEntity.ok(employeeResponseService.getResponsesById(id));
    }

    // Get responses by department
    @GetMapping("/filter")
    public ResponseEntity<List<EmployeeResponse>> filterResponses(
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String address,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime) {

        List<EmployeeResponse> responses = employeeResponseService.getFilteredResponses(
                department,
                address,
                startTime,
                endTime
        );

        return ResponseEntity.ok(responses);
    }
}
