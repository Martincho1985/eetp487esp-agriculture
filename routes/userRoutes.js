const express = require('express');
const User = require('../models/User'); // Asegúrate de que la ruta al modelo sea correcta
const router = express.Router();
const { isAuthenticated } = require('../middleware/middleware');

// RUTA PARA FILTRAR TODOS LOS USUARIOS REGISTRADOS EN USERLIST------------------------------------------
router.get('/userList', isAuthenticated, async (req, res) => {
    try {
        const { filterCourse, filterRole } = req.query; // Obtén los filtros del query string
        console.log('Filter Course:', filterCourse); // Agrega esta línea para depurar
        console.log('Filter Role:', filterRole);     // Agrega esta línea para depurar
        
        const query = {};

        // Si se seleccionó un curso, agrega al query
        if (filterCourse) {
            query.course = filterCourse;
        }

        // Si se seleccionó un rol, agrega al query
        if (filterRole) {
            query.role = filterRole;
        }

        // Encuentra los usuarios basados en el filtro
        const users = await User.find(query).sort({ lastName: 1 }); // Ordena alfabéticamente por apellido

        // Renderiza la vista userList y pasa los usuarios como variable
        res.render('users/userList', { users, user: req.session.user });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).send('Error al obtener usuarios');
    }
});


// RUTA PARA ELIMINAR USUARIOS REGISTRADOS-----------------------------------------------
router.delete('/userList/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.redirect('/users/userList'); // Redirige a la lista de usuarios
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).send('Error al eliminar usuario');
    }
});




module.exports = router;
