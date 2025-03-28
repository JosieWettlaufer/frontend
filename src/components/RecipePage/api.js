// api.js - Handles all API communication

/**
 * Fetch page data for a specific recipe page.
 * @param {string} pageId - The ID of the recipe page to fetch data for.
 * @returns {Promise<Object|null>} The found page data or null if no page is found.
 * @throws {Error} Throws an error if the API call fails or page is not found.
 */
export const fetchPageData = async (pageId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5690/api/users/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch page data");
      }
  
      const data = await response.json();
      const foundPage = data.pages.find((p) => p._id === pageId);
      
      return foundPage;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  };
  
  /**
   * Add a new timer to a recipe page.
   * @param {string} label - The label/name of the new timer.
   * @param {number} duration - The duration of the new timer in seconds.
   * @param {string} pageId - The ID of the recipe page where the timer will be added.
   * @returns {Promise<Object>} The response data from the API after adding the timer.
   * @throws {Error} Throws an error if the API call fails or adding the timer fails.
   */
  export const addTimer = async (label, duration, pageId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5690/api/users/addTimer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          label,
          duration,
          pageId,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add timer");
      }
  
      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  };
  
  /**
   * Delete a timer from a recipe page.
   * @param {string} timerId - The ID of the timer to delete.
   * @returns {Promise<Object>} The response data from the API after deleting the timer.
   * @throws {Error} Throws an error if the API call fails or deleting the timer fails.
   */
  export const deleteTimer = async (timerId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5690/api/users/deleteTimer/${timerId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete timer");
      }
  
      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  };
  