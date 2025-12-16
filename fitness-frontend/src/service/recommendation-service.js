// src/services/recommendationService.js

const BASE_URL = "http://localhost:8084/api/recommendations";

/**
 * Get recommendations by user ID
 * @param {string} userId - User ID
 * @returns {Promise<Recommendation[]>}
 */
export const getRecommendationsByUserId = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/user/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch recommendations: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching recommendations by user ID:", error);
    throw error;
  }
};

/**
 * Get recommendations by activity ID
 * @param {string} activityId - Activity ID
 * @returns {Promise<Recommendation>}
 */
export const getRecommendationsByActivityId = async (activityId) => {
  try {
    const response = await fetch(`${BASE_URL}/activity/${activityId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch recommendation: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching recommendation by activity ID:", error);
    throw error;
  }
};

export default {
  getRecommendationsByUserId,
  getRecommendationsByActivityId,
};
