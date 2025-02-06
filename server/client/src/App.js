import React, { useState } from 'react';
import './App.css';

const DynamicQRGenerator = () => {
  const [url, setUrl] = useState('');
  const [qrId, setQrId] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('create');
  const [savedId, setSavedId] = useState('');

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
    setError('');
  };

  const handleIdChange = (e) => {
    setQrId(e.target.value);
    setError('');
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setError('');
    setQrCode('');
  };

  const generateQR = async () => {
    if (!url) {
      setError('Por favor ingresa una URL');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const endpoint = mode === 'create' 
        ? 'http://localhost:5000/api/qr/generate'
        : `http://localhost:5000/api/qr/update/${qrId}`;

      const response = await fetch(endpoint, {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }) // <--- Solo envía la URL
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error del servidor');
      }

      setQrCode(data.qrImage);
      if (mode === 'create' && data.id) {
        setSavedId(data.id);
      }
    } catch (error) {
      console.error('Error:', error);
      setError(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="glass-card">
        <h1 className="app-title">
          <span className="gradient-text">QR Generator</span>
        </h1>

        <div className="mode-selector">
          <button
            className={`mode-button ${mode === 'create' ? 'active' : ''}`}
            onClick={() => handleModeChange('create')}
          >
            Crear QR
          </button>
          <button
            className={`mode-button ${mode === 'update' ? 'active' : ''}`}
            onClick={() => handleModeChange('update')}
          >
            Actualizar QR
          </button>
        </div>

        <div className="form-container">
          {mode === 'update' && (
            <div className="input-group">
              <input
                type="text"
                value={qrId}
                onChange={handleIdChange}
                placeholder="ID del QR"
                className="input-field"
              />
            </div>
          )}

          <div className="input-group">
            <input
              type="url"
              value={url}
              onChange={handleUrlChange}
              placeholder="https://ejemplo.com"
              className="input-field"
            />
          </div>

          <button
            onClick={generateQR}
            disabled={loading}
            className="generate-button"
          >
            {loading ? (
              <div className="spinner" />
            ) : (
              mode === 'create' ? 'Generar QR' : 'Actualizar QR'
            )}
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {mode === 'create' && savedId && (
          <div className="success-message">
            QR generado con éxito. ID: <span className="code-id">{savedId}</span>
          </div>
        )}

        {qrCode && (
          <div className="qr-result-container">
            <div className="qr-preview-card">
              <img 
                src={qrCode} 
                alt="Generated QR Code" 
                className="qr-image" 
              />
              <div className="download-section">
                <a 
                  href={qrCode} 
                  download="mi-qr-dinamico.png"
                  className="download-button"
                >
                  Descargar QR
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicQRGenerator;