/**
 * Code formatting utilities for different programming languages
 */

/**
 * Format Python code using basic formatting rules
 * This is a simple formatter that handles indentation and basic spacing
 */
export function formatPython(code) {
  if (!code || typeof code !== 'string') {
    return code;
  }

  const lines = code.split('\n');
  const formattedLines = [];
  let indentLevel = 0;
  const indentChar = '    '; // 4 spaces for Python

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    // Remove trailing whitespace
    line = line.trimEnd();
    
    // Skip empty lines but preserve them
    if (line.length === 0) {
      formattedLines.push('');
      continue;
    }

    // Handle comments - preserve them as-is
    if (line.trim().startsWith('#')) {
      formattedLines.push(line);
      continue;
    }

    // Handle docstrings - preserve them as-is
    if (line.trim().startsWith('"""') || line.trim().startsWith("'''")) {
      formattedLines.push(line);
      continue;
    }

    // Calculate proper indentation
    const trimmedLine = line.trim();
    
    // Decrease indent for certain keywords
    if (trimmedLine.startsWith('else:') || 
        trimmedLine.startsWith('elif ') || 
        trimmedLine.startsWith('except ') || 
        trimmedLine.startsWith('finally:') ||
        trimmedLine.startsWith('except:') ||
        (trimmedLine === 'else:')) {
      indentLevel = Math.max(0, indentLevel - 1);
    }

    // Apply current indentation
    const formattedLine = indentChar.repeat(indentLevel) + trimmedLine;
    formattedLines.push(formattedLine);

    // Increase indent for next line based on current line
    if (trimmedLine.endsWith(':') && 
        !trimmedLine.startsWith('#') && 
        !trimmedLine.includes('"""') && 
        !trimmedLine.includes("'''")) {
      indentLevel++;
    }
  }

  return formattedLines.join('\n');
}

/**
 * Format JavaScript/TypeScript code using basic formatting rules
 * This is a simple formatter that handles basic indentation and spacing
 */
export function formatJavaScript(code) {
  if (!code || typeof code !== 'string') {
    return code;
  }

  try {
    // Basic JavaScript formatting - add semicolons and fix spacing
    let formatted = code;
    
    // Add semicolons where missing (simple cases)
    formatted = formatted.replace(/([^;}])\s*$/gm, '$1;');
    
    // Fix spacing around operators
    formatted = formatted.replace(/([=+\-*/%<>!&|])=/g, ' $1= ');
    formatted = formatted.replace(/([^=!<>])=([^=])/g, '$1 = $2');
    
    // Fix spacing around commas
    formatted = formatted.replace(/,([^\s])/g, ', $1');
    
    // Fix spacing around braces
    formatted = formatted.replace(/\{([^\s])/g, '{\n  $1');
    formatted = formatted.replace(/([^\s])\}/g, '$1\n}');
    
    // Fix spacing around parentheses in function calls
    formatted = formatted.replace(/function\s*\(/g, 'function (');
    formatted = formatted.replace(/if\s*\(/g, 'if (');
    formatted = formatted.replace(/for\s*\(/g, 'for (');
    formatted = formatted.replace(/while\s*\(/g, 'while (');
    
    // Basic indentation for common structures
    const lines = formatted.split('\n');
    const formattedLines = [];
    let indentLevel = 0;
    const indentChar = '  '; // 2 spaces for JavaScript
    
    for (let line of lines) {
      const trimmedLine = line.trim();
      
      // Skip empty lines but preserve them
      if (trimmedLine.length === 0) {
        formattedLines.push('');
        continue;
      }
      
      // Decrease indent for closing braces
      if (trimmedLine.startsWith('}') || trimmedLine.startsWith(']')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      
      // Apply current indentation
      formattedLines.push(indentChar.repeat(indentLevel) + trimmedLine);
      
      // Increase indent for opening braces
      if (trimmedLine.endsWith('{') || trimmedLine.endsWith('[')) {
        indentLevel++;
      }
    }
    
    return formattedLines.join('\n');
  } catch (error) {
    console.warn('Failed to format JavaScript code:', error);
    // Return original code if formatting fails
    return code;
  }
}

/**
 * Main formatting function that routes to appropriate formatter
 */
export function formatCode(code, language) {
  if (!code || !language) {
    return code;
  }

  switch (language.toLowerCase()) {
    case 'javascript':
    case 'js':
      return formatJavaScript(code);
    case 'python':
    case 'py':
      return formatPython(code);
    default:
      console.warn(`No formatter available for language: ${language}`);
      return code;
  }
}

/**
 * Check if a language supports formatting
 */
export function isLanguageSupported(language) {
  const supportedLanguages = ['javascript', 'js', 'python', 'py'];
  return supportedLanguages.includes(language.toLowerCase());
}
