// In src/App.js
import React, { useState } from 'react';

function App() {
  const [url, setUrl] = useState('');
  const [message, setMessage] = useState('');
  const [count, setCount] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const params = new URLSearchParams({ url });
    const response = await fetch(`http://localhost:8000/create_deck?${params}`);
    const data = await response.json();
    setMessage(data.message);
    setCount(data.count);
  };

  return (
    <div>
      <h1>JPDB to Anki Deck Generator</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="Enter JPDB URL"
        />
        <button type="submit">Create Deck</button>
      </form>
      {message && <p>{message} ({count} words)</p>}
    </div>
  );
}

export default App;