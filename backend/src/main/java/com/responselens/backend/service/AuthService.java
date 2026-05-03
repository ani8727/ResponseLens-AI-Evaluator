package com.responselens.backend.service;

import com.responselens.backend.dto.auth.AuthResponse;
import com.responselens.backend.dto.auth.LoginRequest;
import com.responselens.backend.dto.auth.SignupRequest;
import com.responselens.backend.dto.auth.UserResponse;
import com.responselens.backend.dto.auth.UserProfileRequest;

public interface AuthService {
    AuthResponse signup(SignupRequest request);
    AuthResponse login(LoginRequest request);
    UserResponse getCurrentUser(String email);
    UserResponse updateProfile(String email, UserProfileRequest request);
    void deactivateAccount(String email);
}
