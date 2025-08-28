import React, { useState } from 'react';

function App() {
  const [url, setUrl] = useState('');
  const [downloading, setDownloading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDownloading(true);
    const params = new URLSearchParams({ url });
    // Create a temporary link and click it to trigger download
    const downloadUrl = `http://localhost:8000/create_deck?${params}`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', 'jpdb_vocab.apkg'); // optional, for hinting filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloading(false);
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
        <button type="submit" disabled={downloading}>
          {downloading ? 'Downloading...' : 'Create & Download Deck'}
        </button>
      </form>
    </div>
  );
}

export default App;