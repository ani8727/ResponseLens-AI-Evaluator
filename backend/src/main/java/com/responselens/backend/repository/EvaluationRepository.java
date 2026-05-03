package com.responselens.backend.repository;

import com.responselens.backend.model.Evaluation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {
    Page<Evaluation> findByPromptId(Long promptId, Pageable pageable);
    Page<Evaluation> findByReviewerId(Long reviewerId, Pageable pageable);
    Page<Evaluation> findByReviewerEmail(String reviewerEmail, Pageable pageable);
    Page<Evaluation> findByPromptIdAndReviewerEmail(Long promptId, String reviewerEmail, Pageable pageable);

    @Query("select avg(e.accuracyScore) from Evaluation e")
    Double findAvgAccuracy();

    @Query("select avg(e.relevanceScore) from Evaluation e")
    Double findAvgRelevance();

    @Query("select avg(e.clarityScore) from Evaluation e")
    Double findAvgClarity();

    @Query("select avg(e.safetyScore) from Evaluation e")
    Double findAvgSafety();
}
