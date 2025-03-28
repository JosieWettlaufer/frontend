// RecipePageCard.js - Card component for displaying individual timers
import React, { useState, useEffect, useRef } from "react";

/**
 * RecipePageCard component displays an individual timer with functionalities 
 * like start, pause, reset, and delete.
 * 
 * @param {Object} props - Component properties
 * @param {Object} props.timer - Timer data for display and control
 * @param {Function} props.onDelete - Callback function to delete the timer
 * @returns {JSX.Element} The rendered RecipePageCard component
 */
const RecipePageCard = ({ timer, onDelete }) => {
  const [timeLeft, setTimeLeft] = useState(timer.duration);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  /**
   * Initializes the audio for timer completion and sets up cleanup on unmount.
   * @effect
   */
  useEffect(() => {
    audioRef.current = new Audio("/notification-sound.mp3"); // Replace with your sound file
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  /**
   * Formats seconds into MM:SS format for display.
   * @param {number} seconds - The time in seconds to format
   * @returns {string} The formatted time in MM:SS
   */
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  /**
   * Starts or pauses the timer based on the current state.
   * If the timer has completed, it resets the time to the initial duration.
   * @function
   */
  const toggleTimer = () => {
    if (isRunning) {
      clearInterval(intervalRef.current);
    } else {
      // Reset if completed
      if (isCompleted) {
        setTimeLeft(timer.duration);
        setIsCompleted(false);
      }

      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            setIsCompleted(true);
            audioRef.current.play().catch(e => console.log("Audio play failed:", e));
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    setIsRunning(!isRunning);
  };

  /**
   * Resets the timer to its initial duration.
   * @function
   */
  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setTimeLeft(timer.duration);
    setIsRunning(false);
    setIsCompleted(false);
  };

  /**
   * Cleans up the timer interval when the component unmounts.
   * @effect
   */
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="col">
      <div className={`card h-100 ${isCompleted ? "border-success" : ""}`}>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <h5 className="card-title">{timer.label}</h5>
            <button 
              className="btn btn-sm btn-outline-danger" 
              onClick={() => onDelete(timer._id)}
              title="Delete timer"
            >
              <i className="bi bi-trash"></i>
            </button>
          </div>
          
          <div className="timer-display text-center mb-3">
            <h3 className={`${isCompleted ? "text-success" : ""}`}>
              {formatTime(timeLeft)}
            </h3>
            <div className="progress mb-2">
              <div 
                className={`progress-bar ${isCompleted ? "bg-success" : "bg-primary"}`}
                role="progressbar" 
                style={{ 
                  width: `${(timeLeft / timer.duration) * 100}%` 
                }} 
                aria-valuenow={timeLeft} 
                aria-valuemin="0" 
                aria-valuemax={timer.duration}
              ></div>
            </div>
          </div>
          
          <div className="d-flex justify-content-center gap-2">
            <button 
              className={`btn ${isRunning ? "btn-warning" : "btn-primary"}`}
              onClick={toggleTimer}
            >
              {isRunning ? "Pause" : isCompleted ? "Restart" : "Start"}
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={resetTimer}
              disabled={timeLeft === timer.duration && !isRunning}
            >
              Reset
            </button>
          </div>
        </div>
        {isCompleted && 
          <div className="card-footer bg-success text-white text-center">
            Time's up!
          </div>
        }
      </div>
    </div>
  );
};

export default RecipePageCard;
