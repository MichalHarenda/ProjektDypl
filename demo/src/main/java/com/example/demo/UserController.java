package com.example.demo;

import com.example.demo.jwt.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private MyUserDetailsService myUserDetailsService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            boolean admin = false;
            user.setIsAdmin(admin); // Set the role before saving
            User registeredUser = userService.registerUser(user);
            return ResponseEntity.ok(registeredUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @PostMapping("/authenticate")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody LoginRequest authenticationRequest) throws Exception {
        try {
            // Log the login attempt
            System.out.println("Login attempt for: " + authenticationRequest.getUsernameOrEmail());

            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authenticationRequest.getUsernameOrEmail(), authenticationRequest.getPassword())
            );
        } catch (BadCredentialsException e) {
            // Log the failure
            System.out.println("Failed login attempt: " + e.getMessage());
            throw new Exception("Incorrect username or password", e);
        }

        final UserDetails userDetails = myUserDetailsService.loadUserByUsername(authenticationRequest.getUsernameOrEmail());
        final String jwt = jwtUtil.generateToken(userDetails);

        return ResponseEntity.ok(new JwtResponse(jwt));
    }

    // New Mapping to Get the Current User's Details
    @GetMapping("/users/current")
    public ResponseEntity<User> getCurrentUser() {
        User currentUser = userService.getCurrentUserDetails();
        return currentUser != null ? ResponseEntity.ok(currentUser) : ResponseEntity.notFound().build();
    }

    // New endpoint to get the current user's ID
    @GetMapping("/users/current/id")
    public ResponseEntity<Long> getCurrentUserId() {
        Long currentUserId = userService.getCurrentUserId();
        return ResponseEntity.ok(currentUserId);
    }

    // ** New Mapping to Get User by ID **
    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        return user != null ? ResponseEntity.ok(user) : ResponseEntity.notFound().build();
    }

    // ** New Mapping to Update User **
    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        User user = userService.updateUser(id, updatedUser);
        return user != null ? ResponseEntity.ok(user) : ResponseEntity.notFound().build();
    }

    // ** New Mapping to Delete User **
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    // ** New Mapping to Get All Users **
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/current/summary")
    public ResponseEntity<Map<String, String>> getCurrentUserSummary() {
        User currentUser = userService.getCurrentUserDetails();
        Map<String, String> userSummary = new HashMap<>();
        userSummary.put("username", currentUser.getUsername());
        userSummary.put("email", currentUser.getEmail());
        return ResponseEntity.ok(userSummary);
    }

    record JwtResponse(String jwt) { }
}
