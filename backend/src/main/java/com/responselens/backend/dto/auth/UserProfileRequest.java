package com.responselens.backend.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserProfileRequest {
    @NotBlank
    @Size(max = 120)
    private String name;

    @Size(min = 6, max = 100)
    private String password;
}
