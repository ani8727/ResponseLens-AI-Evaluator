package com.responselens.backend.service;

import com.responselens.backend.dto.auth.*;

public interface AuthService {
    AuthResponse signup(SignupRequest request);
    AuthResponse login(LoginRequest request);
    UserResponse getCurrentUser(String email);
    UserResponse updateProfile(String email, UserProfileRequest request);
    void deactivateAccount(String email);
}
