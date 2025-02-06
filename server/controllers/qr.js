// server/controllers/qr.js
const QRCode = require('qrcode');
const crypto = require('crypto');
const db = require('../config/db');

// Cambia la URL base para que apunte directamente al servidor
const BASE_URL = 'http://localhost:5000'; // Quita el /api/qr

// Función para generar ID único
const generateUniqueId = () => {
    return crypto.randomBytes(4).toString('hex').toUpperCase();
};

exports.generateQR = async (req, res) => {
    try {
        const { url } = req.body;
        
        if (!url) {
            return res.status(400).json({
                success: false,
                error: 'URL es requerida'
            });
        }

        // Generar ID único
        const uniqueId = generateUniqueId();
        
        // Guardar en base de datos
        await db.run(
            'INSERT INTO qrs (id, url) VALUES (?, ?)',
            [uniqueId, url]
        );

        // Generar URL para el QR
        const qrUrl = `${BASE_URL}/q/${uniqueId}`;
        
        // Generar QR
        const qrImage = await QRCode.toDataURL(qrUrl);

        console.log('QR generado:', {
            id: uniqueId,
            url: url,
            qrUrl: qrUrl
        });

        res.json({
            success: true,
            qrImage,
            id: uniqueId,
            url: url
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

exports.updateQR = async (req, res) => {
    try {
        const { id } = req.params;
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({
                success: false,
                error: 'URL es requerida'
            });
        }

        // Verificar que el QR existe
        const existingQR = await db.get('SELECT * FROM qrs WHERE id = ?', [id]);
        
        if (!existingQR) {
            return res.status(404).json({
                success: false,
                error: 'QR no encontrado'
            });
        }

        // Actualizar URL
        await db.run(
            'UPDATE qrs SET url = ? WHERE id = ?',
            [url, id]
        );

        console.log('QR actualizado:', {
            id: id,
            oldUrl: existingQR.url,
            newUrl: url
        });

        res.json({
            success: true,
            message: 'URL actualizada correctamente',
            id: id,
            newUrl: url
        });

    } catch (error) {
        console.error('Error en actualización:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Para verificar la URL actual de un QR
exports.getQR = async (req, res) => {
    try {
        const { id } = req.params;
        const qr = await db.get('SELECT * FROM qrs WHERE id = ?', [id]);

        if (!qr) {
            return res.status(404).json({
                success: false,
                error: 'QR no encontrado'
            });
        }

        res.json({
            success: true,
            id: qr.id,
            url: qr.url
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Ruta de redirección - Esta es la clave
exports.redirectQR = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Solicitud de redirección para:', id);

        // Obtener la URL actual de la base de datos
        const qr = await db.get('SELECT url FROM qrs WHERE id = ?', [id]);

        if (!qr) {
            return res.status(404).send('QR no encontrado');
        }

        // Asegurar que la URL tenga protocolo
        let finalUrl = qr.url;
        if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
            finalUrl = 'https://' + finalUrl;
        }

        console.log('Redirigiendo a:', finalUrl);
        res.redirect(finalUrl);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error en redirección');
    }
};