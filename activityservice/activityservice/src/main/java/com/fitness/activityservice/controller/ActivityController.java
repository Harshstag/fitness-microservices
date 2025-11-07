package com.fitness.activityservice.controller;


import com.fitness.activityservice.dto.ActivityRequest;
import com.fitness.activityservice.dto.ActivityResponse;
import com.fitness.activityservice.service.ActivityService;
import com.fitness.activityservice.service.UserValidationService;
import lombok.AllArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/activites")
@AllArgsConstructor
public class ActivityController {

    @Autowired
    private ActivityService activityService;

    @Autowired
    private UserValidationService userValidationService;

    @PostMapping
    public ResponseEntity<ActivityResponse> trackActivity(@RequestBody ActivityRequest request) {

        Boolean isValid = userValidationService.validateUser(request.getUserId());
        if (!isValid) {
            throw new RuntimeException("Invalid user Id : " + request.getUserId());
        }
        return ResponseEntity.ok(activityService.trackActivity(request));
    }

    @GetMapping("/{activityId}")
    public ResponseEntity<ActivityResponse> getActivity(@PathVariable("activityId") String activityId){
        // Implementation for getting activity by ID can be added here
        return ResponseEntity.ok(activityService.getActivity(activityId));
    }
}
