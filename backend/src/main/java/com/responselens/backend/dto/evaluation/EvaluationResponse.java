package com.responselens.backend.dto.evaluation;

import com.responselens.backend.model.enums.EvaluationStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class EvaluationResponse {
    private Long id;
    private Long promptId;
    private Long reviewerId;
    private Integer accuracyScore;
    private Integer relevanceScore;
    private Integer clarityScore;
    private Integer safetyScore;
    private EvaluationStatus status;
    private String feedback;
    private LocalDateTime createdAt;
}
