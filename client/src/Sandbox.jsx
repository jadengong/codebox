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
  const [editorKey, setEditorKey] = useState(0);
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

console.log(greet("Developer"));`,
    
    typescript: `// Welcome to TypeScript! 📘
console.log("Hello, World!");
console.log("Welcome to TypeScript!");

// Calculate the sum of numbers 1 to 10
let sum: number = 0;
for (let i: number = 1; i <= 10; i++) {
    sum += i;
}
console.log(\`Sum of 1 to 10: \${sum}\`);

// Simple function example with types
function greet(name: string): string {
    return \`Hello, \${name}!\`;
}

console.log(greet("Developer"));`,
    
    java: `// Welcome to Java! ☕
System.out.println("Hello, World!");
System.out.println("Welcome to Java!");

// Calculate the sum of numbers 1 to 10
int sum = 0;
for (int i = 1; i <= 10; i++) {
    sum += i;
}
System.out.println("Sum of 1 to 10: " + sum);

// Simple method example
String greet(String name) {
    return "Hello, " + name + "!";
}

System.out.println(greet("Developer"));`,
    
    kotlin: `// Welcome to Kotlin! 🔷
println("Hello, World!")
println("Welcome to Kotlin!")

// Calculate the sum of numbers 1 to 10
val sum = (1..10).sum()
println("Sum of 1 to 10: \$sum")

// Simple function example
fun greet(name: String): String {
    return "Hello, \$name!"
}

println(greet("Developer"))`,
    
    'c++': `// Welcome to C++! ⚡
#include <iostream>
#include <string>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    cout << "Welcome to C++!" << endl;
    
    // Calculate the sum of numbers 1 to 10
    int sum = 0;
    for (int i = 1; i <= 10; i++) {
        sum += i;
    }
    cout << "Sum of 1 to 10: " << sum << endl;
    
    // Simple function example
    string greet(string name) {
        return "Hello, " + name + "!";
    }
    
    cout << greet("Developer") << endl;
    return 0;
}`,
    
    csharp: `// Welcome to C#! 💎
Console.WriteLine("Hello, World!");
Console.WriteLine("Welcome to C#!");

// Calculate the sum of numbers 1 to 10
int sum = 0;
for (int i = 1; i <= 10; i++) {
    sum += i;
}
Console.WriteLine($"Sum of 1 to 10: {sum}");

// Simple function example
string Greet(string name) {
    return $"Hello, {name}!";
}

Console.WriteLine(Greet("Developer"));`,
    
    go: `// Welcome to Go! 🦘
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
    fmt.Println("Welcome to Go!")
    
    // Calculate the sum of numbers 1 to 10
    sum := 0
    for i := 1; i <= 10; i++ {
        sum += i
    }
    fmt.Printf("Sum of 1 to 10: %d\\n", sum)
    
    // Simple function example
    greet := func(name string) string {
        return fmt.Sprintf("Hello, %s!", name)
    }
    
    fmt.Println(greet("Developer"))
}`,
    
    rust: `// Welcome to Rust! 🦀
fn main() {
    println!("Hello, World!");
    println!("Welcome to Rust!");
    
    // Calculate the sum of numbers 1 to 10
    let sum: i32 = (1..=10).sum();
    println!("Sum of 1 to 10: {}", sum);
    
    // Simple function example
    fn greet(name: &str) -> String {
        format!("Hello, {}!", name)
    }
    
    println!("{}", greet("Developer"));
}`,
    
    php: `<?php
// Welcome to PHP! 🐘
echo "Hello, World!\\n";
echo "Welcome to PHP!\\n";

// Calculate the sum of numbers 1 to 10
$sum = 0;
for ($i = 1; $i <= 10; $i++) {
    $sum += $i;
}
echo "Sum of 1 to 10: " . $sum . "\\n";

// Simple function example
function greet($name) {
    return "Hello, " . $name . "!";
}

echo greet("Developer") . "\\n";
?>`,
    
    ruby: `# Welcome to Ruby! 💎
puts "Hello, World!"
puts "Welcome to Ruby!"

# Calculate the sum of numbers 1 to 10
sum = (1..10).sum
puts "Sum of 1 to 10: #{sum}"

# Simple function example
def greet(name)
  "Hello, #{name}!"
end

puts greet("Developer")`,
    
    swift: `// Welcome to Swift! 🍎
print("Hello, World!")
print("Welcome to Swift!")

// Calculate the sum of numbers 1 to 10
let sum = (1...10).reduce(0, +)
print("Sum of 1 to 10: \\(sum)")

// Simple function example
func greet(name: String) -> String {
    return "Hello, \\(name)!"
}

print(greet("Developer"))`
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
    // Force editor re-render to ensure it's properly cleared
    setEditorKey(prev => prev + 1);
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
    const languageMap = {
      'c++': 'cpp',
      'csharp': 'csharp',
      'typescript': 'typescript',
      'kotlin': 'kotlin',
      'go': 'go',
      'rust': 'rust',
      'php': 'php',
      'ruby': 'ruby',
      'swift': 'swift'
    };
    return languageMap[lang] || lang;
  };

  const getBackendLanguage = (lang) => {
    const languageMap = {
      'c++': 'cpp',
      'csharp': 'csharp',
      'typescript': 'typescript',
      'kotlin': 'kotlin',
      'go': 'go',
      'rust': 'rust',
      'php': 'php',
      'ruby': 'ruby',
      'swift': 'swift'
    };
    return languageMap[lang] || lang;
  };

  const getLanguageLabel = (lang) => {
    const labels = {
      'python': '🐍 Python',
      'javascript': '🚀 JavaScript',
      'typescript': '📘 TypeScript',
      'java': '☕ Java',
      'kotlin': '🔷 Kotlin',
      'c++': '⚡ C++',
      'csharp': '💎 C#',
      'go': '🦘 Go',
      'rust': '🦀 Rust',
      'php': '🐘 PHP',
      'ruby': '💎 Ruby',
      'swift': '🍎 Swift'
    };
    return labels[lang] || lang;
  };

  const languageOptions = [
    { value: 'python', label: '🐍 Python' },
    { value: 'javascript', label: '🚀 JavaScript' },
    { value: 'typescript', label: '📘 TypeScript' },
    { value: 'java', label: '☕ Java' },
    { value: 'kotlin', label: '🔷 Kotlin' },
    { value: 'c++', label: '⚡ C++' },
    { value: 'csharp', label: '💎 C#' },
    { value: 'go', label: '🦘 Go' },
    { value: 'rust', label: '🦀 Rust' },
    { value: 'php', label: '🐘 PHP' },
    { value: 'ruby', label: '💎 Ruby' },
    { value: 'swift', label: '🍎 Swift' }
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
      zIndex: 1000,
    }),
    menuList: (base) => ({
      ...base,
      backgroundColor: theme === 'dark' ? '#2d2d2d' : '#fff',
      borderRadius: '8px',
      padding: '4px 0',
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

      {/* Connection Status */}
      <div className={`${styles.connectionStatus} ${styles[`status-${connectionStatus}`]}`}>
        <div className={styles.statusDot}></div>
        <span>{getConnectionStatusText()}</span>
      </div>

      {/* Language Selection */}
      <div className={styles.languageSection}>
        <label className={styles.label}>Programming Language:</label>
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
            menuPlacement="auto"
            menuPosition="absolute"
            closeMenuOnSelect={true}
            blurInputOnSelect={true}
            isClearable={false}
            unstyled={false}
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

      {/* Code Editor Section */}
      <div className={styles.editorSection}>
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
            key={`${language}-${editorKey}`}
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
              Run Code
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

      {/* Language Info */}
      <div className={styles.languageInfo}>
        <h4>Current Language: {getLanguageLabel(language)}</h4>
        <p>
          {language === 'python' && 'Python is great for beginners and data science!'}
          {language === 'javascript' && 'JavaScript powers the modern web!'}
          {language === 'typescript' && 'TypeScript adds static typing to JavaScript!'}
          {language === 'java' && 'Java is perfect for enterprise applications!'}
          {language === 'kotlin' && 'Kotlin is modern, concise, and interoperable with Java!'}
          {language === 'c++' && 'C++ gives you low-level control and high performance!'}
          {language === 'csharp' && 'C# is Microsoft\'s modern, object-oriented language!'}
          {language === 'go' && 'Go is simple, fast, and great for concurrent programming!'}
          {language === 'rust' && 'Rust provides memory safety without garbage collection!'}
          {language === 'php' && 'PHP is widely used for web development!'}
          {language === 'ruby' && 'Ruby emphasizes simplicity and productivity!'}
          {language === 'swift' && 'Swift is Apple\'s modern language for iOS development!'}
        </p>
      </div>
    </div>
  );
}

export default Sandbox;
