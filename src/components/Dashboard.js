import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

/**
 * Dashboard component for managing recipe pages.
 * It allows the user to create a new page and view existing pages.
 *
 * @param {Object} user - The current user's information.
 * @param {Array} pages - A list of recipe pages for the user.
 * @param {Function} refreshPages - Function to refresh the list of pages.
 * @returns {JSX.Element} The rendered Dashboard component.
 */
const Dashboard = ({ user, pages, refreshPages }) => {
  const [showAddPageModal, setShowAddPageModal] = useState(false);
  const [newPageLabel, setNewPageLabel] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * Handles the creation of a new recipe page.
   * Sends a POST request to the server to create the page.
   * 
   * @param {Event} e - The form submission event.
   */
  const handleCreatePage = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!newPageLabel.trim()) {
      setError("Please provide a page name");
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5690/api/users/addPage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ label: newPageLabel }),
      });

      const data = await response.json();

      if (response.ok) {
        // Refresh pages to include the new one
        refreshPages();
        // Close modal and reset form
        setShowAddPageModal(false);
        setNewPageLabel("");
      } else {
        setError(data.message || "Failed to create page");
      }
    } catch (err) {
      setError("Network error, please try again");
      console.error("Error creating page:", err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles the deletion of a recipe page.
   * Sends a DELETE request to the server to remove the page.
   * 
   * @param {string} pageId - The ID of the recipe page to delete.
   * @param {Event} e - The form submission event.
   */
  const handleDeletePage = async (pageId, e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5690/api/users/deletePage/${pageId}`, 
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete recipe page");
      }

      // Refreshes page to show changes
      refreshPages();

      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  /**
   * Closes the modal when clicking outside of it.
   * This is triggered by adding a click event listener to the document.
   */
  useEffect(() => {
    function handleClickOutside(event) {
      if (showAddPageModal && event.target.classList.contains("modal")) {
        setShowAddPageModal(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showAddPageModal]);

  /**
   * Closes the modal when the Escape key is pressed.
   * This is triggered by adding a keydown event listener to the document.
   */
  useEffect(() => {
    function handleEscKey(event) {
      if (showAddPageModal && event.key === "Escape") {
        setShowAddPageModal(false);
      }
    }

    document.addEventListener("keydown", handleEscKey);
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [showAddPageModal]);

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Recipe Pages</h1>

      <div className="d-flex justify-content-end mb-3">
        <button
          className="btn btn-primary"
          onClick={() => setShowAddPageModal(true)}
        >
          Create New Recipe Page
        </button>
      </div>

      {pages && pages.length > 0 ? (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {pages.map((page) => (
            <div className="col" key={page._id}>
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{page.label}</h5>
                  <p className="card-text">
                    {page.timers.length} timer
                    {page.timers.length !== 1 ? "s" : ""}
                  </p>
                  <div className="d-flex justify-content-between">
                    <Link
                      className="btn btn-outline-primary"
                      to={`/recipe/${page._id}`}
                    >
                      Open Page
                    </Link>
                    <button 
                      className="btn btn-danger"
                      onClick={(e) => handleDeletePage(page._id, e)}
                    >
                      Delete Page
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-5 bg-light rounded">
          <h3>No recipe pages yet</h3>
          <p>Create your first recipe page to get started</p>
        </div>
      )}

      {/* Modal for adding a new recipe page */}
      {showAddPageModal && (
        <div
          className="modal fade show"
          tabIndex="-1"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create New Recipe Page</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAddPageModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleCreatePage}>
                  <div className="mb-3">
                    <label htmlFor="pageNameInput" className="form-label">
                      Page Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="pageNameInput"
                      placeholder="Enter page name (e.g. Chocolate Chip Cookies)"
                      value={newPageLabel}
                      onChange={(e) => setNewPageLabel(e.target.value)}
                      required
                    />
                  </div>
                  {error && <p className="text-danger">{error}</p>}
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddPageModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleCreatePage}
                  disabled={isLoading}
                >
                  {isLoading ? "Creating..." : "Create Page"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop for modal */}
      {showAddPageModal && <div className="modal-backdrop fade show"></div>}
    </div>
  );
};

export default Dashboard;
