package com.om_capstone1_backend.capstone1_backend.Service;

import com.om_capstone1_backend.capstone1_backend.Model.UserModel;
import com.om_capstone1_backend.capstone1_backend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // Register a new user (without password encryption)
    public ResponseEntity<String> registerUser(UserModel user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        // Store password as plain text
        user.setStatus("ACTIVE"); // Default status
        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully");
    }

    public ResponseEntity<String> deleteUser(Long id) {
        try {
            Optional<UserModel> userOpt = userRepository.findById(id);

            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("User with ID " + id + " not found");
            }

            userRepository.deleteById(id);
            return ResponseEntity.ok("User deleted successfully");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to delete user: " + e.getMessage());
        }
    }

    // Login user (without password encryption)
    public ResponseEntity<String> loginUser(String email, String password) {
        Optional<UserModel> userOpt = userRepository.findByEmail(email);

        // Compare plain text passwords directly
        if (userOpt.isPresent() && password.equals(userOpt.get().getPassword())) {
            return ResponseEntity.ok("Login successful");
        }
        return ResponseEntity.badRequest().body("Invalid email or password");
    }

    public ResponseEntity<String> changeUserRole(Long id, String newRole) {
        try {
            Optional<UserModel> optionalUser = userRepository.findById(id);

            if (optionalUser.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("User with ID " + id + " not found");
            }

            UserModel user = optionalUser.get();
            user.setRole(newRole);
            userRepository.save(user);

            return ResponseEntity.ok("User role successfully changed to " + newRole);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to change user role: " + e.getMessage());
        }
    }

    // Get user profile by email
    public ResponseEntity<UserModel> getUserByEmail(String email) {
        Optional<UserModel> user = userRepository.findByEmail(email);
        return user.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.badRequest().body(null));
    }

    // Update user profile (without password encryption)
    public ResponseEntity<String> updateUser(UserModel updatedUser) {
        Optional<UserModel> userOpt = userRepository.findById(updatedUser.getId());
        if (userOpt.isPresent()) {
            UserModel user = userOpt.get();
            user.setName(updatedUser.getName());
            user.setEmail(updatedUser.getEmail());
            user.setDepartment(updatedUser.getDepartment());
            user.setContact(updatedUser.getContact());
            user.setAddress(updatedUser.getAddress());

            // Update password as plain text if provided
            if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
                user.setPassword(updatedUser.getPassword());
            }

            userRepository.save(user);
            return ResponseEntity.ok("User updated successfully");
        }
        return ResponseEntity.badRequest().body("User not found");
    }

    // Deactivate user
    public ResponseEntity<String> deactivateUser(Long id) {
        Optional<UserModel> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            UserModel user = userOpt.get();
            user.setStatus("DEACTIVATED");
            userRepository.save(user);
            return ResponseEntity.ok("User deactivated successfully");
        }
        return ResponseEntity.badRequest().body("User not found");
    }

    // Get all users
    public List<UserModel> getAllUsers() {
        return userRepository.findAll();
    }
}