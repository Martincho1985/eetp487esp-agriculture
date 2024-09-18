const express = require('express');
const Question = require('../models/Question'); // Suponiendo que tienes un modelo de pregunta
const User = require('../models/User');

const router = express.Router();

// RUTA PARA OBTENER TODAS LAS PREGUNTAS FILTRADAS EN EL QUESTION BANK ----------------------------------------
router.get('/question-bank', async (req, res) => {
    try {
        const { course, unit } = req.query;
        let filter = {};

        if (course) filter.course = course;
        if (unit) filter.unit = unit;

        const questions = await Question.find(filter).sort({ createdAt: -1 }); // Ordena de más reciente a más antiguo
        const user = req.session.user; // Aquí se obtiene el usuario de la sesión
        res.render('create-exams/question-bank', { questions, user }); //Y se obtiene usuario y rol de usuario en el header
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener las preguntas');
    }
});



// RUTA PARA CREAR NUEVAS PREGUNTAS ----------------------------------------------------------------------------
router.post('/new-question', async (req, res) => {
    const question = new Question({
        course: req.body.course,
        unit: req.body.unit,
        question: req.body.question,
        options: req.body.options.split(','),
        correctAnswer: req.body.correctAnswer,
        feedback: req.body.feedback
    });
    try {
        await question.save();
        // Redirige a la página de agregar preguntas con un mensaje de éxito SWEET ALERT
        res.redirect('/new-question?success=true');
    } catch (err) {
        res.status(500).send('Error al guardar la pregunta');
    }
});
// RUTA PARA OBTENER LAS NUEVAS PREGUNTAS
router.get('/new-question', (req, res) => {
    // Asegúrate de que req.session.user esté definido
    const user = req.session.user;
    
    // Renderiza la vista y pasa el usuario
    res.render('create-exams/new-question', { user });
});



// RUTA PARA ACCEDER A LA PREGUNTA ESPECIFICA QUE QUIERO EDITAR ------------------------------------------------------
router.get('/edit-question/:id', async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if (!question) {
            return res.status(404).send('Question not found');
        }
        const user = req.session.user; // Obtener el usuario de la sesión
        res.render('create-exams/edit-question', { question, user }); // Pasar 'user' a la vista
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});
// RUTA PARA ACTUALIZAR / EDITAR PREGUNTA ESPECIFICA
router.put('/edit-question/:id', async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if (!question) {
            return res.status(404).send('Question not found');
        }
        question.course = req.body.course;
        question.unit = req.body.unit;
        question.question = req.body.question;
        question.options = req.body.options.split(',');
        question.correctAnswer = req.body.correctAnswer;
        question.feedback = req.body.feedback;
        await question.save();
        res.redirect('/question-bank');
    } catch (err) {
        res.status(500).send('Error al actualizar la pregunta');
    }
});



// RUTA PARA ELIMINAR UNA PREGUNTA POR SU ID -------------------------------------------------------------------
router.delete('/:id', async (req, res) => {
    try {
        await Question.findByIdAndDelete(req.params.id);
        res.redirect('/question-bank'); // Redirecciona a la lista actualizada de preguntas
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});


module.exports = router;
