package com.om_capstone1_backend.capstone1_backend.Controller;

import com.om_capstone1_backend.capstone1_backend.Model.UserModel;
import com.om_capstone1_backend.capstone1_backend.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;  // ✅ Make sure this instance is used

    // Register a new user
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody UserModel user) {
        return userService.registerUser(user);
    }

    // Login user
    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");
        return userService.loginUser(email, password);
    }

    // Update user profile
    @PutMapping("/update")
    public ResponseEntity<String> updateUser(@RequestBody Map<String, String> updateRequest) {
        long id = Long.parseLong(updateRequest.get("id"));
        String email = updateRequest.get("email");
        String name = updateRequest.get("name");
        String password = updateRequest.get("password");
        String department = updateRequest.get("department");
        String contact = updateRequest.get("contact");
        String address = updateRequest.get("address");

        UserModel updateUser = new UserModel(id, name, email, password, "EMPLOYEE", "ACTIVE", department, contact, address);
        return userService.updateUser(updateUser);
    }

    // Deactivate user account
    @PutMapping("/deactivate/{id}")
    public ResponseEntity<String> deactivateUser(@PathVariable Long id) {
        return userService.deactivateUser(id);
    }

    // ✅ Fix: Properly calling the instance method
    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(@RequestParam String email) {
        return userService.getUserByEmail(email);
    }

    @GetMapping("/all")
    public ResponseEntity<List<UserModel>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }
}
