// Simple test script to verify rate limiting is working
// Run with: node test-rate-limit.js

const baseUrl = 'http://localhost:3000'

async function testRateLimit() {
  console.log('Testing rate limiting...')
  
  // Test 1: Normal requests (should work)
  console.log('\n1. Testing normal requests (should work):')
  for (let i = 1; i <= 5; i++) {
    try {
      const response = await fetch(`${baseUrl}/api/verses`, {
        headers: {
          'Authorization': 'Bearer test-token',
        },
      })
      console.log(`Request ${i}: ${response.status} ${response.statusText}`)
    } catch (error) {
      console.log(`Request ${i}: Error - ${error.message}`)
    }
  }
  
  // Test 2: Rapid requests (should trigger rate limiting)
  console.log('\n2. Testing rapid requests (should trigger rate limiting):')
  const promises = []
  for (let i = 1; i <= 15; i++) {
    promises.push(
      fetch(`${baseUrl}/api/verses`, {
        headers: {
          'Authorization': 'Bearer test-token',
        },
      }).then(response => ({
        request: i,
        status: response.status,
        statusText: response.statusText
      })).catch(error => ({
        request: i,
        error: error.message
      }))
    )
  }
  
  const results = await Promise.all(promises)
  results.forEach(result => {
    if (result.error) {
      console.log(`Request ${result.request}: Error - ${result.error}`)
    } else {
      console.log(`Request ${result.request}: ${result.status} ${result.statusText}`)
    }
  })
  
  console.log('\nRate limiting test completed!')
}

testRateLimit().catch(console.error)
