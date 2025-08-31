// Test script to check API endpoints
// Run with: node test-api.js

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

async function testEndpoint(endpoint, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    console.log(`\n🔍 Testing ${method} ${endpoint}...`);
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    
    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log(`Headers:`, Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Response:', JSON.stringify(data, null, 2));
    } else {
      console.log('❌ Error response:', response.statusText);
      try {
        const errorData = await response.json();
        console.log('Error details:', errorData);
      } catch (e) {
        console.log('Could not parse error response');
      }
    }
  } catch (error) {
    console.log(`❌ Request failed: ${error.message}`);
  }
}

async function runTests() {
  console.log(`🚀 Testing API endpoints at: ${BASE_URL}`);
  console.log('=' .repeat(50));

  // Test health endpoint
  await testEndpoint('/api/health');
  
  // Test main API endpoint
  await testEndpoint('/api');
  
  // Test execute endpoint with JavaScript
  await testEndpoint('/api/execute', 'POST', {
    language: 'javascript',
    code: 'console.log("Hello from test!");'
  });
  
  // Test execute endpoint with Python
  await testEndpoint('/api/execute', 'POST', {
    language: 'python',
    code: 'print("Hello from Python test!")'
  });

  console.log('\n' + '=' .repeat(50));
  console.log('✨ Tests completed!');
}

// Run tests
runTests().catch(console.error);
