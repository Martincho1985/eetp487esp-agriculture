const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const authRoutes = require('./routes/auth'); // Importa las rutas de autenticación
const contactRoutes = require('./routes/contact'); // Mover la lógica de contacto a un módulo separado
const questionRoutes = require('./routes/question');
const Question = require('./models/Question');
const { isAuthenticated } = require('./middleware/middleware');
const methodOverride = require('method-override'); //para DELETE preguntas

const app = express();

// Configurar el puerto
const PORT = 3000;

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/miBaseDeDatos487')
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB:',err));

// Middleware para manejar JSON y datos de formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));



// Configuración de sesiones (Da acceso al loguearse)
app.use(session({
  secret: 'tuSecreto',
  resave: false,
  saveUninitialized: false
}));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'pages')));

// Rutas
app.use('/api/auth', authRoutes); // Rutas de autenticación
app.use('/api/contact', contactRoutes); // Rutas de contacto
app.use('/', questionRoutes); //Rutas de preguntas

// Configuración de EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'pages'));


// Rutas protegidas
app.get('/dashboard', isAuthenticated, async (req, res) => {
  const user = req.session.user; // Asumiendo que has guardado el usuario en la sesión
  res.render('dashboard', { user });
});
// Ruta para todas las páginas en '/classes'
app.get('/classes/:page', isAuthenticated, (req, res) => {
  const { page } = req.params;
  res.render(`classes/${page}`, { user: req.session.user });
});

// Ruta para todas las unidades dentro de '/classes/:classNumber'
app.get('/classes/:classNumber/:unit', isAuthenticated, (req, res) => {
  const { classNumber, unit } = req.params;
  res.render(`classes/${classNumber}/${unit}`, { user: req.session.user });
});

// Ruta para todas las páginas en '/classes'
app.get('/create-exams/:page', isAuthenticated, (req, res) => {
  const { page } = req.params;
  res.render(`create-exams/${page}`, { user: req.session.user });
});

//Rutas sin restriccion
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'register.html'));
});

app.get('/forgotPassword', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'forgotPassword.html'));
});

app.get('/reset-password/:token', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'resetPassword.html'));
});

// Ruta para la lista de preguntas
// app.get('/question-bank', async (req, res) => {
//   try {
//       const questions = await Question.find(); // Reemplaza con tu lógica para obtener preguntas
//       const user = req.session.user; // Asegúrate de que el usuario esté en la sesión
//       res.render('create-exams/question-bank', { questions, user }); // Pasa 'user' a la vista
//   } catch (error) {
//       res.status(500).send('Error al obtener las preguntas');
//   }
// });

// Ruta para mostrar los cursos y unidades para seleccionar un examen
app.get('/select-exam', async (req, res) => {
  try {
      // Obtener todas las preguntas
      const questions = await Question.find().exec();

      // Extraer cursos y unidades únicos
      const courses = [...new Set(questions.map(q => q.course))];
      const units = [...new Set(questions.map(q => q.unit))];

      // Convertir a objetos adecuados para la vista
      const courseOptions = courses.map(course => ({ name: course, id: course }));
      const unitOptions = units.map(unit => ({ name: unit, id: unit }));

      // Renderizar la vista con los cursos y unidades
      res.render('interactive/select-exam', { courses: courseOptions, units: unitOptions });
  } catch (error) {
      console.error(error);
      res.status(500).send('Error al cargar la página de selección de exámenes');
  }
});

// Ruta para mostrar los cursos y unidades para seleccionar un examen
app.get('/start-exam', async (req, res) => {
  try {
    // Supongamos que tienes una colección 'Course' en tu base de datos
    const courses = await Course.find(); // Obtiene todos los cursos
    const units = await Unit.find(); // Obtiene todas las unidades

    // Renderiza una vista donde el usuario puede seleccionar el curso y unidad
    res.render('select-exam', { courses, units });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar la página de exámenes');
  }
});

app.post('/start-exam', (req, res) => {
  const { course, unit } = req.body;

  // Lógica para manejar la selección del curso y unidad
  // Ejemplo: buscar preguntas de acuerdo al curso y la unidad seleccionados

  Question.find({ course: course, unit: unit }, (err, questions) => {
      if (err) {
          console.log(err);
          return res.status(500).send('Error al buscar preguntas');
      }

      // Renderiza una vista de examen con las preguntas encontradas
      res.render('interactive/exam', { questions });
  });
});




// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
