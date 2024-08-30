   // src/api.js
   import config from './config';

   export const fetchData = async (data) => {
    console.log("config.apiUrl:", config.apiUrl);    
    const response = await fetch(`${config.apiUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // ... other headers ...
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };