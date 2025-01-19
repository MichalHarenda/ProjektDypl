package com.example.demo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.List;
import java.util.Optional;
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserService() {
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public User registerUser(User user) {

        if (!isValid(user.getPassword())) {
            throw new IllegalArgumentException("Pasło musi zawierać co najmniej 8 liter, 1 liczbe, 1 znak specjalny. Co najmniej 1 litera musi być duża i mała");
        }
        if (emailExists(user.getEmail())) {
            throw new IllegalArgumentException("Mail już jest w użyciu");
        }
        if (usernameExists(user.getUsername())) {
            throw new IllegalArgumentException("Username already exists.");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    private static boolean isValid(String password) {
        String regex = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,}$";
        return password.matches(regex);
    }

    private boolean emailExists(String email) {
        return userRepository.findByEmail(email) != null;
    }

    // New method to check if the username exists
    private boolean usernameExists(String username) {
        return userRepository.findByUsername(username) != null;
    }

    // Method to check if the currently authenticated user is an admin
    private boolean isUserAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && authentication.isAuthenticated() &&
                authentication.getAuthorities().stream()
                        .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }
    // Update an existing user
    public User updateUser(Long userId, User updatedUser) {
        Optional<User> existingUserOptional = userRepository.findById(userId);

        if (existingUserOptional.isPresent()) {
            User existingUser = existingUserOptional.get();
            // Check if the new username is already taken (and is not the same as the existing username)
            if (!existingUser.getUsername().equals(updatedUser.getUsername()) && usernameExists(updatedUser.getUsername())) {
                throw new IllegalArgumentException("Username already exists.");
            }

            // Check if the new email is already associated with another user (and is not the same as the existing email)
            if (!existingUser.getEmail().equals(updatedUser.getEmail()) && emailExists(updatedUser.getEmail())) {
                throw new IllegalArgumentException("Email already exists.");
            }
            existingUser.setUsername(updatedUser.getUsername());
            existingUser.setEmail(updatedUser.getEmail());

/*            // Optional: Update the password only if it's not empty
            if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
                existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
            }*/
            // Check if the user is an admin and update admin status accordingly
            if (isUserAdmin()) { // Assuming isUserAdmin() is a method to check if the logged-in user is an admin
                existingUser.setIsAdmin(updatedUser.getIsAdmin()); // Update admin status if the logged-in user is an admin
            }

            return userRepository.save(existingUser);
        } else {
            throw new IllegalArgumentException("User not found.");
        }
    }

    // Delete a user by ID
    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }

    // Find user by ID
    public User getUserById(Long userId) {
        return userRepository.findById(userId).orElse(null); // or throw an exception if not found
    }

    // New Method to Get All Users
    public List<User> getAllUsers() {
        return userRepository.findAll(); // Retrieves all user records from the UserRepository
    }
    // Method to get the current user's details (username, email)
    public User getCurrentUserDetails() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            String username = authentication.getName(); // Get the username of the currently logged-in user
            User currentUser = userRepository.findByUsername(username); // Fetch the user details from the repository

            if (currentUser == null) {
                throw new RuntimeException("User not found.");
            }

            return currentUser; // Return the full user object which contains username and email
        }
        throw new RuntimeException("User is not authenticated.");
    }

    // New method to get the current user's ID
    public Long getCurrentUserId() {
        User currentUser = getCurrentUserDetails(); // Reuse getCurrentUserDetails method to get user
        return currentUser.getId(); // Return the ID of the current user
    }
}
