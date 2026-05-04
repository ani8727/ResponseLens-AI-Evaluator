package com.responselens.backend.controller;

import com.responselens.backend.dto.auth.AuthResponse;
import com.responselens.backend.dto.auth.LoginRequest;
import com.responselens.backend.dto.auth.SignupRequest;
import com.responselens.backend.dto.auth.UserResponse;
import com.responselens.backend.dto.auth.UserProfileRequest;
import com.responselens.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.signup(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> me(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            log.error("Unauthorized /me access: missing authentication");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {
            return ResponseEntity.ok(authService.getCurrentUser(authentication.getName()));
        } catch (Exception e) {
            log.error("Error in /me", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<UserResponse> updateProfile(@Valid @RequestBody UserProfileRequest request, 
                                                     Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            log.error("Unauthorized profile update: missing authentication");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {
            return ResponseEntity.ok(authService.updateProfile(authentication.getName(), request));
        } catch (Exception e) {
            log.error("Error updating profile", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/deactivate")
    public ResponseEntity<Void> deactivate(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            log.error("Unauthorized deactivate: missing authentication");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {
            authService.deactivateAccount(authentication.getName());
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            log.error("Error deactivating account", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
