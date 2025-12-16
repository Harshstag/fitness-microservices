// src/services/userService.js

const BASE_URL = "http://localhost:8084/api/users";

/**
 * Get user by ID
 * @param {string} userId - User ID
 * @returns {Promise<UserResponse>}
 */
export const getUserById = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

/**
 * Register a new user
 * @param {RegisterRequest} registerData - User registration data
 * @returns {Promise<UserResponse>}
 */
export const registerUser = async (registerData) => {
  try {
    const response = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registerData),
    });

    if (!response.ok) {
      throw new Error(`Failed to register user: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

/**
 * Validate user
 * @param {string} userId - User ID
 * @returns {Promise<boolean>}
 */
export const validateUser = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/${userId}/validate`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to validate user: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error validating user:", error);
    throw error;
  }
};

export default {
  getUserById,
  registerUser,
  validateUser,
};
