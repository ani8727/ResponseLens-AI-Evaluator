package com.responselens.backend.controller;

import com.responselens.backend.dto.prompt.PromptCreateRequest;
import com.responselens.backend.dto.prompt.PromptResponse;
import com.responselens.backend.dto.prompt.PromptUpdateRequest;
import com.responselens.backend.service.PromptService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/prompts")
@RequiredArgsConstructor
public class PromptController {

    private final PromptService promptService;

    private boolean isAdmin(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
    }

    @PostMapping
    public ResponseEntity<PromptResponse> create(@Valid @RequestBody PromptCreateRequest request,
                                                 Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(promptService.createPrompt(request, authentication.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PromptResponse> getById(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(promptService.getPromptById(id, authentication.getName(), isAdmin(authentication)));
    }

    @GetMapping
    public ResponseEntity<Page<PromptResponse>> getAll(Pageable pageable, Authentication authentication) {
        return ResponseEntity.ok(promptService.getPrompts(pageable, authentication.getName(), isAdmin(authentication)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PromptResponse> update(@PathVariable Long id,
                                                 @Valid @RequestBody PromptUpdateRequest request,
                                                 Authentication authentication) {
        return ResponseEntity.ok(promptService.updatePrompt(id, request, authentication.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication authentication) {
        promptService.deletePrompt(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
