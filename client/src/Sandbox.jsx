import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

function Sandbox() {
  const greeting = "Hello, and welcome to the Code Sandbox! 👋";

  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');

  const handleRun = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, language }),
      });

      const data = await response.json();

      if (response.ok) {
        setOutput(data.result);
      } else {
        setOutput(data.error || 'Something went wrong.');
      }
    } catch (err) {
      console.error(err);
      setOutput('Failed to connect to backend.');
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1> {greeting} 👨‍💻</h1>

      <label>
        Language:
        <select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ marginLeft: '0.5rem' }}>
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="java">Java</option>
          <option value="c++">C++</option>
        </select>
      </label>

      <div style={{ marginTop: '1rem' }}>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Write your code here..."
          rows={10}
          cols={60}
          style={{ fontFamily: 'monospace', padding: '1rem' }}
        />
      </div>

      <div style={{ marginTop: '1rem' }}>
        <button onClick={handleRun}>Run Code</button>
      </div>

      {output && (
        <div style={{ marginTop: '2rem', backgroundColor: '#f0f0f0', padding: '1rem', borderRadius: '8px' }}>
          <h3>Output:</h3>
          <pre>{output}</pre>
        </div>
      )}
    </div>
  );
}

export default Sandbox;
