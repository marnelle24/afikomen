// Debug script to test rate limiting
const baseUrl = 'http://localhost:3000'

async function testSingleRequest() {
  console.log('Testing single request to /api/verses...')
  
  try {
    const response = await fetch(`${baseUrl}/api/verses`, {
      headers: {
        'Authorization': 'Bearer test-token',
      },
    })
    
    console.log(`Status: ${response.status}`)
    console.log(`Headers:`, Object.fromEntries(response.headers.entries()))
    
    if (response.status === 429) {
      const data = await response.json()
      console.log('Rate limit response:', data)
    }
  } catch (error) {
    console.error('Error:', error.message)
  }
}

testSingleRequest()
