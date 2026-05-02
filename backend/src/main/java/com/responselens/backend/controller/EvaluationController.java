package com.responselens.backend.controller;

import com.responselens.backend.dto.evaluation.EvaluationCreateRequest;
import com.responselens.backend.dto.evaluation.EvaluationResponse;
import com.responselens.backend.dto.evaluation.EvaluationUpdateRequest;
import com.responselens.backend.service.EvaluationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/evaluations")
@RequiredArgsConstructor
public class EvaluationController {

    private final EvaluationService evaluationService;

    private boolean isAdmin(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
    }

    @PostMapping
    public ResponseEntity<EvaluationResponse> create(@Valid @RequestBody EvaluationCreateRequest request,
                                                     Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(evaluationService.createEvaluation(request, authentication.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EvaluationResponse> getById(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(evaluationService.getEvaluationById(id, authentication.getName(), isAdmin(authentication)));
    }

    @GetMapping("/prompt/{promptId}")
    public ResponseEntity<Page<EvaluationResponse>> byPrompt(@PathVariable Long promptId,
                                                             Pageable pageable,
                                                             Authentication authentication) {
        return ResponseEntity.ok(evaluationService.getEvaluationsByPrompt(
                promptId, pageable, authentication.getName(), isAdmin(authentication)
        ));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EvaluationResponse> update(@PathVariable Long id,
                                                     @Valid @RequestBody EvaluationUpdateRequest request,
                                                     Authentication authentication) {
        return ResponseEntity.ok(evaluationService.updateEvaluation(id, request, authentication.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication authentication) {
        evaluationService.deleteEvaluation(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
