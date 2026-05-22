package com.tasktracker.service;

import com.tasktracker.dto.LoginRequest;
import com.tasktracker.dto.RegisterRequest;
import com.tasktracker.entity.User;
import com.tasktracker.repository.UserRepository;
import com.tasktracker.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * AuthService - Handles user registration and login business logic
 */
@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * Register a new user
     * @return Map with success message and user data
     */
    public Map<String, Object> register(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered. Please login.");
        }

        // Create new user with encoded password
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        // Save user to database
        User savedUser = userRepository.save(user);

        // Generate JWT token
        String token = jwtUtil.generateToken(savedUser.getEmail(), savedUser.getId());

        // Build response
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Registration successful!");
        response.put("token", token);
        response.put("user", buildUserResponse(savedUser));

        return response;
    }

    /**
     * Authenticate user login
     * @return Map with JWT token and user data
     */
    public Map<String, Object> login(LoginRequest request) {
        // Find user by email
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());

        if (userOptional.isEmpty()) {
            throw new RuntimeException("No account found with this email.");
        }

        User user = userOptional.get();

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Incorrect password. Please try again.");
        }

        // Generate JWT token
        String token = jwtUtil.generateToken(user.getEmail(), user.getId());

        // Build response
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Login successful!");
        response.put("token", token);
        response.put("user", buildUserResponse(user));

        return response;
    }

    /**
     * Build user response map (without password)
     */
    private Map<String, Object> buildUserResponse(User user) {
        Map<String, Object> userMap = new HashMap<>();
        userMap.put("id", user.getId());
        userMap.put("name", user.getName());
        userMap.put("email", user.getEmail());
        userMap.put("createdAt", user.getCreatedAt());
        return userMap;
    }
}
