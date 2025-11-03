package com.fitness.aiservice.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fitness.aiservice.model.Activity;
import com.fitness.aiservice.model.Recommendation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.lang.runtime.ObjectMethods;

@Service
@Slf4j
@RequiredArgsConstructor
public class ActivityAIService {

    @Autowired
    private GeminiService geminiService;

    public Recommendation generateRecommendations(Activity activity){

        String promt = createPromptForActivity(activity);

        String aiResponse = geminiService.getRecommendations(promt);
        log.info("Generated Prompt for Gemini AI: {}", aiResponse);

        return processAiResponse(activity, aiResponse);
    }

    private Recommendation processAiResponse(Activity activity, String aiResponse) {

        try{

            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(aiResponse); // convert string to json
            JsonNode textNode = rootNode.path("candidates").get(0).path("content").path("parts").get(0).path("text");

            String jsonContent = textNode.asText().replaceAll("```json\\n", "").replaceAll("\\n```", "").trim(); // coverts to string
//            log.info("Extracted Clean AI Content: {}", jsonContent);

            JsonNode analysisJson = mapper.readTree(jsonContent); // convert string to json
            JsonNode analysisNode = analysisJson.path("analysis");
            StringBuilder fullAnalysis = new StringBuilder();
            addAnalysisSection(fullAnalysis, analysisNode, "overall", "Overall:");
            addAnalysisSection(fullAnalysis, analysisNode, "pace", "Pace:");
            addAnalysisSection(fullAnalysis, analysisNode, "heartRate", "HeartRate:");
            addAnalysisSection(fullAnalysis, analysisNode, "caloriesBurned", "CaloriesBurned:");



        }catch (Exception e){

        }

        return null;
    }

    private void addAnalysisSection(StringBuilder fullAnalysis, JsonNode analysisNode, String key, String prefix) {
        if (!analysisNode.path(key).isMissingNode()) {
            fullAnalysis.append(prefix)
                    .append(analysisNode.path(key).asText())
                    .append("\n\n");
        }
    }

    private String createPromptForActivity(Activity activity) {
        return String.format("""
        Analyze this fitness activity and provide detailed recommendations in the following EXACT JSON format:
        {
          "analysis": {
            "overall": "Overall analysis here",
            "pace": "Pace analysis here",
            "heartRate": "Heart rate analysis here",
            "caloriesBurned": "Calories analysis here"
          },
          "improvements": [
            {
              "area": "Area name",
              "recommendation": "Detailed recommendation"
            }
          ],
          "suggestions": [
            {
              "workout": "Workout name",
              "description": "Detailed workout description"
            }
          ],
          "safety": [
            "Safety point 1",
            "Safety point 2"
          ]
        }

        Analyze this activity:
        Activity Type: %s
        Duration: %d minutes
        Calories Burned: %d
        Additional Metrics: %s
        
        Provide detailed analysis focusing on performance, improvements, next workout suggestions, and safety guidelines.
        Ensure the response follows the EXACT JSON format shown above.
        """,
                activity.getType(),
                activity.getDuration(),
                activity.getCaloriesBurned(),
                activity.getAdditionalMatrics()
        );
    }

}
