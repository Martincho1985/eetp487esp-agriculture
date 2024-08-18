const express = require('express');
const path = require('path');

const app = express();

// Configurar el puerto
const PORT = 3000;


// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'pages')));


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
