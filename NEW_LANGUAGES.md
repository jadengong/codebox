# Supported Programming Languages in Code Execution Sandbox

## Overview
The code execution sandbox currently supports 2 core programming languages, providing users with essential options for learning and experimenting with different programming paradigms.

## Currently Supported Languages

### 1. **🐍 Python** - Great for beginners and data science
- **File Extension**: `.py`
- **Docker Image**: `python:3.11-slim`
- **Execution**: Direct execution with `python` interpreter
- **Timeout**: 10 seconds
- **Best For**: Beginners, data science, automation, web development

### 2. **🚀 JavaScript** - Powers the modern web
- **File Extension**: `.js`
- **Docker Image**: `node:20-slim`
- **Execution**: Direct execution with `node` runtime
- **Timeout**: 10 seconds
- **Best For**: Web development, server-side programming, full-stack applications

## Technical Implementation

### Backend Changes
- **`codeExecution.js`**: Docker configurations for supported languages
- **`routes/api.js`**: Updated supported languages list
- **`api/execute.js`**: Demo mode support for Vercel deployment
- **`api/health.js`**: Health check endpoints

### Frontend Changes
- **`Sandbox.jsx`**: Language options, examples, and descriptions
- **`LandingPage.jsx`**: Language showcase section
- **Language mapping**: C++ vs cpp identifier handling

### Docker Images
All languages use official, lightweight Docker images:
- **Python**: For Python execution
- **Node.js**: For JavaScript execution

## Code Examples
Each language includes a comprehensive example demonstrating:
- Hello World output
- Basic arithmetic (sum of 1 to 10)
- Function definition and usage
- Language-specific syntax features

## Execution Features
- **Timeout protection**: Each language has appropriate execution timeouts
- **Resource limits**: Docker containers are limited to 100MB RAM and 0.5 CPU cores
- **Error handling**: Comprehensive error messages and fallback responses

## Testing
- All new languages are covered by automated tests
- Tests verify successful execution and proper language identification
- Backend API tests ensure proper language support

## Future Enhancements
Potential areas for future development:
- **Language-specific features**: Syntax highlighting, linting, formatting
- **Package management**: Support for language-specific package managers
- **Performance metrics**: Execution time and memory usage tracking
- **Collaborative features**: Multi-user code sharing and collaboration

## Usage
Users can now select from 2 programming languages in the sandbox interface. Each language provides:
- Syntax highlighting in the Monaco editor
- Appropriate file extensions
- Language-specific code examples
- Descriptive information about the language's strengths
- Proper execution environment with Docker containers

The sandbox serves as a focused platform for learning and experimenting with Python and JavaScript, providing a streamlined experience for web development and general programming.
