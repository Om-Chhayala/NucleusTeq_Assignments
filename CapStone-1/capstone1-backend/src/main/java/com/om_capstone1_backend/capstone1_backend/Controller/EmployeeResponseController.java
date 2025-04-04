package com.om_capstone1_backend.capstone1_backend.Controller;

import com.om_capstone1_backend.capstone1_backend.Model.EmployeeResponse;
import com.om_capstone1_backend.capstone1_backend.Service.EmployeeResponseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
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

        return employeeResponseService.createResponse(userId, formId, responses);
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
    @GetMapping("/by-department")
    public ResponseEntity<List<EmployeeResponse>> getResponsesByDepartment(@RequestParam String department) {
        return ResponseEntity.ok(employeeResponseService.getResponsesByDepartment(department));
    }

    @GetMapping("/by-address")
    public ResponseEntity<List<EmployeeResponse>> getResponsesByAddress(@RequestParam String address) {
        return ResponseEntity.ok(employeeResponseService.getResponsesByAddress(address));
    }

    // Get responses within a time range
    @GetMapping("/by-time-range")
    public ResponseEntity<List<EmployeeResponse>> getResponsesByTimeRange(@RequestBody Map<String, String> request) {
        LocalDateTime startTime = LocalDateTime.parse(request.get("startTime"));
        LocalDateTime endTime = LocalDateTime.parse(request.get("endTime"));
        return ResponseEntity.ok(employeeResponseService.getResponsesByTimeRange(startTime, endTime));
    }
}
