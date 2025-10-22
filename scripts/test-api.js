#!/usr/bin/env node

/**
 * API Test Script
 * Tests the login API endpoint directly
 */

const fetch = require('node-fetch');

function log(message, type = 'info') {
  const colors = {
    info: '\x1b[36m',    // Cyan
    success: '\x1b[32m', // Green
    warning: '\x1b[33m',  // Yellow
    error: '\x1b[31m',    // Red
    reset: '\x1b[0m'
  };
  
  console.log(`${colors[type]}${message}${colors.reset}`);
}

async function testLoginAPI() {
  log('🌐 API Test Utility', 'info');
  log('==================', 'info');
  
  const baseUrl = 'http://localhost:3000';
  const loginUrl = `${baseUrl}/api/auth/login`;
  
  // Test data - you'll need to use actual credentials
  const testCredentials = {
    email: 'amarasage@gmail.com',
    password: 'your-actual-password' // Replace with actual password
  };
  
  log(`🔄 Testing login API at: ${loginUrl}`, 'info');
  log(`📧 Using email: ${testCredentials.email}`, 'info');
  
  try {
    const response = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testCredentials)
    });
    
    log(`📊 Response status: ${response.status}`, 'info');
    log(`📊 Response headers: ${JSON.stringify(Object.fromEntries(response.headers.entries()))}`, 'info');
    
    const responseText = await response.text();
    log(`📄 Response body: ${responseText}`, 'info');
    
    if (response.ok) {
      log('✅ Login API test successful!', 'success');
    } else {
      log(`❌ Login API test failed with status ${response.status}`, 'error');
    }
    
  } catch (error) {
    log(`❌ API test failed: ${error.message}`, 'error');
    log('💡 Make sure the development server is running (npm run dev)', 'info');
  }
  
  log('\n🎉 API test complete!', 'success');
}

if (require.main === module) {
  testLoginAPI().catch(console.error);
}

module.exports = { testLoginAPI };
