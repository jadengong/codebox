/**
 * Tests for code formatting utilities
 */
import { formatPython, formatJavaScript, formatCode, isLanguageSupported } from '../codeFormatter';

describe('Code Formatter', () => {
  describe('formatPython', () => {
    test('should format basic Python code with proper indentation', () => {
      const code = `def hello():
print("Hello, World!")
return "done"`;
      
      const formatted = formatPython(code);
      
      expect(formatted).toContain('    print("Hello, World!")');
      expect(formatted).toContain('    return "done"');
    });

    test('should handle empty code', () => {
      expect(formatPython('')).toBe('');
      expect(formatPython(null)).toBe(null);
      expect(formatPython(undefined)).toBe(undefined);
    });

    test('should preserve comments', () => {
      const code = `# This is a comment
def test():
# Another comment
pass`;
      
      const formatted = formatPython(code);
      
      expect(formatted).toContain('# This is a comment');
      expect(formatted).toContain('# Another comment');
    });

    test('should handle complex Python structures', () => {
      const code = `if True:
print("yes")
else:
print("no")
for i in range(10):
print(i)`;
      
      const formatted = formatPython(code);
      
      expect(formatted).toContain('    print("yes")');
      expect(formatted).toContain('    print("no")');
      expect(formatted).toContain('        print(i)');
    });
  });

  describe('formatJavaScript', () => {
    test('should handle empty code', () => {
      expect(formatJavaScript('')).toBe('');
      expect(formatJavaScript(null)).toBe(null);
      expect(formatJavaScript(undefined)).toBe(undefined);
    });

    test('should format basic JavaScript code', () => {
      const code = `function hello(){console.log("Hello, World!");return "done";}`;
      
      const formatted = formatJavaScript(code);
      
      expect(formatted).toContain('console.log("Hello, World!");');
      expect(formatted).toContain('return "done";');
    });
  });

  describe('formatCode', () => {
    test('should route to correct formatter for Python', () => {
      const code = `def test():
print("hello")`;
      
      const formatted = formatCode(code, 'python');
      
      expect(formatted).toContain('    print("hello")');
    });

    test('should route to correct formatter for JavaScript', () => {
      const code = `function test(){console.log("hello");}`;
      
      const formatted = formatCode(code, 'javascript');
      
      expect(formatted).toContain('console.log("hello");');
    });

    test('should handle unsupported languages', () => {
      const code = 'some code';
      const formatted = formatCode(code, 'ruby');
      
      expect(formatted).toBe(code);
    });
  });

  describe('isLanguageSupported', () => {
    test('should return true for supported languages', () => {
      expect(isLanguageSupported('python')).toBe(true);
      expect(isLanguageSupported('py')).toBe(true);
      expect(isLanguageSupported('javascript')).toBe(true);
      expect(isLanguageSupported('js')).toBe(true);
    });

    test('should return false for unsupported languages', () => {
      expect(isLanguageSupported('ruby')).toBe(false);
      expect(isLanguageSupported('go')).toBe(false);
      expect(isLanguageSupported('')).toBe(false);
    });

    test('should be case insensitive', () => {
      expect(isLanguageSupported('PYTHON')).toBe(true);
      expect(isLanguageSupported('JavaScript')).toBe(true);
      expect(isLanguageSupported('PY')).toBe(true);
    });
  });
});
