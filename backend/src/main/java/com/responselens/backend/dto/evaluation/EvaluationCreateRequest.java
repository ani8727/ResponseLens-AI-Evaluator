package com.responselens.backend.dto.evaluation;

import com.responselens.backend.model.enums.EvaluationStatus;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EvaluationCreateRequest {
    @NotNull
    private Long promptId;

    @NotNull
    @Min(1)
    @Max(5)
    private Integer accuracyScore;

    @NotNull
    @Min(1)
    @Max(5)
    private Integer relevanceScore;

    @NotNull
    @Min(1)
    @Max(5)
    private Integer clarityScore;

    @NotNull
    @Min(1)
    @Max(5)
    private Integer safetyScore;

    @NotNull
    private EvaluationStatus status;

    private String feedback;
}
