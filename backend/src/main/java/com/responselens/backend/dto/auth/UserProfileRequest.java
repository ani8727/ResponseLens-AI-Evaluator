package com.responselens.backend.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserProfileRequest {
    @NotBlank(message = "Name cannot be empty")
    @Size(max = 120, message = "Name cannot exceed 120 characters")
    private String name;

    @Size(min = 6, max = 100, message = "Password must be between 6 and 100 characters if provided")
    private String password; // Optional: only update if provided
}
