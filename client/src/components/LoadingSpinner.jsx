import React from 'react';
import './LoadingSpinner.css';

function LoadingSpinner({ size = 'medium', color = 'primary' }) {
  return (
    <div className={`spinner-container ${size} ${color}`}>
      <div className="spinner">
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
    </div>
  );
}

export default LoadingSpinner;
