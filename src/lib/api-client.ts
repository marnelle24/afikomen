// Simplified API client - just regular fetch for now
class APIClient {
  // Convenience methods for common API calls
  async get(url: string, token?: string): Promise<Response> {
    return fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    })
  }

  async post(url: string, data: unknown, token?: string): Promise<Response> {
    return fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
  }
}

export const apiClient = new APIClient()
