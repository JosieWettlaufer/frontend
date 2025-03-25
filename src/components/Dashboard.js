import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = ({ user, pages, refreshPages }) => {
  const [showAddPageModal, setShowAddPageModal] = useState(false);
  const [newPageLabel, setNewPageLabel] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle creating a new recipe page
  const handleCreatePage = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!newPageLabel.trim()) {
      setError('Please provide a page name');
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5690/api/users/addPage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ label: newPageLabel })
      });

      const data = await response.json();
      
      if (response.ok) {
        // Refresh pages to include the new one
        refreshPages();
        // Close modal and reset form
        setShowAddPageModal(false);
        setNewPageLabel('');
      } else {
        setError(data.message || 'Failed to create page');
      }
    } catch (err) {
      setError('Network error, please try again');
      console.error('Error creating page:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (showAddPageModal && event.target.classList.contains('modal')) {
        setShowAddPageModal(false);
      }
    }
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showAddPageModal]);

  // Handle escape key to close modal
  useEffect(() => {
    function handleEscKey(event) {
      if (showAddPageModal && event.key === 'Escape') {
        setShowAddPageModal(false);
      }
    }
    
    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
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
          {pages.map(page => (
            <div className="col" key={page._id}>
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{page.label}</h5>
                  <p className="card-text">
                    {page.timers.length} timer{page.timers.length !== 1 ? 's' : ''}
                  </p>
                  <Link 
                    className="btn btn-outline-primary" 
                    to={`/recipe/${page._id}`}
                  >
                    Open Page
                  </Link>
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
        <div className="modal fade show" tabIndex="-1" style={{display: 'block', backgroundColor: 'rgba(0,0,0,0.5)'}}>
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
                    <label htmlFor="pageNameInput" className="form-label">Page Name</label>
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
                  {isLoading ? 'Creating...' : 'Create Page'}
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