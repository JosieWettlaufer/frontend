import React, { useState, useEffect, useRef } from 'react';

const Timer = ({ timer, onDelete }) => {
  const [timeLeft, setTimeLeft] = useState(timer.duration);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  // Initialize audio element for timer completion
  useEffect(() => {
    audioRef.current = new Audio('/timer-beep.mp3'); // You'll need to provide this sound file
    return () => {
      // Clean up when component unmounts
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Format seconds into MM:SS format
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start the timer
  const startTimer = () => {
    if (!isRunning && timeLeft > 0) {
      setIsRunning(true);
      setIsComplete(false);
      
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            setIsComplete(true);
            audioRef.current.play();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  // Pause the timer
  const pauseTimer = () => {
    if (isRunning) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
    }
  };

  // Reset the timer
  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setIsComplete(false);
    setTimeLeft(timer.duration);
  };

  // Color styles based on timer state
  const getTimerStyle = () => {
    if (isComplete) return 'text-success';
    if (isRunning) return 'text-primary';
    return 'text-secondary';
  };

  return (
    <div className="timer-container">
      <h4>{timer.label}</h4>
      <div className={`timer-display mb-3 ${getTimerStyle()}`} style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
        {formatTime(timeLeft)}
      </div>
      
      <div className="d-flex justify-content-between">
        <div>
          {!isRunning ? (
            <button 
              className="btn btn-primary btn-sm me-2" 
              onClick={startTimer}
              disabled={timeLeft === 0}
            >
              {timeLeft === 0 ? 'Done' : 'Start'}
            </button>
          ) : (
            <button 
              className="btn btn-warning btn-sm me-2" 
              onClick={pauseTimer}
            >
              Pause
            </button>
          )}
          
          <button 
            className="btn btn-secondary btn-sm me-2" 
            onClick={resetTimer}
          >
            Reset
          </button>
        </div>
        
        <button 
          className="btn btn-danger btn-sm" 
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default Timer;