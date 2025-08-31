import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/sandbox');
  };

  return (
    <div className="landing-container">
      <img
        src="/logo.svg"
        alt="Code Sandbox Logo"
        className="landing-logo"
      />

      <div className="landing-header">
        <h1>Welcome to the Code Sandbox!</h1>
      </div>

      <div className="landing-actions">
        <button onClick={handleStart} className="start-button">
          Start Coding
        </button>
      </div>

      <div className="about-box">
        <h2>What is this?</h2>
        <p>
          This is a simple code execution sandbox where you can write and run code directly in your browser!
          It supports multiple programming languages such as Python, JavaScript, Java, and C++.
        </p>
        <p>
          Perfect for testing code snippets, learning syntax, or experimenting with code — 
          all without the need to install anything.
        </p>
      </div>
    </div>
  );
}

export default LandingPage;
