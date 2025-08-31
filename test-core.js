const { runCodeInDocker } = require('./codeExecution');

async function testCoreFunctionality() {
    console.log('🧪 Testing Core Code Execution Functionality...\n');

    const testCases = [
        {
            language: 'python',
            code: 'print("Hello from Python!")',
            description: 'Basic Python execution'
        },
        {
            language: 'javascript',
            code: 'console.log("Hello from JavaScript!");',
            description: 'Basic JavaScript execution'
        },
        {
            language: 'java',
            code: 'System.out.println("Hello from Java!");',
            description: 'Basic Java execution with auto-wrapping'
        },
        {
            language: 'cpp',
            code: 'cout << "Hello from C++!" << endl;',
            description: 'Basic C++ execution with auto-wrapping'
        }
    ];

    for (const testCase of testCases) {
        console.log(`📝 Testing: ${testCase.description}`);
        console.log(`   Language: ${testCase.language}`);
        console.log(`   Code: ${testCase.code}`);
        
        try {
            const result = await runCodeInDocker(testCase.code, testCase.language);
            console.log(`   ✅ Result: ${result.trim()}`);
        } catch (error) {
            console.log(`   ❌ Error: ${error.message}`);
        }
        console.log('');
    }

    console.log('🎯 Core functionality test completed!');
}

// Run the test if this file is executed directly
if (require.main === module) {
    testCoreFunctionality().catch(console.error);
}

module.exports = { testCoreFunctionality };
