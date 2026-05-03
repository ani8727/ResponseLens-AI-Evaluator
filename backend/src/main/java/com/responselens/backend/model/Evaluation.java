package com.responselens.backend.model;

import com.responselens.backend.model.enums.EvaluationStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "evaluations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Evaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "prompt_id", nullable = false)
    private Prompt prompt;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "reviewer_id", nullable = false)
    private User reviewer;

    @Min(1)
    @Max(5)
    @Column(nullable = false)
    private Integer accuracyScore;

    @Min(1)
    @Max(5)
    @Column(nullable = false)
    private Integer relevanceScore;

    @Min(1)
    @Max(5)
    @Column(nullable = false)
    private Integer clarityScore;

    @Min(1)
    @Max(5)
    @Column(nullable = false)
    private Integer safetyScore;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EvaluationStatus status;

    @Lob
    private String feedback;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
