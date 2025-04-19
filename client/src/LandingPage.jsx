import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Greeting from './Greeting';
import './LandingPage.css';

function LandingPage() {
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    const handleStart = () => {
        if(username.trim()){
            navigate('/sandbox', { state: { username } });
        }
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
                marginRight: 'auto'
            }}
            />

          <div className="landing-header">
            <h1>Welcome to the Code Sandbox!</h1>
          </div>
      
          <div className="name-input">
            <input
              type="text"
              placeholder="Enter your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <button onClick={handleStart}>Start Coding</button>
          </div>
      
          <div className="greeting">
            <Greeting name={username || 'Guest'} />
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