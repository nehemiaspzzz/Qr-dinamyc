const { DataTypes } = require('sequelize');
const sequelize = require('../config/config.json'); // Asegúrate de que la ruta sea correcta

const QR = sequelize.define('QR', {
  targetUrl: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = QR;