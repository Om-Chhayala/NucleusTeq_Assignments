package com.om_capstone1_backend.capstone1_backend.Controller;

import com.om_capstone1_backend.capstone1_backend.Model.UserModel;
import com.om_capstone1_backend.capstone1_backend.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    // Register a new user
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody UserModel user) {
        return userService.registerUser(user);
    }

    // Login user (Fixed: Accept JSON object in request body)
    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");
        return userService.loginUser(email, password);
    }

    // Update user profile
    @PutMapping("/update")
    public ResponseEntity<String> updateUser(@RequestBody Map<String, String> updateRequest) {
        long id = Long.parseLong(updateRequest.get("id")); // Corrected to parse Long
        String email = updateRequest.get("email");
        String name = updateRequest.get("name");
        String password = updateRequest.get("password");
        String department = updateRequest.get("department");

        UserModel updateUser = new UserModel(id, name, email, password, "EMPLOYEE", "ACTIVE", department); // Ensure correct parameter order

        return userService.updateUser(updateUser);
    }

    // Deactivate user account
    @PutMapping("/deactivate/{id}")
    public ResponseEntity<String> deactivateUser(@PathVariable Long id) {
        return userService.deactivateUser(id);
    }

    @GetMapping("/all")
    public ResponseEntity<List<UserModel>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }
}
