package com.responselens.backend.repository;

import com.responselens.backend.model.Prompt;
import com.responselens.backend.model.enums.PromptCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PromptRepository extends JpaRepository<Prompt, Long> {
    Page<Prompt> findByCreatedById(Long userId, Pageable pageable);
    Page<Prompt> findByCreatedByEmail(String email, Pageable pageable);
    Page<Prompt> findByCategory(PromptCategory category, Pageable pageable);
}
