package com.responselens.backend.dto.prompt;

import com.responselens.backend.model.enums.PromptCategory;
import com.responselens.backend.model.enums.PromptStatus; // Import PromptStatus
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class PromptResponse {
    private Long id;
    private String promptText;
    private String aiResponse;
    private PromptCategory category;

    // --- FIX START: Add status and error message for AI generation tracking ---
    private PromptStatus status;
    private String errorMessage;
    // --- FIX END ---

    private Long createdByUserId;
    private LocalDateTime createdAt;

    // Added for frontend compatibility on the Dashboard
    private Integer accuracyScore;
    private Integer relevanceScore;
    private Integer clarityScore;
    private Integer safetyScore;
}
