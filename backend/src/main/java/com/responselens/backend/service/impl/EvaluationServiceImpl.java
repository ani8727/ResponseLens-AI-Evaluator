package com.responselens.backend.service.impl;

import com.responselens.backend.dto.evaluation.EvaluationCreateRequest;
import com.responselens.backend.dto.evaluation.EvaluationResponse;
import com.responselens.backend.dto.evaluation.EvaluationUpdateRequest;
import com.responselens.backend.exception.ResourceNotFoundException;
import com.responselens.backend.model.Evaluation;
import com.responselens.backend.model.Prompt;
import com.responselens.backend.model.User;
import com.responselens.backend.repository.EvaluationRepository;
import com.responselens.backend.repository.PromptRepository;
import com.responselens.backend.repository.UserRepository;
import com.responselens.backend.service.EvaluationService;
import com.responselens.backend.util.MapperUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EvaluationServiceImpl implements EvaluationService {

    private final EvaluationRepository evaluationRepository;
    private final PromptRepository promptRepository;
    private final UserRepository userRepository;

    @Override
    public EvaluationResponse createEvaluation(EvaluationCreateRequest request, String userEmail) {
        Prompt prompt = promptRepository.findById(request.getPromptId())
                .orElseThrow(() -> new ResourceNotFoundException("Prompt not found"));
        User reviewer = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Reviewer not found"));

        Evaluation evaluation = Evaluation.builder()
                .prompt(prompt)
                .reviewer(reviewer)
                .accuracyScore(request.getAccuracyScore())
                .relevanceScore(request.getRelevanceScore())
                .clarityScore(request.getClarityScore())
                .safetyScore(request.getSafetyScore())
                .status(request.getStatus())
                .feedback(request.getFeedback())
                .build();
        return MapperUtil.toEvaluationResponse(evaluationRepository.save(evaluation));
    }

    @Override
    public EvaluationResponse getEvaluationById(Long id, String userEmail, boolean isAdmin) {
        Evaluation evaluation = evaluationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Evaluation not found"));
        validateEvaluationAccess(evaluation, userEmail, isAdmin);
        return MapperUtil.toEvaluationResponse(evaluation);
    }

    @Override
    public Page<EvaluationResponse> getEvaluationsByPrompt(Long promptId, Pageable pageable, String userEmail, boolean isAdmin) {
        Page<Evaluation> evaluations = isAdmin
                ? evaluationRepository.findByPromptId(promptId, pageable)
                : evaluationRepository.findByPromptIdAndReviewerEmail(promptId, userEmail, pageable);
        return evaluations.map(MapperUtil::toEvaluationResponse);
    }

    @Override
    public EvaluationResponse updateEvaluation(Long id, EvaluationUpdateRequest request, String userEmail) {
        Evaluation evaluation = evaluationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Evaluation not found"));
        validateEvaluationAccess(evaluation, userEmail, false);
        evaluation.setAccuracyScore(request.getAccuracyScore());
        evaluation.setRelevanceScore(request.getRelevanceScore());
        evaluation.setClarityScore(request.getClarityScore());
        evaluation.setSafetyScore(request.getSafetyScore());
        evaluation.setStatus(request.getStatus());
        evaluation.setFeedback(request.getFeedback());
        return MapperUtil.toEvaluationResponse(evaluationRepository.save(evaluation));
    }

    @Override
    public void deleteEvaluation(Long id, String userEmail) {
        Evaluation evaluation = evaluationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Evaluation not found"));
        validateEvaluationAccess(evaluation, userEmail, false);
        evaluationRepository.delete(evaluation);
    }

    private void validateEvaluationAccess(Evaluation evaluation, String userEmail, boolean isAdmin) {
        if (!isAdmin && !evaluation.getReviewer().getEmail().equals(userEmail)) {
            throw new AccessDeniedException("You are not allowed to access this evaluation.");
        }
    }
}
