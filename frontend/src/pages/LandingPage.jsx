import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Code, Play, Zap, Shield, ArrowRight, Github, Terminal } from 'lucide-react';
import '../styles/LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/sandbox');
  };

  const codeExamples = [
    {
      title: "Python Fibonacci",
      language: "python",
      code: `def fib(n):
    if n <= 1:
        return n
    return fib(n-1) + fib(n-2)

print(f"Fibonacci(10): {fib(10)}")`,
      output: "Fibonacci(10): 55"
    },
    {
      title: "JavaScript Array Operations",
      language: "javascript",
      code: `const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
const sum = doubled.reduce((a, b) => a + b, 0);
console.log("Doubled:", doubled);
console.log("Sum:", sum);`,
      output: "Doubled: [ 2, 4, 6, 8, 10 ]\nSum: 30"
    }
  ];

  const steps = [
    { number: 1, icon: <Code size={24} />, title: "Write Code", description: "Type your code in the Monaco editor with full syntax highlighting" },
    { number: 2, icon: <Play size={24} />, title: "Click Run", description: "Execute with Ctrl+Enter or the Run button" },
    { number: 3, icon: <Shield size={24} />, title: "Docker Executes", description: "Code runs in isolated container with resource limits" },
    { number: 4, icon: <Zap size={24} />, title: "See Results", description: "Get instant output or error messages" }
  ];

  const supportedLanguages = [
    { name: "Python", icon: "🐍", description: "Great for beginners and data science" },
    { name: "JavaScript", icon: "🚀", description: "Power the modern web" }
  ];

  return (
    <div className="landing-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Code Execution
              <span className="highlight"> Sandbox</span>
            </h1>
            <p className="hero-subtitle">
              Write, run, and experiment with code in multiple programming languages. 
              No setup required, just pure coding freedom in your browser.
            </p>
            <div className="hero-actions">
              <button onClick={handleStart} className="cta-button">
                <Play size={20} />
                Start Coding Now
                <ArrowRight size={20} />
              </button>
              <a 
                href="https://github.com/jadengong/codebox" 
                target="_blank" 
                rel="noopener noreferrer"
                className="github-button"
              >
                <Github size={20} />
                View on GitHub
              </a>
            </div>
          </div>
          <div className="hero-visual">
            <div className="code-preview">
              <div className="code-header">
                <div className="code-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className="code-title">example.py</span>
              </div>
              <pre className="code-content">
{`# Welcome to Python! 🐍
print("Hello, World!")

# Calculate fibonacci
def fib(n):
    if n <= 1:
        return n
    return fib(n-1) + fib(n-2)

print(f"Fibonacci(10): {fib(10)}")`}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Live Code Examples Section */}
      <section className="examples-section">
        <h2 className="section-title">Live Code Examples</h2>
        <div className="examples-grid">
          {codeExamples.map((example, index) => (
            <div key={index} className="example-card">
              <div className="example-header">
                <h3 className="example-title">{example.title}</h3>
                <span className="example-language">{example.language}</span>
              </div>
              <div className="example-content">
                <div className="example-code-block">
                  <div className="code-header">
                    <div className="code-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <span className="code-title">{example.language === 'python' ? 'example.py' : 'example.js'}</span>
                  </div>
                  <pre className="code-content">{example.code}</pre>
                </div>
                <div className="example-output-block">
                  <div className="output-header">
                    <Terminal size={16} />
                    <span>Output</span>
                  </div>
                  <pre className="output-content">{example.output}</pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-container">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <div className="step-item">
                <div className="step-number">{step.number}</div>
                <div className="step-icon">{step.icon}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="step-arrow">
                  <ArrowRight size={24} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* Languages Section */}
      <section className="languages-section">
        <h2 className="section-title">Supported Languages</h2>
        <div className="languages-grid">
          {supportedLanguages.map((lang, index) => (
            <div 
              key={index} 
              className="language-card"
            >
              <div className="language-icon">{lang.icon}</div>
              <h3 className="language-name">{lang.name}</h3>
              <p className="language-description">{lang.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Start Coding?</h2>
          <p className="cta-subtitle">
            Join thousands of developers who use our sandbox to learn, test, and experiment with code.
          </p>
          <button onClick={handleStart} className="cta-button-large">
            <Play size={24} />
            Get Started Now
            <ArrowRight size={24} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Code Execution Sandbox</h4>
            <p>Built with React, Node.js, and Docker for secure, fast code execution.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><button onClick={handleStart}>Start Coding</button></li>
              <li><a href="https://github.com/jadengong/code-execution-sandbox" target="_blank" rel="noopener noreferrer">GitHub</a></li>
              <li><a href="/docs" target="_blank" rel="noopener noreferrer">Documentation</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Technologies</h4>
            <ul>
              <li>React.js</li>
              <li>Node.js</li>
              <li>Docker</li>
              <li>Express</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Code Execution Sandbox. Built with ❤️ for developers.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
