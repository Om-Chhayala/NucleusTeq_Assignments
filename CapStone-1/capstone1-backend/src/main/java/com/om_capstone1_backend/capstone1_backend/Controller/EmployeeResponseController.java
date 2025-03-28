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
@RequestMapping("/api/employee-responses")
@CrossOrigin(origins = "*")
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

    // Get all responses
    @GetMapping("/all")
    public ResponseEntity<List<EmployeeResponse>> getAllResponses() {
        return ResponseEntity.ok(employeeResponseService.getAllResponses());
    }

    // Get responses by employee name
    @GetMapping("/by-name")
    public ResponseEntity<List<EmployeeResponse>> getResponsesByName(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        return ResponseEntity.ok(employeeResponseService.getResponsesByName(name));
    }

    // Get responses by department
    @GetMapping("/by-department")
    public ResponseEntity<List<EmployeeResponse>> getResponsesByDepartment(@RequestBody Map<String, String> request) {
        String department = request.get("department");
        return ResponseEntity.ok(employeeResponseService.getResponsesByDepartment(department));
    }

    // Get responses within a time range
    @GetMapping("/by-time-range")
    public ResponseEntity<List<EmployeeResponse>> getResponsesByTimeRange(@RequestBody Map<String, String> request) {
        LocalDateTime startTime = LocalDateTime.parse(request.get("startTime"));
        LocalDateTime endTime = LocalDateTime.parse(request.get("endTime"));
        return ResponseEntity.ok(employeeResponseService.getResponsesByTimeRange(startTime, endTime));
    }
}
