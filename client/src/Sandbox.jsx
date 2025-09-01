import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import Editor from '@monaco-editor/react';
import styles from './Sandbox.module.css';
import { Sun, Moon, Play, RotateCcw, FileText, Zap, CheckCircle, AlertCircle, Save, Keyboard } from 'lucide-react';
import LoadingSpinner from './components/LoadingSpinner';

function Sandbox() {
  const greeting = "Hello, and welcome to the Code Sandbox!";

  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [theme, setTheme] = useState('light');
  const [isRunning, setIsRunning] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('unknown');
  const [executionTime, setExecutionTime] = useState(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [editorDimensions, setEditorDimensions] = useState({ width: 400, height: 300 });

  const [isCleared, setIsCleared] = useState(false);

  // Apply theme to body element for background changes
  useEffect(() => {
    // Remove any existing theme classes first
    document.body.classList.remove('light', 'dark');
    document.documentElement.classList.remove('light', 'dark');
    // Add the current theme class
    document.body.classList.add(theme);
    document.documentElement.classList.add(theme);
    console.log('Theme changed to:', theme, 'Body classes:', document.body.className);
  }, [theme]);

  // Apply initial theme on component mount
  useEffect(() => {
    document.body.classList.add(theme);
    document.documentElement.classList.add(theme);
    console.log('Initial theme applied:', theme);
  }, []);

  // Track editor dimensions
  useEffect(() => {
    const editorElement = document.querySelector(`.${styles.codeEditor}`);
    if (!editorElement) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setEditorDimensions({ width: Math.round(width), height: Math.round(height) });
      }
    });

    resizeObserver.observe(editorElement);

    return () => resizeObserver.disconnect();
  }, []);

  // Enhanced code examples for each language
  const codeExamples = {
    python: `# Welcome to Python! 🐍
print("Hello, World!")
print("Welcome to Python!")

# Calculate the sum of numbers 1 to 10
sum = 0
for i in range(1, 11):
    sum += i
print(f"Sum of 1 to 10: {sum}")

# Simple function example
def greet(name):
    return f"Hello, {name}!"

print(greet("Developer"))`,
    
    javascript: `// Welcome to JavaScript! 🚀
console.log("Hello, World!");
console.log("Welcome to JavaScript!");

// Calculate the sum of numbers 1 to 10
let sum = 0;
for (let i = 1; i <= 10; i++) {
    sum += i;
}
console.log(\`Sum of 1 to 10: \${sum}\`);

// Simple function example
function greet(name) {
    return \`Hello, \${name}!\`;
}

console.log(greet("Developer"));`
  };

  // Check backend connection on component mount
  useEffect(() => {
    checkBackendConnection();
  }, []);

  // Watch for when code becomes empty and set isCleared flag
  useEffect(() => {
    if ((!code || code.trim() === '') && !isCleared) {
      console.log('Code became empty, setting isCleared to true');
      setIsCleared(true);
    }
  }, [code, isCleared]);

  // Load default code when language changes
  useEffect(() => {
    // Only auto-load example code if:
    // 1. The code is empty AND
    // 2. The user hasn't intentionally cleared it AND
    // 3. We're not in the middle of clearing
    if ((!code || code.trim() === '') && !isCleared) {
      console.log('Auto-loading example code for language:', language);
      setCode(codeExamples[language] || '');
    }
  }, [language, code, codeExamples, isCleared]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+Enter to run code
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        if (!isRunning && code.trim() && connectionStatus === 'connected') {
          handleRun();
        }
      }
      
    // Ctrl+Shift+S to load example (changed from Ctrl+S to avoid conflict with Monaco's save)
      if (e.ctrlKey && e.shiftKey && e.key === 'S') {
        e.preventDefault();
        handleLoadExample();
      }
      
      // Ctrl+K to show shortcuts
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        setShowShortcuts(!showShortcuts);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isRunning, code, connectionStatus, showShortcuts]);

  const checkBackendConnection = async () => {
    try {
      console.log('[Frontend] Checking backend connection...');
      
      // Try multiple endpoints to determine connection status
      const healthResponse = await fetch('/api/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('[Frontend] Health response:', healthResponse.status, healthResponse.ok);
      
      if (healthResponse.ok) {
        const data = await healthResponse.json();
        console.log('[Frontend] Health data:', data);
        setConnectionStatus('connected');
      } else {
        console.log('[Frontend] Health error status:', healthResponse.status);
        
        // Try the main API endpoint as fallback
        try {
          const apiResponse = await fetch('/api', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          if (apiResponse.ok) {
            console.log('[Frontend] API endpoint working, setting connected');
            setConnectionStatus('connected');
          } else {
            console.log('[Frontend] API endpoint also failed:', apiResponse.status);
            setConnectionStatus('error');
          }
        } catch (apiErr) {
          console.log('[Frontend] API endpoint also failed:', apiErr);
          setConnectionStatus('error');
        }
      }
    } catch (err) {
      console.error('[Frontend] Connection error:', err);
      
      // Check if we're on Vercel by looking at the hostname
      const isVercel = window.location.hostname.includes('vercel.app') || 
                       window.location.hostname.includes('vercel.com');
      
      if (isVercel) {
        console.log('[Frontend] Running on Vercel, connection issue detected');
        setConnectionStatus('error');
      } else {
        setConnectionStatus('disconnected');
      }
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
    setExecutionTime(null);
    const startTime = Date.now();

    try {
      console.log('[Frontend] Executing code:', { language, codeLength: code.trim().length });
      
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: code.trim(), language: getBackendLanguage(language) }),
      });

      console.log('[Frontend] Execute response:', response.status, response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log('[Frontend] Execute data:', data);
        setOutput(data.result || 'Code executed successfully with no output.');
        setHasError(false);
        setConnectionStatus('connected');
        setExecutionTime(Date.now() - startTime);
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.log('[Frontend] Execute error data:', errorData);
        setOutput(errorData.error || `HTTP ${response.status}: Something went wrong.`);
        setHasError(true);
        
        // Update connection status based on error
        if (response.status >= 500) {
          setConnectionStatus('error');
        }
      }
    } catch (err) {
      console.error('[Frontend] Execute error:', err);
      
      // Check if we're on Vercel
      const isVercel = window.location.hostname.includes('vercel.app') || 
                       window.location.hostname.includes('vercel.com');
      
      if (isVercel) {
        setOutput(`Failed to connect to Vercel backend. This might be a deployment issue.
        
Error details: ${err.message}

Please check:
1. Your Vercel deployment is complete
2. API routes are properly configured
3. Try refreshing the page`);
      } else {
        setOutput('Failed to connect to backend. Please make sure the server is running.');
      }
      
      setHasError(true);
      setConnectionStatus('disconnected');
    } finally {
      setIsRunning(false);
    }
  };

  const handleClear = () => {
    console.log('Clear button clicked, clearing code...');
    // Set the cleared flag first to prevent auto-loading
    setIsCleared(true);
    // Clear all the states
    setCode('');
    setOutput('');
    setHasError(false);
    setExecutionTime(null);
    console.log('Code state cleared, new code value:', '');
  };

  const handleLoadExample = () => {
    setIsCleared(false);
    setCode(codeExamples[language] || '');
    setOutput('');
    setHasError(false);
    setExecutionTime(null);
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

  const getMonacoLanguage = (lang) => {
    return lang;
  };

  const getBackendLanguage = (lang) => {
    return lang;
  };

  const getLanguageLabel = (lang) => {
    const labels = {
      'python': '🐍 Python',
      'javascript': '🚀 JavaScript'
    };
    return labels[lang] || lang;
  };

  const languageOptions = [
    { value: 'python', label: '🐍 Python' },
    { value: 'javascript', label: '🚀 JavaScript' }
  ];

  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: theme === 'dark' ? '#2d2d2d' : '#fff',
      color: theme === 'dark' ? '#fff' : '#000',
      borderColor: state.isFocused 
        ? '#d4a574' 
        : theme === 'dark' ? '#555' : '#ccc',
      borderRadius: '8px',
      boxShadow: state.isFocused 
        ? '0 0 0 1px #d4a574' 
        : 'none',
      '&:hover': {
        borderColor: theme === 'dark' ? '#777' : '#999',
      },
      minHeight: '44px',
    }),
              menu: (base) => ({
       ...base,
       backgroundColor: theme === 'dark' ? '#2d2d2d' : '#fff',
       borderRadius: '8px',
       boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
       border: `1px solid ${theme === 'dark' ? '#555' : '#ccc'}`,
       zIndex: 9999,
     }),
         menuList: (base) => ({
       ...base,
       backgroundColor: theme === 'dark' ? '#2d2d2d' : '#fff',
       borderRadius: '8px',
       padding: '4px 0',
       zIndex: 9999,
     }),
         option: (base, state) => ({
       ...base,
       backgroundColor: state.isSelected
         ? theme === 'dark' ? '#444' : '#ddd'
         : state.isFocused
         ? theme === 'dark' ? '#333' : '#eee'
         : 'transparent',
       color: theme === 'dark' ? '#fff' : '#000',
       cursor: 'pointer',
       padding: '12px 16px',
       zIndex: 9999,
       '&:hover': {
         backgroundColor: state.isSelected
           ? theme === 'dark' ? '#444' : '#ddd'
           : theme === 'dark' ? '#333' : '#eee',
       },
     }),
    singleValue: (base) => ({
      ...base,
      color: theme === 'dark' ? '#fff' : '#000',
      fontWeight: '600',
    }),
    input: (base) => ({
      ...base,
      color: theme === 'dark' ? '#fff' : '#000',
    }),
    placeholder: (base) => ({
      ...base,
      color: theme === 'dark' ? '#bbb' : '#666',
    }),
    indicatorSeparator: (base) => ({
      ...base,
      backgroundColor: theme === 'dark' ? '#555' : '#ccc',
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: theme === 'dark' ? '#fff' : '#000',
      '&:hover': {
        color: '#d4a574',
      },
    }),
  };

  return (
    <div className={`${styles.container} ${styles[theme]}`}>
      {/* Header with Theme Toggle */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>{greeting}</h1>
          <p className={styles.subtitle}>Write, run, and experiment with code in multiple languages.</p>
        </div>
        <div className={styles.headerActions}>
          <button
            onClick={() => setShowShortcuts(!showShortcuts)}
            className={styles.shortcutsButton}
            title="Keyboard Shortcuts (Ctrl+K)"
          >
            <Keyboard size={20} />
          </button>
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className={styles.themeToggle}
          >
            {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
          </button>
        </div>
      </div>

      {/* Keyboard Shortcuts Modal */}
      {showShortcuts && (
        <div className={styles.shortcutsModal}>
          <div className={styles.shortcutsContent}>
            <h3>Keyboard Shortcuts</h3>
            <div className={styles.shortcutsList}>
              <div className={styles.shortcutItem}>
                <kbd>Ctrl + Enter</kbd>
                <span>Run Code</span>
              </div>
              <div className={styles.shortcutItem}>
                <kbd>Ctrl + Shift + S</kbd>
                <span>Load Example</span>
              </div>
              <div className={styles.shortcutItem}>
                <kbd>Ctrl + K</kbd>
                <span>Show/Hide Shortcuts</span>
              </div>
            </div>
            <div className={styles.shortcutsNote}>
              <p>💡 The code editor also supports standard shortcuts like Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+Z, etc.</p>
            </div>
            <button 
              onClick={() => setShowShortcuts(false)}
              className={styles.closeButton}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Connection Status - Only show when disconnected */}
      {connectionStatus !== 'connected' && (
        <div className={`${styles.connectionStatus} ${styles[`status-${connectionStatus}`]}`}>
          <div className={styles.statusDot}></div>
          <span>{getConnectionStatusText()}</span>
        </div>
      )}

      {/* Main Editor Container - Wraps editor, language selector, and action buttons */}
      <div className={styles.editorContainer}>
        {/* Code Editor Section */}
        <div className={`${styles.editorSection} ${connectionStatus !== 'connected' ? styles.fullWidth : ''}`}>
          <div className={styles.editorHeader}>
            <h3>Code Editor</h3>
            <div className={styles.editorInfo}>
              <div className={styles.characterCount}>
                {code.length}/10,000 characters
              </div>
              <div className={styles.resizeInfo}>
                💡 Drag to resize • {editorDimensions.width}×{editorDimensions.height}px
              </div>
            </div>
          </div>
          
          <div className={styles.codeEditor}>
            <Editor
              height="100%"
              language={getMonacoLanguage(language)}
              value={code}
              onChange={(value) => {
                const newValue = value || '';
                console.log('Editor onChange:', { newValue, length: newValue.length });
                setCode(newValue);
                
                // If the user manually clears the editor (Ctrl+A + Backspace), 
                // we should also set isCleared to true
                if (newValue === '' && !isCleared) {
                  console.log('Editor manually cleared, setting isCleared to true');
                  setIsCleared(true);
                }
              }}
              theme={theme === 'dark' ? 'vs-dark' : 'vs'}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineHeight: 1.5,
                wordWrap: 'on',
                scrollBeyondLastLine: false,
                padding: { top: 10, bottom: 10 },
                overviewRulerBorder: false,
                overviewRulerLanes: 0,
                scrollbar: {
                  horizontal: 'auto',
                  vertical: 'auto',
                },
                readOnly: isRunning,
                lineNumbers: 'on',
                roundedSelection: false,
                automaticLayout: true,
                fixedOverflowWidgets: true,
              }}
            />
          </div>
        </div>

        {/* Language Selection - Now positioned above the action buttons */}
        {connectionStatus === 'connected' && (
          <div className={styles.languageSection}>
            <label className={styles.label}>Language:</label>
            <div className={styles.selectWrapper}>
              <Select
                key={theme} // Force re-render on theme change
                options={languageOptions}
                value={languageOptions.find((opt) => opt.value === language)}
                onChange={(selected) => {
                  console.log('Language selection changed:', selected);
                  console.log('Selected value:', selected?.value);
                  console.log('Current language state:', language);
                  if (selected && selected.value) {
                    console.log('Setting language to:', selected.value);
                    setIsCleared(false);
                    setLanguage(selected.value);
                    console.log('Language state after setLanguage:', selected.value);
                  } else {
                    console.log('No valid selection:', selected);
                  }
                }}
                styles={customSelectStyles}
                isSearchable={false}
                placeholder="Select language..."
                menuPlacement="bottom"
                menuPosition="absolute"
                closeMenuOnSelect={true}
                blurInputOnSelect={true}
                isClearable={false}
                unstyled={false}
                captureMenuScroll={false}
                classNames={{
                  control: () => 'select-control',
                  menu: () => 'select-menu',
                  option: () => 'select-option',
                }}
                onMenuOpen={() => {
                  console.log('Menu opened, current language:', language);
                  console.log('Available options:', languageOptions);
                }}
                onMenuClose={() => console.log('Menu closed')}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className={styles.actionButtons}>
          <button 
            onClick={handleRun} 
            className={`${styles.runButton} ${isRunning ? styles.running : ''}`}
            disabled={isRunning || !code.trim() || connectionStatus === 'disconnected'}
          >
            {isRunning ? (
              <>
                <LoadingSpinner size="small" color="white" />
                Running...
              </>
            ) : (
              <>
                <Play size={16} />
                Run
              </>
            )}
          </button>
          
          <button 
            onClick={handleLoadExample}
            className={styles.exampleButton}
            disabled={isRunning}
          >
            <FileText size={16} />
            Load Example
          </button>
          
          <button 
            onClick={handleClear}
            className={styles.clearButton}
            disabled={isRunning}
          >
            <RotateCcw size={16} />
            Clear
          </button>
        </div>
      </div>

      {/* Output Section */}
      {output && (
        <div className={`${styles.output} ${hasError ? styles.error : styles.success}`}>
          <div className={styles.outputHeader}>
            <h3>
              {hasError ? (
                <>
                  <AlertCircle size={20} />
                  Error
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  Output
                </>
              )}
            </h3>
            {executionTime && !hasError && (
              <span className={styles.executionTime}>
                <Zap size={14} />
                {executionTime}ms
              </span>
            )}
          </div>
          <pre className={styles.outputContent}>{output}</pre>
        </div>
      )}
    </div>
  );
}

export default Sandbox;
