package com.responselens.backend.util;

import com.responselens.backend.dto.auth.UserResponse;
import com.responselens.backend.dto.evaluation.EvaluationResponse;
import com.responselens.backend.dto.prompt.PromptResponse;
import com.responselens.backend.model.Evaluation;
import com.responselens.backend.model.Prompt;
import com.responselens.backend.model.User;

public final class MapperUtil {
    private MapperUtil() {
    }

    public static UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .build();
    }

    public static PromptResponse toPromptResponse(Prompt prompt) {
        return PromptResponse.builder()
                .id(prompt.getId())
                .promptText(prompt.getPromptText())
                .aiResponse(prompt.getAiResponse())
                .category(prompt.getCategory())
                // --- FIX START: Map new status and error message fields ---
                .status(prompt.getStatus())
                .errorMessage(prompt.getErrorMessage())
                // --- FIX END ---
                .createdByUserId(prompt.getCreatedBy() != null ? prompt.getCreatedBy().getId() : null)
                .createdAt(prompt.getCreatedAt())
                // Scores are null by default as they come from manual Evaluation
                // Frontend handles null as "N/A"
                .build();
    }

    public static EvaluationResponse toEvaluationResponse(Evaluation evaluation) {
        return EvaluationResponse.builder()
                .id(evaluation.getId())
                .promptId(evaluation.getPrompt().getId())
                .reviewerId(evaluation.getReviewer().getId())
                .accuracyScore(evaluation.getAccuracyScore())
                .relevanceScore(evaluation.getRelevanceScore())
                .clarityScore(evaluation.getClarityScore())
                .safetyScore(evaluation.getSafetyScore())
                .status(evaluation.getStatus())
                .feedback(evaluation.getFeedback())
                .createdAt(evaluation.getCreatedAt())
                .build();
    }
}
