const express = require('express');
const router = express.Router();
const User = require('../models/User');
const multer = require('multer');
const path = require('path');

// RUTA PARA VER EL PERFIL -----------------------------------------------------------------------------------
router.get('/profile', async (req, res) => {
  try {
    // Suponiendo que el usuario está logueado y el ID del usuario está en la sesión
    const user = await User.findById(req.session.userId);
    
    if (!user) {
      return res.status(404).send('Usuario no encontrado');
    }
    
    res.render('profile', { user }); // Renderiza la vista del perfil con los datos del usuario
  } catch (err) {
    res.status(500).send('Error en el servidor');
  }
});


// DIRECCION DE ALMACENAMIENTO DE LA FOTO DE PERFIL ------------------------------------------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../assets/uploadProfilePics')); //direccion de carpeta del proyecto
  },
  filename: async (req, file, cb) => {
    try {
      const userId = req.session.userId;
      const user = await User.findById(userId); // Usa await aquí

      if (!user) {
        return cb(new Error('Usuario no encontrado'));
      }

      // Usa el username del usuario para renombrar la imagen
      cb(null, `${user.username}-${Date.now()}${path.extname(file.originalname)}`);
    } catch (error) {
      cb(error); // Manejo de errores
    }
  }
});

const upload = multer({ storage });


//RUTA PARA VER LA VISTA DE EDICION  DEL PERFIL------------------------------------------------------------------  
router.get('/profile/edit', async (req, res) => {
  const user = await User.findById(req.session.userId);
  res.render('edit-profile', { user });
});


//RUTA PARA EDITAR PERFIL ---------------------------------------------------------------------------------------
router.post('/profile/edit', upload.single('profilePicture'), async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).send('Usuario no encontrado');
    }

    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;

    // Verifica si se subió una nueva imagen
    if (req.file) {
      user.profilePicture = `/assets/uploadProfilePics/${req.file.filename}`;
      console.log('Imagen guardada en:', user.profilePicture); // Verifica la ruta guardada
    }

    if (user.role === 'student') {
      user.course = req.body.course;
    }

    await user.save();
    res.redirect('/users/profile'); //Aca me redirecciona a la vista del perfil
  } catch (error) {
    console.error('Error al actualizar el perfil:', error);
    res.status(500).send('Error al actualizar el perfil');
  }
});

  
module.exports = router;
