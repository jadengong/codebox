import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code, Play, Zap, Shield, Globe, ArrowRight, Github, ExternalLink } from 'lucide-react';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleStart = () => {
    navigate('/sandbox');
  };

  const features = [
    {
      icon: <Code size={32} />,
      title: "Multi-Language Support",
      description: "Write code in Python, JavaScript, Java, and C++ with full syntax highlighting and auto-completion."
    },
    {
      icon: <Shield size={32} />,
      title: "Secure Execution",
      description: "Your code runs in isolated Docker containers with no persistent state or access to your system."
    },
    {
      icon: <Zap size={32} />,
      title: "Instant Results",
      description: "Get real-time output and execution feedback. Perfect for testing snippets and learning new languages."
    },
    {
      icon: <Globe size={32} />,
      title: "Web-Based",
      description: "No installations required. Run code directly in your browser from anywhere in the world."
    }
  ];

  const supportedLanguages = [
    { name: "Python", icon: "🐍", description: "Great for beginners and data science" },
    { name: "JavaScript", icon: "🚀", description: "Power the modern web" },
    { name: "Java", icon: "☕", description: "Enterprise applications and Android" },
    { name: "C++", icon: "⚡", description: "High-performance systems programming" }
  ];

  return (
    <div className={`landing-container ${isVisible ? 'visible' : ''}`}>
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

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Why Choose Our Sandbox?</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="feature-icon">
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
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
              style={{ animationDelay: `${index * 0.1}s` }}
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
