import React, { useState } from 'react';

function App() {
  const [url, setUrl] = useState('');
  const [filename, setFilename] = useState('');
  const [downloading, setDownloading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDownloading(true);
    // Ensure .apkg extension
    let safeFilename = filename.trim();
    safeFilename += '.apkg';
    const params = new URLSearchParams({ url, filename: safeFilename });
    const downloadUrl = `https://jpdb-api.onrender.com/create_deck?${params}`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', safeFilename);
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
        <br />
        <input
          type="text"
          value={filename}
          onChange={e => setFilename(e.target.value)}
          placeholder="Enter filename"
        />
        <br />
        <button type="submit" disabled={downloading}>
          {downloading ? 'Downloading...' : 'Create & Download Deck'}
        </button>
      </form>
    </div>
  );
}

export default App;