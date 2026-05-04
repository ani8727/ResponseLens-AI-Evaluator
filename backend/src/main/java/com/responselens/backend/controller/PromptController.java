package com.responselens.backend.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.responselens.backend.dto.prompt.PromptCreateRequest;
import com.responselens.backend.dto.prompt.PromptResponse;
import com.responselens.backend.dto.prompt.PromptUpdateRequest;
import com.responselens.backend.service.PromptService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
@RequestMapping("/api/v1/prompts")
@RequiredArgsConstructor
public class PromptController {

    private final PromptService promptService;

    private boolean isAdmin(Authentication authentication) {
        if (authentication == null || authentication.getAuthorities() == null) return false;
        return authentication.getAuthorities().stream()
            .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
    }

    @PostMapping
    public ResponseEntity<PromptResponse> create(@Valid @RequestBody PromptCreateRequest request,
                                                 Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            log.error("Unauthorized create prompt attempt: missing authentication");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(promptService.createPrompt(request, authentication.getName()));
        } catch (Exception e) {
            log.error("Error in create prompt", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<PromptResponse> getById(@PathVariable Long id, Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            log.error("Unauthorized getById attempt: missing authentication");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {
            return ResponseEntity.ok(promptService.getPromptById(id, authentication.getName(), isAdmin(authentication)));
        } catch (Exception e) {
            log.error("Error in getById", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping
    public ResponseEntity<Page<PromptResponse>> getAll(Pageable pageable, Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            log.error("Unauthorized getAll attempt: missing authentication");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {
            return ResponseEntity.ok(promptService.getPrompts(pageable, authentication.getName(), isAdmin(authentication)));
        } catch (Exception e) {
            log.error("Error in getAll prompts", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<PromptResponse> update(@PathVariable Long id,
                                                 @Valid @RequestBody PromptUpdateRequest request,
                                                 Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            log.error("Unauthorized update attempt: missing authentication");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {
            return ResponseEntity.ok(promptService.updatePrompt(id, request, authentication.getName()));
        } catch (Exception e) {
            log.error("Error in update prompt", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            log.error("Unauthorized delete attempt: missing authentication");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {
            promptService.deletePrompt(id, authentication.getName());
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            log.error("Error in delete prompt", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
