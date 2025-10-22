// Test script to verify dashboard API calls work
const baseUrl = 'http://localhost:3000'

async function testDashboardAPIs() {
  console.log('Testing dashboard API calls...')
  
  const testToken = 'test-token-123'
  
  // Test 1: Dashboard stats
  console.log('\n1. Testing /api/dashboard...')
  try {
    const response = await fetch(`${baseUrl}/api/dashboard`, {
      headers: {
        'Authorization': `Bearer ${testToken}`,
      },
    })
    console.log(`Status: ${response.status}`)
    if (response.status === 429) {
      const data = await response.json()
      console.log('Rate limit response:', data)
    }
  } catch (error) {
    console.error('Error:', error.message)
  }
  
  // Test 2: Verses endpoint
  console.log('\n2. Testing /api/verses...')
  try {
    const response = await fetch(`${baseUrl}/api/verses`, {
      headers: {
        'Authorization': `Bearer ${testToken}`,
      },
    })
    console.log(`Status: ${response.status}`)
    if (response.status === 429) {
      const data = await response.json()
      console.log('Rate limit response:', data)
    }
  } catch (error) {
    console.error('Error:', error.message)
  }
  
  // Test 3: Multiple rapid requests
  console.log('\n3. Testing multiple rapid requests...')
  const promises = []
  for (let i = 1; i <= 5; i++) {
    promises.push(
      fetch(`${baseUrl}/api/verses`, {
        headers: {
          'Authorization': `Bearer ${testToken}`,
        },
      }).then(response => ({
        request: i,
        status: response.status
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
      console.log(`Request ${result.request}: ${result.status}`)
    }
  })
}

testDashboardAPIs().catch(console.error)
