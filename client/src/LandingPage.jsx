import React from 'react';
import { useNavigate } from 'react-router-dom';
import Greeting from './Greeting';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/sandbox'); // No user state passed
  };

  return (
    <div className="landing-container">
      <img
        src="/logo.svg"
        alt="Code Sandbox Logo"
        style={{
          height: '64px',
          marginBottom: '1rem',
          display: 'block',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      />

      <div className="landing-header">
        <h1>Welcome to the Code Sandbox!</h1>
      </div>

      <div className="name-input">
        <button onClick={handleStart}>Start Coding</button>
      </div>

      <div className="greeting">
        <Greeting name="Guest" /> {/* Static greeting */}
      </div>

      <div className="about-box">
        <h2>What is this?</h2>
        <p>
          This is a simple code execution sandbox where you can write and run code directly in your browser!
          It supports multiple programming languages such as Python, JavaScript, and more.
        </p>
        <p>
          Perfect for testing code snippets, learning syntax, or experimenting with more — 
          all without the need to install anything.
        </p>
      </div>
    </div>
  );
}

export default LandingPage;
