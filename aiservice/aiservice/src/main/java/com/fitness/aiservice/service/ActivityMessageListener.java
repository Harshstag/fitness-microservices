// src/main/java/com/fitness/aiservice/service/ActivityMessageListener.java
package com.fitness.aiservice.service;

import com.fitness.aiservice.model.Activity;
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

    @KafkaListener(topics = "${kafka.topic.name}",
            groupId = "activity-processor-group",
            containerFactory = "activityKafkaListenerContainerFactory")
    public void processActivity(Activity activity) {
        if (activity == null) {
            log.warn("Received null Activity payload; skipping processing");
            return;
        }
        log.info("Received Activity for processing : {}", activity.getUserId());
        activityAIService.generateRecommendations(activity);
    }
}
