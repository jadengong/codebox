const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Code Execution Sandbox Development Environment...\n');

// Function to start a service
function startService(name, command, args, cwd) {
    console.log(`📡 Starting ${name}...`);
    
    const child = spawn(command, args, {
        cwd: cwd || process.cwd(),
        stdio: 'pipe',
        shell: true
    });

    child.stdout.on('data', (data) => {
        console.log(`[${name}] ${data.toString().trim()}`);
    });

    child.stderr.on('data', (data) => {
        console.log(`[${name} ERROR] ${data.toString().trim()}`);
    });

    child.on('close', (code) => {
        console.log(`[${name}] Process exited with code ${code}`);
    });

    return child;
}

console.log('🔧 Building React app and starting backend...');
console.log('📱 React app will run on http://localhost:3000');
console.log('🔌 Backend API will run on http://localhost:5000');
console.log('🌐 Frontend will proxy API calls to backend automatically\n');

// Build the React app first, then start the backend
const buildProcess = startService('Build', 'npm', ['run', 'build']);

buildProcess.on('close', (code) => {
    if (code === 0) {
        console.log('\n✅ React app built successfully!');
        console.log('🚀 Starting backend server...\n');
        
        const backend = startService('Backend', 'npm', ['start']);
        
        // Handle process termination
        process.on('SIGINT', () => {
            console.log('\n🛑 Shutting down backend...');
            backend.kill();
            process.exit(0);
        });
    } else {
        console.error('\n❌ Failed to build React app. Exiting...');
        process.exit(1);
    }
});
