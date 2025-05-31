import React, { useState } from 'react';
import styles from './Sandbox.module.css';
import { Sun, Moon} from 'lucide-react';

function Sandbox() {
  const greeting = "Hello, and welcome to the Code Sandbox! 👋";

  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [theme, setTheme] = useState('light');

  const toggleTheme = async () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }

  const handleRun = async () => {
    setOutput('Running...') // Clear output immediately

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
    <div className={`${styles.container} ${styles[theme]}`}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>{greeting} 👨‍💻</h1>
  
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'inherit',
              fontSize: '1.5rem',
            }}
          >
            {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
          </button>
    </div>



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
          className={`${styles.textarea} ${theme === 'dark' ? styles.darkTextArea : ''}`}
        />
      </div>

      <div style={{ marginTop: '1rem' }}>
        <button onClick={handleRun}>Run Code</button>
      </div>

      {output && (
        <div className={`${styles.output} ${theme === 'dark' ? styles.darkOutput : ''}`}>
          <h3>Output:</h3>
          <pre>{output}</pre>
        </div>
      )}
    </div>
  );
}

export default Sandbox;
