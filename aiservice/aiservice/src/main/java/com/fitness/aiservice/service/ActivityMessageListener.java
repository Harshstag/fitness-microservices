// src/main/java/com/fitness/aiservice/service/ActivityMessageListener.java
package com.fitness.aiservice.service;

import com.fitness.aiservice.model.Activity;
import com.fitness.aiservice.model.Recommendation;
import com.fitness.aiservice.repository.RecommendationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class ActivityMessageListener {

    private final ActivityAIService activityAIService;
    private final ActivityAIService aiService;
    private final RecommendationRepository recommendationRepository;

    @KafkaListener(topics = "${kafka.topic.name}",
            groupId = "activity-processor-group",
            containerFactory = "activityKafkaListenerContainerFactory")
    public void processActivity(Activity activity) {
        if (activity == null) {
            log.warn("Received null Activity payload; skipping processing");
            return;
        }
        log.info("Received Activity for processing : {}", activity.getUserId());
        Recommendation recommendation = activityAIService.generateRecommendations(activity);
        recommendationRepository.save(recommendation);
        log.info("Saved Recommendation for Activity ID in Recommendation Repo: {}", activity.getId());
    }
}
