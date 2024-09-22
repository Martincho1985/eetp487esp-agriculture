const express = require('express');
const User = require('../models/User');
const PasswordResetToken = require('../models/PasswordResetToken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const transporter = require('../utils/mailer');

const router = express.Router();

// RUTA DE REGISTRO-------------------------------------------------------------------------------------------
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({ error: 'Usuario ya registrado con ese email o nombre de usuario' });
    }

    const user = new User({ username, email, password });
    await user.save();
    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// RUTA DE INICIO DE SESSION ---------------------------------------------------------------------------------
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Datos de inicio de sesión recibidos:', { username });

  try {
    // Buscar al usuario por nombre de usuario
    const user = await User.findOne({ username });
    if (!user) {
      console.log('Usuario no encontrado');
      return res.status(401).json({ error: 'Nombre de usuario o contraseña incorrectos' });
    }

    // Verificar la contraseña utilizando el método comparePassword
    const isPasswordValid = await user.comparePassword(password);
    console.log('Contraseña válida:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('Contraseña incorrecta');
      return res.status(401).json({ error: 'Nombre de usuario o contraseña incorrectos' });
    }

    // Guardar el ID de usuario y otros detalles (nombre de usuario, rol) en la sesión
    req.session.userId = user._id;
    req.session.user = {
      username: user.username,
      role: user.role,  // Guardar el rol del usuario para poder usarlo en otras partes de la aplicación
    };

    console.log('Inicio de sesión exitoso');
    res.status(200).json({ message: 'Login exitoso' });
  } catch (err) {
    console.error('Error al iniciar sesión:', err);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

// RUTA DE LOGOUT --------------------------------------------------------------------------------------------
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: 'Error al cerrar sesión' });
    }
    res.clearCookie('connect.sid'); // Elimina la cookie de la sesión
    res.redirect('/'); // Redirige al usuario a la página de login
  });
});

// RUTA PARA SOLICITAR RESTABLECIMIENTO DE CONTRASEÑA ---------------------------------------------------------
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'No se encontró un usuario con ese correo electrónico' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const resetToken = new PasswordResetToken({ userId: user._id, token });
    await resetToken.save();

    const resetLink = `http://localhost:3000/reset-password/${token}`;
    const mailOptions = {
      from: 'englishcultivatehub@gmail.com',
      to: user.email,
      subject: 'Restablecimiento de contraseña',
      text: `Haga clic en el siguiente enlace para restablecer su contraseña: ${resetLink}`
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Correo de restablecimiento de contraseña enviado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al solicitar el restablecimiento de contraseña' });
  }
});

// RUTA PARA PROCESAR EL RESTABLECIEMINTO DE CONTRASEÑA --------------------------------------------------------
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    // Busca el token en la base de datos
    const resetToken = await PasswordResetToken.findOne({ token });
    if (!resetToken) {
      return res.status(400).json({ error: 'Token inválido o expirado' });
    }

    // Busca el usuario asociado al token
    const user = await User.findById(resetToken.userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Actualiza la contraseña del usuario
    user.password = newPassword; // Asigna la nueva contraseña
    await user.save(); // Guarda el usuario actualizado

    // Elimina el token después de usarlo
    await resetToken.deleteOne();

    res.status(200).json({ message: 'Contraseña restablecida exitosamente' });
  } catch (error) {
    console.error('Error al restablecer la contraseña:', error);
    res.status(500).json({ error: 'Error al restablecer la contraseña' });
  }
});

module.exports = router;

