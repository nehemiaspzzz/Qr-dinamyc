const express = require('express');
const cors = require('cors');
const path = require('path');
const qrRoutes = require('./routes/qr');
const app = express();

// Configuración CORS
app.use(cors({
    origin: '*',
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

// Ruta para redirección de QR (IMPORTANTE: debe estar después de las rutas API)
app.get('/q/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const db = require('./config/db');
        
        // Obtener la URL de la base de datos
        const qr = await db.get('SELECT url FROM qrs WHERE id = ?', [id]);
        
        if (!qr) {
            return res.status(404).send('QR no encontrado');
        }

        // Asegurar que la URL tenga protocolo
        let finalUrl = qr.url;
        if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
            finalUrl = 'https://' + finalUrl;
        }

        // Redirigir directamente
        res.redirect(finalUrl);
    } catch (error) {
        console.error('Error en redirección:', error);
        res.status(500).send('Error al procesar la redirección');
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});