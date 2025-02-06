const express = require('express');
const router = express.Router();
const QRController = require('../controllers/qr');

// Rutas de la API
router.post('/generate', QRController.generateQR);
router.put('/update/:id', QRController.updateQR);
router.get('/info/:id', QRController.getQR);

// Ruta de redirección
router.get('/redirect/:id', QRController.redirectQR);

module.exports = router;