const express = require('express');
const cors = require('cors');
const path = require('path');
const qrRoutes = require('./routes/qr');
const { getDatabase } = require('./config/mongodb');

const app = express();

// Configuración CORS
app.use(cors({
    origin: '*', // En desarrollo, permite todos los orígenes
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Rutas API
app.use('/api/qr', qrRoutes);

// Ruta para redirección de QR
app.get('/q/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const db = await getDatabase();
        
        const qr = await db.collection('qrs').findOne({ id });
        
        if (!qr) {
            return res.status(404).send('QR no encontrado');
        }

        let finalUrl = qr.url;
        if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
            finalUrl = 'https://' + finalUrl;
        }

        res.redirect(finalUrl);
    } catch (error) {
        console.error('Error en redirección:', error);
        res.status(500).send('Error al procesar la redirección');
    }
});

// Ruta de prueba
app.get('/test', async (req, res) => {
    try {
        const db = await getDatabase();
        res.json({ message: 'API y conexión a MongoDB funcionando correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error de conexión a la base de datos' });
    }
});

// Solo inicia el servidor en desarrollo
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
}

module.exports = app; 