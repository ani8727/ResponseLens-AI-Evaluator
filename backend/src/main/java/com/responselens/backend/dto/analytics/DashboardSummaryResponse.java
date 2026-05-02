package com.responselens.backend.dto.analytics;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardSummaryResponse {
    private long totalUsers;
    private long totalPrompts;
    private long totalEvaluations;
    private Double avgAccuracy;
    private Double avgRelevance;
    private Double avgClarity;
    private Double avgSafety;
}
