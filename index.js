const express = require('express');
const path = require('path');
const authRoutes = require('./routes/auth'); // Importa las rutas de autenticación
const contactRoutes = require('./routes/contact'); // Mover la lógica de contacto a un módulo separado

const app = express();

// Configurar el puerto
const PORT = 3000;

// Middleware para manejar JSON y datos de formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'pages')));

// Rutas
app.use('/api/auth', authRoutes); // Rutas de autenticación
app.use('/api/contact', contactRoutes); // Rutas de contacto


// Rutas protegidas
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'dashboard.html'));
});
// Ruta para todas las páginas en '/classes'
app.get('/classes/:page', (req, res) => {
  const { page } = req.params;
  res.sendFile(path.join(__dirname, 'pages', 'classes', `${page}.html`));
});
// Ruta para todas las unidades dentro de '/classes/:classNumber'
app.get('/classes/:classNumber/:unit',(req, res) => {
  const { classNumber, unit } = req.params;
  res.sendFile(path.join(__dirname, 'pages', 'classes', classNumber, `${unit}.html`));
});


// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
