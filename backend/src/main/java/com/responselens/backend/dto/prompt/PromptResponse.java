package com.responselens.backend.dto.prompt;

import com.responselens.backend.model.enums.PromptCategory;
import com.responselens.backend.model.enums.PromptStatus;
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
    private PromptStatus status;
    private String errorMessage;
    private Long createdByUserId;
    private String createdByUserName;
    private LocalDateTime createdAt;

    // Scores from evaluation if available
    private Integer accuracyScore;
    private Integer relevanceScore;
    private Integer clarityScore;
    private Integer safetyScore;
}
