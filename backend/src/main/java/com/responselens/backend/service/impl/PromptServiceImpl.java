package com.responselens.backend.service.impl;

import com.responselens.backend.dto.prompt.PromptCreateRequest;
import com.responselens.backend.dto.prompt.PromptResponse;
import com.responselens.backend.dto.prompt.PromptUpdateRequest;
import com.responselens.backend.exception.GeminiApiException; // Import GeminiApiException
import com.responselens.backend.exception.ResourceNotFoundException;
import com.responselens.backend.model.Prompt;
import com.responselens.backend.model.User;
import com.responselens.backend.model.enums.PromptStatus; // Import PromptStatus
import com.responselens.backend.repository.PromptRepository;
import com.responselens.backend.repository.UserRepository;
import com.responselens.backend.service.GeminiService;
import com.responselens.backend.service.PromptService;
import com.responselens.backend.util.MapperUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j; // Import Slf4j for logging
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Import Transactional

@Service
@RequiredArgsConstructor
@Slf4j // Enable logging
public class PromptServiceImpl implements PromptService {

    private final PromptRepository promptRepository;
    private final UserRepository userRepository;
    private final GeminiService geminiService;

    @Override
    @Transactional // Ensure transaction for multiple DB operations
    public PromptResponse createPrompt(PromptCreateRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // --- FIX START: Initial save with PENDING status ---
        Prompt prompt = Prompt.builder()
                .promptText(request.getPromptText())
                .category(request.getCategory())
                .createdBy(user)
                .status(PromptStatus.PENDING) // Set initial status
                .build();

        // Save the prompt initially to get an ID and persist PENDING status
        prompt = promptRepository.save(prompt);

        try {
            String aiResponse = geminiService.generateResponse(request.getPromptText());
            prompt.setAiResponse(aiResponse);
            prompt.setStatus(PromptStatus.COMPLETED); // Update status on success
        } catch (GeminiApiException ex) {
            log.error("AI Generation failed for prompt ID: {}: {}", prompt.getId(), ex.getMessage());
            prompt.setStatus(PromptStatus.FAILED); // Update status on AI failure
            prompt.setErrorMessage("AI generation service is currently unavailable. Please try again later."); // User-friendly message
        } catch (Exception ex) {
            log.error("Unexpected error during AI Generation for prompt ID: {}", prompt.getId(), ex);
            prompt.setStatus(PromptStatus.FAILED); // Update status on unexpected failure
            prompt.setErrorMessage("An unexpected error occurred during AI response generation."); // User-friendly message
        }

        // Save the prompt again with updated status/response/error message
        return MapperUtil.toPromptResponse(promptRepository.save(prompt));
        // --- FIX END ---
    }

    @Override
    public PromptResponse getPromptById(Long id, String userEmail, boolean isAdmin) {
        Prompt prompt = promptRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prompt not found"));
        validatePromptAccess(prompt, userEmail, isAdmin);
        return MapperUtil.toPromptResponse(prompt);
    }

    @Override
    public Page<PromptResponse> getPrompts(Pageable pageable, String userEmail, boolean isAdmin) {
        Page<Prompt> prompts = isAdmin
                ? promptRepository.findAll(pageable)
                : promptRepository.findByCreatedByEmail(userEmail, pageable);
        return prompts.map(MapperUtil::toPromptResponse);
    }

    @Override
    @Transactional // Ensure transaction for DB operations
    public PromptResponse updatePrompt(Long id, PromptUpdateRequest request, String userEmail) {
        Prompt prompt = promptRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prompt not found"));
        validatePromptAccess(prompt, userEmail, false);

        prompt.setPromptText(request.getPromptText());
        prompt.setCategory(request.getCategory());
        return MapperUtil.toPromptResponse(promptRepository.save(prompt));
    }

    @Override
    @Transactional // Ensure transaction for DB operations
    public void deletePrompt(Long id, String userEmail) {
        Prompt prompt = promptRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prompt not found"));
        validatePromptAccess(prompt, userEmail, false);
        promptRepository.delete(prompt);
    }

    private void validatePromptAccess(Prompt prompt, String userEmail, boolean isAdmin) {
        if (!isAdmin && !prompt.getCreatedBy().getEmail().equals(userEmail)) {
            throw new AccessDeniedException("You are not allowed to access this prompt.");
        }
    }
}
