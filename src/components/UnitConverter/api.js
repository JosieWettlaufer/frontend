// src/components/UnitConverter/api.js

import axios from "axios"; // Importing Axios for making HTTP requests

// Base API URL for user-related operations
const API_URL = "http://localhost:5690/api/users";

/**
 * Fetches all unit converters associated with a specific page.
 * @param {string} pageId - The ID of the page to fetch converters from.
 * @returns {Promise<Object>} - A promise resolving to the fetched data.
 * @throws {Error} - Throws an error if authentication token is missing.
 */
export const fetchConverters = async (pageId) => {
  const token = localStorage.getItem("token"); // Retrieve authentication token from local storage

  if (!token) {
    throw new Error("Authentication token not found"); // Throw error if token is missing
  }

  // Make a GET request to fetch unit converters for the given page
  const response = await axios.get(
    `${API_URL}/pages/${pageId}/unitConverters`,
    { headers: { Authorization: `Bearer ${token}` } } // Include token in request headers
  );

  return response.data; // Return the fetched data
};

/**
 * Saves a new unit converter to a specific page.
 * @param {string} pageId - The ID of the page where the converter will be saved.
 * @param {Object} converterData - The data of the unit converter to save.
 * @returns {Promise<Object>} - A promise resolving to the saved converter data.
 * @throws {Error} - Throws an error if authentication token is missing.
 */
export const saveConverter = async (pageId, converterData) => {
  const token = localStorage.getItem("token"); // Retrieve authentication token from local storage

  if (!token) {
    throw new Error("Authentication token not found"); // Throw error if token is missing
  }

  // Make a POST request to save the unit converter
  const response = await axios.post(
    `${API_URL}/pages/${pageId}/unitConverters`,
    converterData,
    { headers: { Authorization: `Bearer ${token}` } } // Include token in request headers
  );

  return response.data; // Return the saved converter data
};

/**
 * Deletes a unit converter from a specific page.
 * @param {string} pageId - The ID of the page from which the converter will be deleted.
 * @param {string} converterId - The ID of the unit converter to delete.
 * @returns {Promise<Object>} - A promise resolving to the response data.
 * @throws {Error} - Throws an error if authentication token is missing.
 */
export const deleteConverter = async (pageId, converterId) => {
  const token = localStorage.getItem("token"); // Retrieve authentication token from local storage

  if (!token) {
    throw new Error("Authentication token not found"); // Throw error if token is missing
  }

  // Make a DELETE request to remove the unit converter
  const response = await axios.delete(
    `${API_URL}/pages/${pageId}/unitConverters/${converterId}`,
    { headers: { Authorization: `Bearer ${token}` } } // Include token in request headers
  );

  return response.data; // Return the response data
};
