// Mock modules before importing
jest.mock('child_process', () => ({
  exec: jest.fn()
}));

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  writeFileSync: jest.fn(),
  existsSync: jest.fn(),
  unlinkSync: jest.fn(),
  readdirSync: jest.fn(),
  statSync: jest.fn(),
  mkdirSync: jest.fn()
}));

jest.mock('path', () => ({
  ...jest.requireActual('path'),
  join: jest.fn(),
  basename: jest.fn()
}));

// Import after mocking
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { runCodeInDocker, cleanupTempFiles } = require('../codeExecution');

describe('Code Execution Module', () => {
  const mockExec = exec;
  const mockFs = fs;
  const mockPath = path;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default mocks
    mockPath.join.mockReturnValue('/temp/test.js');
    mockFs.existsSync.mockReturnValue(true);
    mockFs.writeFileSync.mockImplementation(() => {});
    mockFs.unlinkSync.mockImplementation(() => {});
  });

  describe('runCodeInDocker', () => {
    it('should validate input parameters', async () => {
      await expect(runCodeInDocker('', 'python')).rejects.toThrow('Code must be a non-empty string');
      await expect(runCodeInDocker(null, 'python')).rejects.toThrow('Code must be a non-empty string');
      await expect(runCodeInDocker('print("hello")', '')).rejects.toThrow('Language must be specified');
      await expect(runCodeInDocker('print("hello")', null)).rejects.toThrow('Language must be specified');
    });

    it('should reject unsupported languages', async () => {
      await expect(runCodeInDocker('print("hello")', 'unsupported')).rejects.toThrow('Unsupported language');
      await expect(runCodeInDocker('console.log("hello")', 'invalid')).rejects.toThrow('Unsupported language');
    });

    it('should handle language aliases correctly', async () => {
      // Mock successful execution
      mockExec.mockImplementation((cmd, options, callback) => {
        callback(null, 'Hello World', '');
        return { on: jest.fn() };
      });

      // Test various aliases
      await expect(runCodeInDocker('print("hello")', 'py')).resolves.toBeDefined();
      await expect(runCodeInDocker('console.log("hello")', 'js')).resolves.toBeDefined();
    });

    it('should execute Python code successfully', async () => {
      const testCode = 'print("Hello, World!")';
      const expectedOutput = 'Hello, World!';
      
      mockExec.mockImplementation((cmd, options, callback) => {
        callback(null, expectedOutput, '');
        return { on: jest.fn() };
      });

      const result = await runCodeInDocker(testCode, 'python');
      
      expect(result).toBe(expectedOutput);
      expect(mockFs.writeFileSync).toHaveBeenCalledWith('/temp/test.js', testCode);
      expect(mockExec).toHaveBeenCalledWith(
        expect.stringContaining('docker run'),
        expect.objectContaining({ timeout: 10000 }),
        expect.any(Function)
      );
    });

    it('should execute JavaScript code successfully', async () => {
      const testCode = 'console.log("Hello, World!");';
      const expectedOutput = 'Hello, World!';
      
      mockExec.mockImplementation((cmd, options, callback) => {
        callback(null, expectedOutput, '');
        return { on: jest.fn() };
      });

      const result = await runCodeInDocker(testCode, 'javascript');
      
      expect(result).toBe(expectedOutput);
      expect(mockFs.writeFileSync).toHaveBeenCalledWith('/temp/test.js', testCode);
      expect(mockExec).toHaveBeenCalledWith(
        expect.stringContaining('docker run'),
        expect.objectContaining({ timeout: 10000 }),
        expect.any(Function)
      );
    });



    it('should handle execution timeout', async () => {
      const testCode = 'print("Hello")';
      
      mockExec.mockImplementation((cmd, options, callback) => {
        const error = new Error('ETIMEDOUT');
        error.code = 'ETIMEDOUT';
        callback(error, '', '');
        return { on: jest.fn() };
      });

      const result = await runCodeInDocker(testCode, 'python');
      
      expect(result).toBe('Execution timed out. Your code took too long to run.');
    });

    it('should handle execution termination', async () => {
      const testCode = 'print("Hello")';
      
      mockExec.mockImplementation((cmd, options, callback) => {
        const error = new Error('SIGTERM');
        error.signal = 'SIGTERM';
        callback(error, '', '');
        return { on: jest.fn() };
      });

      const result = await runCodeInDocker(testCode, 'python');
      
      expect(result).toBe('Execution was terminated due to resource limits.');
    });

    it('should handle execution errors', async () => {
      const testCode = 'print("Hello")';
      const errorMessage = 'Syntax error';
      
      mockExec.mockImplementation((cmd, options, callback) => {
        const error = new Error('Execution failed');
        callback(error, '', errorMessage);
        return { on: jest.fn() };
      });

      const result = await runCodeInDocker(testCode, 'python');
      
      expect(result).toBe(errorMessage);
    });

    it('should handle process errors', async () => {
      const testCode = 'print("Hello")';
      
      mockExec.mockImplementation((cmd, options, callback) => {
        const childProcess = {
          on: jest.fn((event, handler) => {
            if (event === 'error') {
              handler(new Error('Process error'));
            }
          })
        };
        
        // Simulate process error
        setTimeout(() => {
          childProcess.on.mock.calls.forEach(([event, handler]) => {
            if (event === 'error') {
              handler(new Error('Process error'));
            }
          });
        }, 0);
        
        return childProcess;
      });

      const result = await runCodeInDocker(testCode, 'python');
      
      expect(result).toBe('Execution error: Process error');
    });

    it('should clean up temp files after execution', async () => {
      const testCode = 'print("Hello")';
      
      mockExec.mockImplementation((cmd, options, callback) => {
        callback(null, 'Hello', '');
        return { on: jest.fn() };
      });

      await runCodeInDocker(testCode, 'python');
      
      expect(mockFs.unlinkSync).toHaveBeenCalledWith('/temp/test.js');
    });

    it('should clean up temp files on error', async () => {
      const testCode = 'print("Hello")';
      
      mockExec.mockImplementation((cmd, options, callback) => {
        callback(new Error('Execution failed'), '', '');
        return { on: jest.fn() };
      });

      await runCodeInDocker(testCode, 'python');
      
      expect(mockFs.unlinkSync).toHaveBeenCalledWith('/temp/test.js');
    });
  });

  describe('cleanupTempFiles', () => {
    it('should handle cleanup errors gracefully', () => {
      mockFs.readdirSync.mockImplementation(() => {
        throw new Error('Permission denied');
      });

      // Should not throw error
      expect(() => cleanupTempFiles()).not.toThrow();
    });
  });
});
