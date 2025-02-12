const express = require('express');
const cors = require('cors');
const path = require('path');
const qrRoutes = require('./routes/qr');
const app = express();

// Configuración CORS (actualiza el origin con tu dominio de frontend en Vercel)
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://tu-frontend-desplegado.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Ruta de prueba
app.get('/test', (req, res) => {
    res.json({ message: 'Servidor funcionando' });
});

// Rutas API
app.use('/api/qr', qrRoutes);

// Ruta para redirección de QR
app.get('/q/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const db = require('./config/db');
        
        const qr = await db.get('SELECT url FROM qrs WHERE id = ?', [id]);
        
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

// Para Vercel
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
}

// Exportar para Vercel
module.exports = app;