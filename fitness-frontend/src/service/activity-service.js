// src/services/activityService.js

const BASE_URL = "http://localhost:8084/api/activites";

/**
 * Create a new activity
 * @param {Object} activityData - Activity data
 * @returns {Promise<ActivityResponse>}
 */
export const createActivity = async (activityData) => {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(activityData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create activity: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating activity:", error);
    throw error;
  }
};

/**
 * Get all activities
 * @returns {Promise<ActivityResponse[]>}
 */
export const getAllActivities = async () => {
  try {
    const response = await fetch(BASE_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch activities: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching activities:", error);
    throw error;
  }
};

/**
 * Get activity by ID
 * @param {string} activityId - Activity ID
 * @returns {Promise<ActivityResponse>}
 */
export const getActivityById = async (activityId) => {
  try {
    const response = await fetch(`${BASE_URL}/${activityId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch activity: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching activity:", error);
    throw error;
  }
};

/**
 * Update activity
 * @param {string} activityId - Activity ID
 * @param {Object} activityData - Updated activity data
 * @returns {Promise<ActivityResponse>}
 */
export const updateActivity = async (activityId, activityData) => {
  try {
    const response = await fetch(`${BASE_URL}/${activityId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(activityData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update activity: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating activity:", error);
    throw error;
  }
};

/**
 * Delete activity
 * @param {string} activityId - Activity ID
 * @returns {Promise<void>}
 */
export const deleteActivity = async (activityId) => {
  try {
    const response = await fetch(`${BASE_URL}/${activityId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete activity: ${response.statusText}`);
    }

    return;
  } catch (error) {
    console.error("Error deleting activity:", error);
    throw error;
  }
};

export default {
  createActivity,
  getAllActivities,
  getActivityById,
  updateActivity,
  deleteActivity,
};
