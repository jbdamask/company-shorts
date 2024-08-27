   // src/api.js
   export const fetchData = async (data) => {
    const response = await fetch('https://your-replit-project.repl.co/api/chat', {
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