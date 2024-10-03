// RUTAS DE CALIFICACIONES---------------------------------------------------------------
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const ExamResult = require('../models/ExamResult');
const { isAuthenticated } = require('../middleware/middleware');

// RUTA PARA OBTENER LAS CALIFICACIONES DE CADA USUARIO POR INDIVIDUO -----------------------------------------
router.get('/grades', isAuthenticated, async (req, res) => {
  try {
    // Obtener el usuario logueado de la sesión
    const user = req.session.user;

    // Consultar los resultados de exámenes para ese usuario
    const examResults = await ExamResult.find({ user: user._id }).populate('user');

    // Renderizar la vista 'grades.ejs' con los resultados
    res.render('users/grades', { user, examResults });
  } catch (error) {
    console.error('Error al obtener los resultados de exámenes:', error);
    res.status(500).send('Error del servidor');
  }
});

// RUTA PARA OBTENER TODAS LAS CALIFICACIONES Y FILTRARLAS POR CURSO
router.get('/teacher-grades', isAuthenticated, async (req, res) => {
  try {
    // Obtener el usuario logueado de la sesión (el docente)
    const user = req.session.user;

    // Obtener el parámetro de curso desde la query
    const { course } = req.query;

    // Crear un objeto de filtro dinámico
    let filter = {};
    if (course) {
      filter.course = course;  // Filtrar solo por el curso seleccionado
    }

    // Consultar los resultados de exámenes filtrados por curso y popular con la información del usuario
    const examResults = await ExamResult.find(filter).populate('user');

    // Obtener todos los cursos únicos para mostrar en el filtro
    const allCourses = await ExamResult.distinct('course');

    // Renderizar la vista con los resultados filtrados y los cursos disponibles
    res.render('users/teacher-grades', { user, examResults, allCourses });
  } catch (error) {
    console.error('Error al obtener los resultados de exámenes:', error);
    res.status(500).send('Error del servidor');
  }
});


module.exports = router;
