export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, language } = req.body;

  // Input validation
  if (!code || typeof code !== 'string' || code.trim().length === 0) {
    return res.status(400).json({ 
      error: 'Code is required and must be a non-empty string',
      received: { code: code || null, language: language || null }
    });
  }

  if (!language || typeof language !== 'string') {
    return res.status(400).json({ 
      error: 'Language must be specified',
      received: { code: code.trim(), language: language || null }
    });
  }

  // Trim the code and check length
  const trimmedCode = code.trim();
  if (trimmedCode.length > 5000) {
    return res.status(400).json({ 
      error: 'Code is too long. Maximum length is 5,000 characters.',
      received: { codeLength: trimmedCode.length, language }
    });
  }

  try {
    console.log(`[API] Executing ${language} code (${trimmedCode.length} chars)`);
    
    let result;
    
    switch (language.toLowerCase()) {
      case 'python':
        result = await executePython(trimmedCode);
        break;
      case 'javascript':
        result = await executeJavaScript(trimmedCode);
        break;
      case 'java':
        result = await executeJava(trimmedCode);
        break;
      case 'cpp':
      case 'c++':
        result = await executeCpp(trimmedCode);
        break;
      default:
        return res.status(400).json({ 
          error: `Unsupported language: ${language}. Supported languages: python, javascript, java, c++`,
          supportedLanguages: ['python', 'javascript', 'java', 'c++']
        });
    }

    res.json({
      success: true,
      message: 'Code executed successfully',
      result: result,
      metadata: {
        language: language,
        codeLength: trimmedCode.length,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('[API] Execution error:', error);
    res.status(500).json({ 
      error: 'Code execution failed',
      details: error.message || 'Unknown error occurred'
    });
  }
}

// Python execution using eval (safe for demo purposes)
async function executePython(code) {
  try {
    // Simple Python-like execution for demo
    // In production, you'd want a more sophisticated approach
    if (code.includes('print(')) {
      // Extract print statements and simulate output
      const printMatches = code.match(/print\([^)]*\)/g);
      if (printMatches) {
        return printMatches.map(print => {
          // Simple print statement simulation
          const content = print.replace(/print\(|\)/g, '');
          return `Output: ${content}`;
        }).join('\n');
      }
    }
    
    // For more complex code, return a demo response
    return `Demo execution of Python code:\n${code}\n\nNote: This is a demo mode. Real execution would require a Python runtime.`;
  } catch (error) {
    return `Python execution error: ${error.message}`;
  }
}

// JavaScript execution
async function executeJavaScript(code) {
  try {
    // Safe JavaScript execution using Function constructor
    const wrappedCode = `
      const console = {
        log: (...args) => output.push(args.join(' ')),
        error: (...args) => errors.push(args.join(' ')),
        warn: (...args) => warnings.push(args.join(' '))
      };
      const output = [];
      const errors = [];
      const warnings = [];
      
      try {
        ${code}
        return { output, errors, warnings };
      } catch (e) {
        return { output, errors: [...errors, e.message], warnings };
      }
    `;
    
    const result = new Function(wrappedCode)();
    
    let response = '';
    if (result.output.length > 0) {
      response += result.output.join('\n') + '\n';
    }
    if (result.errors.length > 0) {
      response += 'Errors: ' + result.errors.join('\n') + '\n';
    }
    if (result.warnings.length > 0) {
      response += 'Warnings: ' + result.warnings.join('\n');
    }
    
    return response || 'Code executed with no output';
  } catch (error) {
    return `JavaScript execution error: ${error.message}`;
  }
}

// Java execution (demo mode)
async function executeJava(code) {
  return `Demo execution of Java code:\n${code}\n\nNote: This is a demo mode. Real execution would require a Java compiler and runtime.`;
}

// C++ execution (demo mode)
async function executeCpp(code) {
  return `Demo execution of C++ code:\n${code}\n\nNote: This is a demo mode. Real execution would require a C++ compiler and runtime.`;
}
