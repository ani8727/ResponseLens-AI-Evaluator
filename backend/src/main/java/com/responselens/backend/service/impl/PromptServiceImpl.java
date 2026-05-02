package com.responselens.backend.service.impl;

import com.responselens.backend.dto.prompt.PromptCreateRequest;
import com.responselens.backend.dto.prompt.PromptResponse;
import com.responselens.backend.dto.prompt.PromptUpdateRequest;
import com.responselens.backend.exception.GeminiApiException;
import com.responselens.backend.exception.ResourceNotFoundException;
import com.responselens.backend.model.Prompt;
import com.responselens.backend.model.User;
import com.responselens.backend.model.enums.PromptStatus;
import com.responselens.backend.repository.PromptRepository;
import com.responselens.backend.repository.UserRepository;
import com.responselens.backend.service.GeminiService;
import com.responselens.backend.service.PromptService;
import com.responselens.backend.util.MapperUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class PromptServiceImpl implements PromptService {

    private final PromptRepository promptRepository;
    private final UserRepository userRepository;
    private final GeminiService geminiService;

    @Override
    @Transactional
    public PromptResponse createPrompt(PromptCreateRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Prompt prompt = Prompt.builder()
                .promptText(request.getPromptText())
                .category(request.getCategory())
                .createdBy(user)
                .status(PromptStatus.PENDING)
                .build();

        // Save initially as pending
        prompt = promptRepository.save(prompt);

        try {
            String aiResponse = geminiService.generateResponse(request.getPromptText());
            prompt.setAiResponse(aiResponse);
            prompt.setStatus(PromptStatus.COMPLETED);
        } catch (GeminiApiException ex) {
            log.error("AI Generation failed for prompt ID: {}", prompt.getId(), ex);
            prompt.setStatus(PromptStatus.FAILED);
            prompt.setErrorMessage("AI generation service is currently unavailable. Please try again later.");
        } catch (Exception ex) {
            log.error("Unexpected error during AI Generation for prompt ID: {}", prompt.getId(), ex);
            prompt.setStatus(PromptStatus.FAILED);
            prompt.setErrorMessage("An unexpected error occurred during AI response generation.");
        }

        return MapperUtil.toPromptResponse(promptRepository.save(prompt));
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
    @Transactional
    public PromptResponse updatePrompt(Long id, PromptUpdateRequest request, String userEmail) {
        Prompt prompt = promptRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prompt not found"));
        validatePromptAccess(prompt, userEmail, false);

        prompt.setPromptText(request.getPromptText());
        prompt.setCategory(request.getCategory());
        return MapperUtil.toPromptResponse(promptRepository.save(prompt));
    }

    @Override
    @Transactional
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
