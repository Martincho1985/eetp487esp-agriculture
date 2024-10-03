const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const authRoutes = require('./routes/auth'); // Importa las rutas de autenticación
const contactRoutes = require('./routes/contact'); // Mover la lógica de contacto a un módulo separado
const questionRoutes = require('./routes/question');
const profileRoutes = require('./routes/perfil');
const userRoutes = require('./routes/userRoutes');
const gradesRoute = require('./routes/grades');

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
  secret: 'u(5RV!wISmXSNLtjUEFlXfNDNwf-(oFE8R3d3F@y}3!dm%Y,"-',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // true para HTTPS en producción
}));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'pages')));

// Rutas
app.use('/api/auth', authRoutes); // Rutas de autenticación
app.use('/api/contact', contactRoutes); // Rutas de contacto
app.use('/', questionRoutes); //Rutas de preguntas del create exams
app.use('/interactive', questionRoutes);
app.use('/', profileRoutes); //Ruta para acceder al profile.ejs y edit-profile.ejs
app.use('/users', userRoutes);
app.use('/users', gradesRoute);
app.use('/assets/uploadProfilePics', express.static(path.join(__dirname, 'assets/uploadProfilePics'))); //middleware para acceder a las imagenes del perfil guardadas en la base de datos para mostrarse en el navegador


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


// Ruta para todas las unidades dentro de '/users'
app.get('/users/:uPage', isAuthenticated, (req, res) => {
  const { uPage } = req.params;
  res.render(`users/${uPage}`, { user: req.session.user });
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

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
