#!/usr/bin/env node

/**
 * Login API Test Script
 * Tests the actual login API endpoint
 */

const http = require('http');

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

function makeRequest(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: body
        });
      });
    });
    
    req.on('error', (err) => {
      reject(err);
    });
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testLoginAPI() {
  log('🌐 Login API Test', 'info');
  log('================', 'info');
  
  const testData = {
    email: 'amarasage@gmail.com',
    password: 'test123' // This will fail, but we'll see the error
  };
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': JSON.stringify(testData).length
    }
  };
  
  try {
    log('🔄 Testing login API...', 'info');
    log(`📧 Email: ${testData.email}`, 'info');
    
    const response = await makeRequest(options, testData);
    
    log(`📊 Status Code: ${response.statusCode}`, 'info');
    log(`📊 Headers: ${JSON.stringify(response.headers)}`, 'info');
    log(`📄 Response Body: ${response.body}`, 'info');
    
    if (response.statusCode === 200) {
      log('✅ Login API working correctly!', 'success');
    } else if (response.statusCode === 401) {
      log('✅ Login API working (invalid credentials as expected)', 'success');
    } else if (response.statusCode === 500) {
      log('❌ Internal Server Error - this is the issue!', 'error');
      log('📋 Error details:', 'info');
      try {
        const errorData = JSON.parse(response.body);
        log(`  Error: ${errorData.error}`, 'error');
      } catch (e) {
        log(`  Raw response: ${response.body}`, 'error');
      }
    } else {
      log(`⚠️  Unexpected status code: ${response.statusCode}`, 'warning');
    }
    
  } catch (error) {
    log(`❌ Request failed: ${error.message}`, 'error');
    log('💡 Make sure the development server is running on port 3000', 'info');
  }
  
  log('\n🎉 Login API test complete!', 'success');
}

if (require.main === module) {
  testLoginAPI().catch(console.error);
}

module.exports = { testLoginAPI };
