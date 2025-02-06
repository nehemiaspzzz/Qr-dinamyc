import React, { useState } from 'react';
import axios from 'axios';
import './AdminPanel.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/qr';

function AdminPanel() {
  const [qrId, setQrId] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  // Función para verificar el QR actual
  const checkCurrentQR = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/info/${id}`);
      if (response.data.success) {
        setCurrentUrl(response.data.url);
        setError('');
      }
    } catch (err) {
      setError('QR no encontrado');
      setCurrentUrl('');
    }
  };

  // Cuando el usuario ingresa un ID, verificar el QR actual
  const handleIdChange = (e) => {
    const id = e.target.value.trim().toUpperCase();
    setQrId(id);
    if (id.length >= 8) {  // Si el ID tiene la longitud correcta
      checkCurrentQR(id);
    } else {
      setCurrentUrl('');
    }
  };

  const updateQR = async (e) => {
    e.preventDefault();
    if (!qrId || !newUrl) {
      setError('Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.put(`${API_URL}/update/${qrId}`, {
        url: newUrl
      });

      if (response.data.success) {
        setMessage(`URL actualizada exitosamente de ${currentUrl} a ${newUrl}`);
        setCurrentUrl(newUrl);
      }
    } catch (err) {
      console.error('Error al actualizar:', err);
      setError(err.response?.data?.error || 'Error al actualizar el QR');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-panel">
      <h2 className="admin-title">Actualizar QR</h2>
      
      <form onSubmit={updateQR} className="admin-form">
        <div className="form-group">
          <label htmlFor="qrId">ID del QR (8 caracteres)</label>
          <input
            id="qrId"
            type="text"
            value={qrId}
            onChange={handleIdChange}
            placeholder="Ejemplo: 1A2B3C4D"
            maxLength={8}
            className="input-field"
            disabled={loading}
          />
        </div>

        {currentUrl && (
          <div className="current-url">
            URL actual: <span className="url-display">{currentUrl}</span>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="newUrl">Nueva URL</label>
          <input
            id="newUrl"
            type="url"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="https://nueva-url.com"
            className="input-field"
            disabled={loading}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading || !qrId || !newUrl}
          className="update-button"
        >
          {loading ? 'Actualizando...' : 'Actualizar QR'}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}
      {message && <div className="success-message">{message}</div>}
    </div>
  );
}

export default AdminPanel;