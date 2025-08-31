import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import styles from './Sandbox.module.css';
import { Sun, Moon } from 'lucide-react';

function Sandbox() {
  const greeting = "Hello, and welcome to the Code Sandbox! 👋";

  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [theme, setTheme] = useState('light');
  const [isRunning, setIsRunning] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('unknown');

  // Default code examples for each language
  const codeExamples = {
    python: `print("Hello, World!")
print("Welcome to Python!")

# Calculate the sum of numbers 1 to 10
sum = 0
for i in range(1, 11):
    sum += i
print(f"Sum of 1 to 10: {sum}")`,
    
    javascript: `console.log("Hello, World!");
console.log("Welcome to JavaScript!");

// Calculate the sum of numbers 1 to 10
let sum = 0;
for (let i = 1; i <= 10; i++) {
    sum += i;
}
console.log(\`Sum of 1 to 10: \${sum}\`);`,
    
    java: `System.out.println("Hello, World!");
System.out.println("Welcome to Java!");

// Calculate the sum of numbers 1 to 10
int sum = 0;
for (int i = 1; i <= 10; i++) {
    sum += i;
}
System.out.println("Sum of 1 to 10: " + sum);`,
    
    'c++': `cout << "Hello, World!" << endl;
cout << "Welcome to C++!" << endl;

// Calculate the sum of numbers 1 to 10
int sum = 0;
for (int i = 1; i <= 10; i++) {
    sum += i;
}
cout << "Sum of 1 to 10: " << sum << endl;`
  };

  // Check backend connection on component mount
  useEffect(() => {
    checkBackendConnection();
  }, []);

  // Load default code when language changes
  useEffect(() => {
    if (!code || code.trim() === '') {
      setCode(codeExamples[language] || '');
    }
  }, [language]);

  const checkBackendConnection = async () => {
    try {
      console.log('[Frontend] Checking backend connection...');
      const response = await fetch('/api/health');
      console.log('[Frontend] Backend response:', response.status, response.ok);
      
      if (response.ok) {
        const data = await response.json();
        console.log('[Frontend] Backend data:', data);
        setConnectionStatus('connected');
      } else {
        console.log('[Frontend] Backend error status:', response.status);
        setConnectionStatus('error');
      }
    } catch (err) {
      console.error('[Frontend] Connection error:', err);
      setConnectionStatus('disconnected');
    }
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const validateCode = () => {
    if (!code.trim()) {
      setOutput('Please enter some code to run.');
      setHasError(true);
      return false;
    }
    
    if (code.trim().length > 10000) {
      setOutput('Code is too long. Maximum length is 10,000 characters.');
      setHasError(true);
      return false;
    }
    
    return true;
  };

  const handleRun = async () => {
    if (!validateCode()) return;
    
    setIsRunning(true);
    setHasError(false);
    setOutput('Running...');

    try {
      console.log('[Frontend] Executing code:', { language, codeLength: code.trim().length });
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: code.trim(), language }),
      });

      const data = await response.json();
      console.log('[Frontend] Execute response:', response.status, data);

      if (response.ok) {
        setOutput(data.result || 'Code executed successfully with no output.');
        setHasError(false);
        setConnectionStatus('connected');
      } else {
        setOutput(data.error || 'Something went wrong.');
        setHasError(true);
      }
    } catch (err) {
      console.error('[Frontend] Execute error:', err);
      setOutput('Failed to connect to backend. Please make sure the server is running.');
      setHasError(true);
      setConnectionStatus('disconnected');
    } finally {
      setIsRunning(false);
    }
  };

  const handleClear = () => {
    setCode('');
    setOutput('');
    setHasError(false);
  };

  const handleLoadExample = () => {
    setCode(codeExamples[language] || '');
    setOutput('');
    setHasError(false);
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return '#28a745';
      case 'disconnected': return '#dc3545';
      case 'error': return '#ffc107';
      default: return '#6c757d';
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Backend Connected';
      case 'disconnected': return 'Backend Disconnected';
      case 'error': return 'Backend Error';
      default: return 'Checking Connection...';
    }
  };

  const languageOptions = [
    { value: 'python', label: 'Python' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'java', label: 'Java' },
    { value: 'c++', label: 'C++' },
  ];

  const customSelectStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: theme === 'dark' ? '#2d2d2d' : '#fff',
      color: theme === 'dark' ? '#fff' : '#000',
      borderColor: theme === 'dark' ? '#555' : '#ccc',
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: theme === 'dark' ? '#2d2d2d' : '#fff',
    }),
    menuList: (base) => ({
      ...base,
      backgroundColor: theme === 'dark' ? '#2d2d2d' : '#fff',
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? theme === 'dark' ? '#444' : '#ddd'
        : state.isFocused
        ? theme === 'dark' ? '#333' : '#eee'
        : theme === 'dark' ? '#2d2d2d' : '#fff',
      color: theme === 'dark' ? '#fff' : '#000',
      cursor: 'pointer',
    }),
    singleValue: (base) => ({
      ...base,
      color: theme === 'dark' ? '#fff' : '#000',
    }),
  };

  return (
    <div className={`${styles.container} ${styles[theme]}`}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
        }}
      >
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

      {/* Connection Status */}
      <div style={{ 
        marginBottom: '1rem', 
        padding: '0.5rem 1rem', 
        backgroundColor: getConnectionStatusColor(),
        color: 'white',
        borderRadius: '5px',
        fontSize: '0.9rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: 'white'
        }}></div>
        {getConnectionStatusText()}
      </div>

      <div className={styles.controls}>
        <label className={styles.label}>Language:</label>
        <div style={{ maxWidth: 'fit-content' }}>
          <Select
            options={languageOptions}
            value={languageOptions.find((opt) => opt.value === language)}
            onChange={(selected) => setLanguage(selected.value)}
            styles={customSelectStyles}
            isSearchable={false}
          />
        </div>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Write your code here..."
          rows={10}
          cols={60}
          className={`${styles.textarea} ${theme === 'dark' ? styles.darkTextArea : ''}`}
          disabled={isRunning}
        />
        <div style={{ 
          marginTop: '0.5rem', 
          fontSize: '0.8rem', 
          color: theme === 'dark' ? '#aaa' : '#666' 
        }}>
          {code.length}/10,000 characters
        </div>
      </div>

      <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button 
          onClick={handleRun} 
          className={styles.runButton}
          disabled={isRunning || !code.trim() || connectionStatus === 'disconnected'}
        >
          {isRunning ? 'Running...' : 'Run Code'}
        </button>
        <button 
          onClick={handleLoadExample}
          style={{
            padding: '0.6rem 1.2rem',
            fontWeight: 'bold',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background 0.3s ease',
          }}
          disabled={isRunning}
        >
          Load Example
        </button>
        <button 
          onClick={handleClear}
          style={{
            padding: '0.6rem 1.2rem',
            fontWeight: 'bold',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background 0.3s ease',
          }}
          disabled={isRunning}
        >
          Clear
        </button>
      </div>

      {output && (
        <div className={`${styles.output} ${theme === 'dark' ? styles.darkOutput : ''} ${hasError ? styles.error : ''}`}>
          <h3>{hasError ? 'Error:' : 'Output:'}</h3>
          <pre>{output}</pre>
        </div>
      )}
    </div>
  );
}

export default Sandbox;
