// Sandbox.jsx
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

function Sandbox() {
  const location = useLocation();
  const username = location.state?.username || 'Guest';

  // your existing state
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');

  const handleRun = () => {
    console.log('Run clicked');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Welcome, {username} 👨‍💻</h1>
      <label>
        Language:
        <select>
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="java">Java</option>
          <option value="c++">C++</option>
        </select>
      </label>

      <div style={{ marginTop: '1rem' }}>
        <textarea
          placeholder="Write your code here..."
          rows={10}
          cols={60}
        />
      </div>

      <div style={{ marginTop: '1rem' }}>
        <button>Run Code</button>
      </div>
    </div>
  );
}

export default Sandbox;
