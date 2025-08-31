// Global test setup
process.env.NODE_ENV = 'test';

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Increase timeout for Docker operations
jest.setTimeout(30000);

// Mock Docker availability check
jest.mock('child_process', () => ({
  ...jest.requireActual('child_process'),
  exec: jest.fn((cmd, options, callback) => {
    // Mock Docker command execution
    if (cmd.includes('docker')) {
      setTimeout(() => {
        callback(null, 'Mocked Docker output', '');
      }, 100);
      return { on: jest.fn() };
    }
    // For other commands, use the real exec
    return jest.requireActual('child_process').exec(cmd, options, callback);
  })
}));
