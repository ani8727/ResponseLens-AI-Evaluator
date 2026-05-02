package com.responselens.backend.service.impl;

import com.responselens.backend.dto.analytics.DashboardSummaryResponse;
import com.responselens.backend.repository.EvaluationRepository;
import com.responselens.backend.repository.PromptRepository;
import com.responselens.backend.repository.UserRepository;
import com.responselens.backend.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final UserRepository userRepository;
    private final PromptRepository promptRepository;
    private final EvaluationRepository evaluationRepository;

    @Override
    public DashboardSummaryResponse getDashboardSummary() {
        return DashboardSummaryResponse.builder()
                .totalUsers(userRepository.count())
                .totalPrompts(promptRepository.count())
                .totalEvaluations(evaluationRepository.count())
                .avgAccuracy(defaultZero(evaluationRepository.findAvgAccuracy()))
                .avgRelevance(defaultZero(evaluationRepository.findAvgRelevance()))
                .avgClarity(defaultZero(evaluationRepository.findAvgClarity()))
                .avgSafety(defaultZero(evaluationRepository.findAvgSafety()))
                .build();
    }

    private Double defaultZero(Double value) {
        return value == null ? 0.0 : value;
    }
}
