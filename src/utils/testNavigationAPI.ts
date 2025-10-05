// Test utility to check the API response format
// This can be used in browser console to debug the API response

export const testNavigationAPI = async (roleId: number = 1) => {
  try {
    const response = await fetch(`/api/secRolePrivilege?roleId=${roleId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    const data = await response.json();
    console.log('Raw API Response:', response);
    console.log('Response Data:', data);
    console.log('Data Type:', typeof data);
    console.log('Is Array:', Array.isArray(data));
    
    if (data && typeof data === 'object') {
      Object.keys(data).forEach(key => {
        console.log(`${key}:`, typeof data[key], Array.isArray(data[key]) ? `(array with ${data[key].length} items)` : '');
      });
    }
    
    return data;
  } catch (error) {
    console.error('API Test Error:', error);
    return null;
  }
};

// Usage in browser console:
// testNavigationAPI(1)