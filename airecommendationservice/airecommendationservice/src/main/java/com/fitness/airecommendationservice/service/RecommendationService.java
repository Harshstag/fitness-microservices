package com.fitness.airecommendationservice.service;

import com.fitness.airecommendationservice.model.Recommendation;
import com.fitness.airecommendationservice.repository.RecommendationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecommendationService {


    private final RecommendationRepository recommendationRepository;

    public RecommendationService(RecommendationRepository recommendationRepository) {
        this.recommendationRepository = recommendationRepository;
    }

    public List<Recommendation> getUserRecommendations(String userId) {
        List<Recommendation> recommendations = recommendationRepository.findByUserId(userId);
        if (recommendations == null || recommendations.isEmpty()) {
            throw new RuntimeException("Recommendations not found for user id: " + userId);
        }
        return recommendations;
    }

    public Recommendation getActivityRecommendation(String activityId) {
        return  recommendationRepository.findByActivityId(activityId).orElseThrow( () -> new RuntimeException("::::::::::::::::::::::::::::: Recommendation not found for activity id: " + activityId));
    }
}
