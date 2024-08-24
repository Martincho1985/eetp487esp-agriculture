const express = require('express');
const router = express.Router();
const transporter = require('../utils/mailer'); 

// Ejemplo de ruta de autenticación
router.post('/dasboard', (req, res) => {
  // Lógica para manejar el inicio de sesión
  res.json({ message: 'Login successful' });
});

module.exports = router;
