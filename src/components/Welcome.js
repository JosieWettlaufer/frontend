import React from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome = ({ user, setUser }) => {
    const navigate = useNavigate();

    // If user is null or undefined, handle it gracefully
    if (!user) {
        return (
            <div className="container mt-5 text-center">
                <div className="alert alert-warning">
                    Please log in to view this page.
                </div>
                <button 
                    className="btn btn-primary"
                    onClick={() => navigate('/login')}
                >
                    Go to Login
                </button>
            </div>
        );
    }

    // If we have a user, show the welcome page
    return (
        <div className="container mt-5">
            <div className="card p-4 shadow">
                <h1 className="text-center mb-4">Welcome, {user.username}!</h1>
                
                <div className="d-grid gap-3">
                    <button 
                        className="btn btn-primary btn-lg"
                        onClick={() => navigate('/Dashboard')}
                    >
                        View Recipe Pages
                    </button>
                    
                    <button 
                        className="btn btn-secondary btn-lg"
                        onClick={() => navigate('/themes')}
                    >
                        Themes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Welcome;