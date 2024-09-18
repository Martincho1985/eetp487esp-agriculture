const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const authRoutes = require('./routes/auth'); // Importa las rutas de autenticación
const contactRoutes = require('./routes/contact'); // Mover la lógica de contacto a un módulo separado
const { isAuthenticated } = require('./middleware/middleware');

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
