import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [url, setUrl] = useState('');
  const [filename, setFilename] = useState('');
  const [downloading, setDownloading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDownloading(true);
    let safeFilename = filename.trim();
    if (!safeFilename.toLowerCase().endsWith('.apkg')) {
      safeFilename += '.apkg';
    }
    const params = new URLSearchParams({ url, filename: safeFilename });
    const downloadUrl = `https://jpdb-api.onrender.com/create_deck?${params}`;

    try {
      const response = await fetch(downloadUrl);
      if (!response.ok) throw new Error('Failed to generate deck');
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', safeFilename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      alert('Error: ' + err.message);
    }
    setDownloading(false);
  };

  return (
    <div>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow">
              <div className="card-body">
                <h1 className="card-title text-center mb-4">
                  JPDB to Anki Deck Generator
                </h1>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="url" className="form-label">JPDB URL</label>
                      <input
                        type="text"
                        id="url"
                        className="form-control"
                        value={url}
                        onChange={e => setUrl(e.target.value)}
                        placeholder="Enter JPDB Vocabulary List URL"
                        required
                      />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="filename" className="form-label">Filename</label>
                    <input
                      type="text"
                      id="filename"
                      className="form-control"
                      value={filename}
                      onChange={e => setFilename(e.target.value)}
                      placeholder="example.apkg"
                      required
                    ></input>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={downloading}
                  >
                    {downloading ? (
                      <>
                        <span
                          className="spiner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Downloading...
                        </>
                    ) : (
                      'Create & Download Deck'
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="mb-3">
        <label htmlFor="url" className="form-label">JPDB URL</label>
        <input
          type="text"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="Enter JPDB URL"
          required
        ></input>
      </div>
      <div className="mb-3">
        <label htmlFor="filename" className="form-label">Filename</label>
        <input
          type="text"
          id="filename"
          className="form-control"
          value={filename}
          onChange={e => setFilename(e.target.value)}
          placeholder="example.apkg"
          required
        />
      </div>
      <button
        type="submit"
        className="btn btn-primary w-100"
        disabled={downloading}
      >
        {downloading ? (
          <>
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
            Downloading...
            </>
        ) : (
          'Create & Download Deck'
        )}
      </button> */}
    </div>
  );
}

export default App;