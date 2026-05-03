package com.responselens.backend.service;

import com.responselens.backend.dto.evaluation.EvaluationCreateRequest;
import com.responselens.backend.dto.evaluation.EvaluationResponse;
import com.responselens.backend.dto.evaluation.EvaluationUpdateRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface EvaluationService {
    EvaluationResponse createEvaluation(EvaluationCreateRequest request, String userEmail);
    EvaluationResponse getEvaluationById(Long id, String userEmail, boolean isAdmin);
    Page<EvaluationResponse> getEvaluationsByPrompt(Long promptId, Pageable pageable, String userEmail, boolean isAdmin);
    EvaluationResponse updateEvaluation(Long id, EvaluationUpdateRequest request, String userEmail);
    void deleteEvaluation(Long id, String userEmail);
}
