const express = require('express');
const router = express.Router();
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); 
const { isAuthenticated } = require('../middleware/middleware');
require('dotenv').config();


const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// RUTA PARA VER EL PERFIL -----------------------------------------------------------------------------------
router.get('/profile', isAuthenticated, async (req, res) => {
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
const cloudinaryStorage = require('multer-storage-cloudinary').CloudinaryStorage;

const storage = new cloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'profile_pics', // Carpeta en Cloudinary donde almacenarás las imágenes
    format: async (req, file) => {
      // Verificamos la extensión original del archivo para decidir el formato
      const ext = file.mimetype.split('/')[1]; // Obtiene la extensión del archivo desde el MIME type
      if (ext === 'png' || ext === 'jpg' || ext === 'jpeg') {
        return ext; // Retorna la extensión si es válida (png, jpg o jpeg)
      }
      return 'png'; // Valor por defecto
    },
    public_id: (req, file) => `${req.session.userId}-${Date.now()}`, // Nombre único para la imagen
  },
});

const upload = multer({ storage });


//RUTA PARA VER LA VISTA DE EDICION  DEL PERFIL------------------------------------------------------------------  
router.get('/profile/edit', isAuthenticated, async (req, res) => {
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
      // Si el usuario ya tiene una imagen de perfil, elimina la imagen anterior de Cloudinary
      if (user.profilePicture) {
        // Extraer el public_id de Cloudinary desde la URL de la imagen anterior
        const public_id = user.profilePicture.split('/').slice(-2).join('/').split('.')[0]; 
        // Esto extrae: profile_pics/66b8d4d09e950a169c479d22-1728394721818

        await cloudinary.uploader.destroy(public_id); // Elimina la imagen anterior de Cloudinary
      }

      // Guarda la nueva imagen desde Cloudinary
      user.profilePicture = req.file.path; // La URL pública de la imagen subida en Cloudinary
    }

    if (user.role === 'student') {
      user.course = req.body.course;
    }

    await user.save();

    // ACTUALIZA LA SESIÓN DEL USUARIO CON LOS NUEVOS DATOS Y SE ACTUALIZA LA FOTO DE PERFIL EN EL MOMENTO
    req.session.userId = user._id; // Asegúrate de que el ID esté en la sesión
    req.session.user = user; // Actualiza toda la información del usuario en la sesión

    // Redirige a la vista del perfil
    res.redirect('/users/profile'); 
  } catch (error) {
    console.error('Error al actualizar el perfil:', error);
    res.status(500).send('Error al actualizar el perfil');
  }
});


// RUTA PARA RESTABLECER LA FOTO DE PERFIL POR DEFECTO ----------------------------------------------------
router.post('/profile/reset-photo', async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).send('Usuario no encontrado');
    }

    // Establece la imagen por defecto
    const defaultPhotoPath = '/img/pngwing.png';

    // Si el usuario ya tiene una imagen de perfil en Cloudinary, eliminarla
    if (user.profilePicture && user.profilePicture !== defaultPhotoPath) {
      // Extraer el public_id de la imagen actual de Cloudinary
      const public_id = user.profilePicture.split('/').slice(-2).join('/').split('.')[0]; 
      // Elimina la imagen de Cloudinary
      await cloudinary.uploader.destroy(public_id); 
    }

    // Asignar la imagen por defecto al usuario
    user.profilePicture = defaultPhotoPath;

    await user.save();

    // ACTUALIZA LA SESIÓN DEL USUARIO CON LOS NUEVOS DATOS Y SE ACTUALIZA LA FOTO DE PERFIL EN EL MOMENTO
    req.session.userId = user._id; // Asegúrate de que el ID esté en la sesión
    req.session.user = user; // Actualiza toda la información del usuario en la sesión

    // Redirigir al perfil del usuario
    res.redirect('/users/profile');
  } catch (error) {
    console.error('Error al restablecer la foto:', error);
    res.status(500).send('Error al restablecer la foto');
  }
});

  
module.exports = router;
