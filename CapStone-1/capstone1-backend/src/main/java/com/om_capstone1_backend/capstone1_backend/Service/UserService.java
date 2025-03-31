package com.om_capstone1_backend.capstone1_backend.Service;

import com.om_capstone1_backend.capstone1_backend.Model.UserModel;
import com.om_capstone1_backend.capstone1_backend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // Register a new user
    public ResponseEntity<String> registerUser(UserModel user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword())); // Encrypt password
        user.setStatus("ACTIVE"); // Default status
        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully");
    }

    // Login user
    public ResponseEntity<String> loginUser(String email, String password) {
        Optional<UserModel> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent() && passwordEncoder.matches(password, userOpt.get().getPassword())) {
            return ResponseEntity.ok("Login successful");
        }
        return ResponseEntity.badRequest().body("Invalid email or password");
    }

    // Get user profile by email
    public ResponseEntity<UserModel> getUserByEmail(String email) {
        Optional<UserModel> user = userRepository.findByEmail(email);
        return user.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.badRequest().body(null));
    }

    // Update user profile
    public ResponseEntity<String> updateUser(UserModel updatedUser) {
        Optional<UserModel> userOpt = userRepository.findById(updatedUser.getId());
        if (userOpt.isPresent()) {
            UserModel user = userOpt.get();
            user.setName(updatedUser.getName());
            user.setEmail(updatedUser.getEmail());
            user.setDepartment(updatedUser.getDepartment());
            user.setContact(updatedUser.getContact());
            user.setAddress(updatedUser.getAddress());

            // Only update password if a new one is provided
            if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
                user.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
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
