const express = require('express');
const Question = require('../models/Question'); // Suponiendo que tienes un modelo de pregunta
const ExamResult = require('../models/ExamResult');  // Modelo de los resultados del examen
const { isAuthenticated } = require('../middleware/middleware');

const router = express.Router();

//---------------------------VISTAS PARA ROL DOCENTE----------------------------------------
// RUTA PARA OBTENER TODAS LAS PREGUNTAS FILTRADAS EN EL QUESTION BANK ----------------------------------------
router.get('/question-bank', isAuthenticated, async (req, res) => {
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
        options: req.body.options.split(';'),
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
router.get('/new-question', isAuthenticated, (req, res) => {
    // Asegúrate de que req.session.user esté definido
    const user = req.session.user;
    
    // Renderiza la vista y pasa el usuario
    res.render('create-exams/new-question', { user });
});



// RUTA PARA ACCEDER A LA PREGUNTA ESPECIFICA QUE QUIERO EDITAR ------------------------------------------------------
router.get('/edit-question/:id', isAuthenticated, async (req, res) => {
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
        question.options = req.body.options.split(';');
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


//--------------------------------------VISTAS PARA ROL ESTUDIANTE---------------------------------------
// RUTA PARA MOSTRAR CURSOS Y UNIDADES PARA SELECCIONAR EL EXAMN EN CUESTION------------------------------
router.get('/select-exam', isAuthenticated, async (req, res) => {
    try {
        // Obtener todas las preguntas
        const questions = await Question.find().exec();
  
        // Extraer cursos y unidades únicos
        const courses = [...new Set(questions.map(q => q.course))];
        const units = [...new Set(questions.map(q => q.unit))];
  
        // Convertir a objetos adecuados para la vista
        const courseOptions = courses.map(course => ({ name: course, id: course }));
        const unitOptions = units.map(unit => ({ name: unit, id: unit }));

        // Obtener el usuario de la sesión
        const user = req.session.user;
  
        // Renderizar la vista con los cursos y unidades
        res.render('interactive/select-exam', { courses: courseOptions, units: unitOptions, user });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al cargar la página de selección de exámenes');
    }
});



// Ruta para iniciar el examen
router.post('/start-exam', async (req, res) => {
    try {
        const { course, unit } = req.body;

        // Filtrar preguntas por curso y unidad
        let questions = await Question.find({ course: course, unit: unit });

        // Seleccionar 10 preguntas aleatorias
        questions = questions.sort(() => 0.5 - Math.random()).slice(0, 10);

        // Alternar las opciones de respuesta
        questions = questions.map(question => {
            question.options = question.options.sort(() => 0.5 - Math.random());
            return question;
        });

        // Obtener el usuario de la sesión
        const user = req.session.user;

        // Guardar las preguntas seleccionadas en la sesión del usuario para luego calificarlas y mostralas en resultados
        req.session.examQuestions = questions;

        // Renderizar la vista con las preguntas
        res.render('interactive/start-exam', { questions, course, unit, attempts: 1, user });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al cargar el examen");
    }
});


// Ruta para procesar el envío del examen
router.post('/submit-exam', async (req, res) => {
    try {
        const { course, unit, attempts } = req.body;
        let userAnswers = req.body;

        // Eliminar claves innecesarias del body
        delete userAnswers.course;
        delete userAnswers.unit;
        delete userAnswers.attempts;
        delete userAnswers.timeRemaining;

        // Obtener las 10 preguntas evaluadas en la sesión del usuario
        const questions = req.session.examQuestions;

        if (!questions) {
            return res.status(400).send('No se encontraron las preguntas del examen.');
        }

        let correctAnswers = 0;
        let feedback = [];
        let totalQuestions = questions.length;

        // Validar las respuestas
        questions.forEach((question, index) => {
            const userAnswer = question.options[userAnswers[`question_${index}`]]; // Obtener el texto de la opción seleccionada
            const correctAnswer = question.correctAnswer; // Esto es un String
        
            if (userAnswer === correctAnswer) { // Comparar como Strings
                correctAnswers++;
                feedback.push({
                    question: question.question,
                    userAnswer: userAnswer,
                    correctAnswer: correctAnswer,
                    isCorrect: true,
                    feedback: question.feedback
                });
            } else {
                feedback.push({
                    question: question.question,
                    userAnswer: userAnswer,
                    correctAnswer: correctAnswer,
                    isCorrect: false,
                    feedback: question.feedback
                });
            }
        });

        // Calcular la calificación
        const grade = (correctAnswers / totalQuestions) * 10;

        // Verifica que el usuario esté correctamente almacenado en la sesión
        console.log('Usuario logueado:', req.session.user);

        // Obtener el usuario de la sesión
        const user = req.session.user;

        // Buscar si ya existe un registro de este usuario para este curso y unidad
        let examResult = await ExamResult.findOne({ user: user._id, course, unit });

        if (!examResult) {
            // Si no existe un resultado previo, crear uno nuevo
            examResult = new ExamResult({
                user: user._id,
                course,
                unit,
                attempts: 1,
                highestScore: grade,
                lastScore: grade
            });
        } else {
            // Si existe un resultado, actualizarlo
            examResult.attempts += 1;
            examResult.lastScore = grade;
            if (grade > examResult.highestScore) {
                examResult.highestScore = grade;
            }
        }

        // Guardar o actualizar el resultado en la base de datos
        await examResult.save();

        // Renderizar la vista result-exam.ejs con la información de las respuestas y el feedback
        res.render('interactive/result-exam', {
            user,
            course,
            unit,
            attempts: examResult.attempts,
            highestGrade: examResult.highestScore,
            lastGrade: examResult.lastScore,
            questions: feedback
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al procesar el examen.');
    }
});



module.exports = router;
