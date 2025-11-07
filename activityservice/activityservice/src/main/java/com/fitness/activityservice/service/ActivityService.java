package com.fitness.activityservice.service;

import com.fitness.activityservice.dto.ActivityRequest;
import com.fitness.activityservice.dto.ActivityResponse;
import com.fitness.activityservice.model.Activity;
import com.fitness.activityservice.repository.ActivityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class ActivityService {

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private KafkaTemplate<String,Activity> kafkaTemplet;

    @Value("${kafka.topic.name}")
    private String topicName;

    public ActivityResponse trackActivity(ActivityRequest request) {

        Activity activity = Activity.builder()
        .userId(request.getUserId())
        .type(request.getType())
        .duration(request.getDuration())
        .caloriesBurned(request.getCaloriesBurned())
        .startTime(request.getStartTime())
        .additionalMatrics(request.getAdditionalMatrics())
        .build();

        Activity savedActivity = activityRepository.save(activity);

        try{
            kafkaTemplet.send(topicName, savedActivity.getUserId(), savedActivity);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        return mapToResponse(savedActivity);
    }

    private ActivityResponse mapToResponse(Activity savedActivity) {

        ActivityResponse response = new ActivityResponse();

        response.setId(savedActivity.getId());
        response.setUserId(savedActivity.getUserId());
        response.setType(savedActivity.getType());
        response.setDuration(savedActivity.getDuration());
        response.setCaloriesBurned(savedActivity.getCaloriesBurned());
        response.setStartTime(savedActivity.getStartTime());
        response.setAdditionalMatrics(savedActivity.getAdditionalMatrics());
        response.setCreatedAt(savedActivity.getCreatedAt());
        response.setUpdatedAt(savedActivity.getUpdatedAt());

        return response;
    }

    public ActivityResponse getActivity(String activityId) {
        Activity activity = activityRepository.findById(activityId).
                orElseThrow(() -> new RuntimeException(":::::::::::::::::::::::: Activity not found for id: " + activityId));

        return mapToResponse(activity);
    }
}
