import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Greeting from './Greeting';

function LandingPage() {
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    const handleStart = () => {
        if(username.trim()){
            navigate('/sandbox', { state: { username } });
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
      <h1>👋 Welcome to Code Sandbox</h1>
      <input
        type="text"
        placeholder="Enter your name: "
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ marginRight: '1rem' }}
      />
      <button onClick={handleStart}>Start Coding</button>

      <div style={{ marginTop: '1rem' }}>
        <Greeting name={username || 'Guest'} />
      </div>

      {/* Description Section */}
      <div style={{ marginTop: '2rem' }}>
        <h2>What is this?</h2>
        <p>
            This is a simple code execution sandbox where you can write and run code directly in your browser! It supports multiple
            programming languages such as Python, JavaScript, and more.
        </p>
        <p>
            Perfect for testing code snippets, learning syntax, or experimenting with more - all without the need to install anything.
        </p>
      </div>
    </div>
  );
}

export default LandingPage;