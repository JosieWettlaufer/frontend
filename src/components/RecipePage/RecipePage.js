// RecipePage.js - Main container component for recipe page functionality

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UnitConverter from "../UnitConverter";
import RecipePageCard from "./RecipePageCard";
import { fetchPageData, addTimer, deleteTimer } from "./api";

const RecipePage = ({ user, refreshPages }) => {
  const { pageId } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddTimerModal, setShowAddTimerModal] = useState(false);
  const [newTimer, setNewTimer] = useState({ label: "", duration: 60 });

  const navigate = useNavigate();

  /**
   * Loads the page data based on the provided pageId.
   * @async
   * @function
   * @returns {Promise<void>}
   * @throws {Error} Throws an error if loading page data fails.
   */
  const loadPageData = useCallback(async () => {
    if (!pageId) {
      setError("No page ID provided");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const foundPage = await fetchPageData(pageId);
      if (!foundPage) {
        setError("Page not found");
      } else {
        setPage(foundPage);
        setError("");
      }
    } catch (err) {
      console.error("Error fetching page:", err);
      setError("Error loading page data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [pageId]);

  useEffect(() => {
    loadPageData();
  }, [loadPageData]);

  /**
   * Closes the add timer modal when the Escape key is pressed.
   * @function
   */
  useEffect(() => {
    function handleEscKey(event) {
      if (showAddTimerModal && event.key === "Escape") {
        setShowAddTimerModal(false);
      }
    }

    document.addEventListener("keydown", handleEscKey);
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [showAddTimerModal]);

  /**
   * Closes the add timer modal when clicking outside of the modal.
   * @function
   */
  useEffect(() => {
    function handleClickOutside(event) {
      if (showAddTimerModal && event.target.classList.contains("modal")) {
        setShowAddTimerModal(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showAddTimerModal]);

  /**
   * Handles the process of adding a new timer.
   * @async
   * @function
   * @param {React.FormEvent} e - The form submit event.
   * @returns {Promise<void>}
   */
  const handleAddTimer = async (e) => {
    e.preventDefault();

    if (!newTimer.label.trim()) {
      setError("Timer name is required");
      return;
    }

    if (isNaN(newTimer.duration) || newTimer.duration <= 0) {
      setError("Please enter a valid duration");
      return;
    }

    try {
      await addTimer(newTimer.label, parseInt(newTimer.duration), pageId);
      await loadPageData();
      setShowAddTimerModal(false);
      setNewTimer({ label: "", duration: 60 });
      setError("");
    } catch (err) {
      setError(err.message || "Error adding timer. Please try again.");
    }
  };

  /**
   * Handles the process of deleting a timer.
   * @async
   * @function
   * @param {string} timerId - The ID of the timer to delete.
   * @returns {Promise<void>}
   */
  const handleDeleteTimer = async (timerId) => {
    try {
      await deleteTimer(timerId);
      await loadPageData();
    } catch (err) {
      setError(err.message || "Error deleting timer. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <p>Loading page data...</p>
      </div>
    );
  }

  if (error && !page) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{error}</div>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">Page not found</div>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>{page.label}</h1>
        <div>
          <button
            className="btn btn-outline-secondary me-2"
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setShowAddTimerModal(true)}
          >
            Add Timer
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger mb-3">{error}</div>}

      {page.timers && page.timers.length > 0 ? (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {page.timers.map((timer) => (
            <RecipePageCard 
              key={timer._id}
              timer={timer}
              onDelete={() => handleDeleteTimer(timer._id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center p-5 bg-light rounded">
          <h3>No timers yet</h3>
          <p>Add a timer to get started</p>
        </div>
      )}

      {/* Modal for adding a new timer */}
      {showAddTimerModal && (
        <div
          className="modal fade show"
          tabIndex="-1"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Timer</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAddTimerModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleAddTimer}>
                  <div className="mb-3">
                    <label htmlFor="timerName" className="form-label">
                      Timer Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="timerName"
                      placeholder="Enter timer name (e.g. Preheat Oven)"
                      value={newTimer.label}
                      onChange={(e) =>
                        setNewTimer({ ...newTimer, label: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="timerDuration" className="form-label">
                      Duration (seconds)
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="timerDuration"
                      placeholder="Enter duration in seconds"
                      value={newTimer.duration}
                      onChange={(e) =>
                        setNewTimer({ ...newTimer, duration: e.target.value })
                      }
                      required
                      min="1"
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddTimerModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAddTimer}
                >
                  Add Timer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop for modal */}
      {showAddTimerModal && <div className="modal-backdrop fade show"></div>}

      {/* Unit converter section */}
      <div className="section mt-5">
        <UnitConverter pageId={pageId} />
      </div>
    </div>
  );
};

export default RecipePage;
