package com.responselens.backend.service;

import com.responselens.backend.dto.prompt.PromptCreateRequest;
import com.responselens.backend.dto.prompt.PromptResponse;
import com.responselens.backend.dto.prompt.PromptUpdateRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PromptService {
    PromptResponse createPrompt(PromptCreateRequest request, String userEmail);
    PromptResponse getPromptById(Long id, String userEmail, boolean isAdmin);
    Page<PromptResponse> getPrompts(Pageable pageable, String userEmail, boolean isAdmin);
    PromptResponse updatePrompt(Long id, PromptUpdateRequest request, String userEmail);
    void deletePrompt(Long id, String userEmail);
}
