package com.responselens.backend.model;

import com.responselens.backend.model.enums.PromptCategory;
import com.responselens.backend.model.enums.PromptStatus; // Import PromptStatus
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "prompts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Prompt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    @Column(nullable = false)
    private String promptText;

    @Lob
    @Column
    private String aiResponse;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private PromptCategory category;

    // --- FIX START: Add status and error message for AI generation tracking ---
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default // Initialize with PENDING for new prompts
    private PromptStatus status = PromptStatus.PENDING;

    @Column(length = 1000) // Store user-friendly error message if AI generation fails
    private String errorMessage;
    // --- FIX END ---

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        this.createdAt = LocalDateTime.now();
        // Ensure status is set if not explicitly provided (e.g., via builder)
        if (this.status == null) {
            this.status = PromptStatus.PENDING;
        }
    }
}
