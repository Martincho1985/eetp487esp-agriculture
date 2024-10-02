//AUTORIZACION PARA INGRESAR AL DASHBOARD Y DEMAS VISTAS LUEGO DE LOGUEARSE, CASO CONTRARIO RESTRINGIDO

function isAuthenticated(req, res, next) {
   // Verifica si la sesión y el usuario están presentes
  if (req.session && req.session.userId && req.session.user) {
    console.log('Usuario autenticado:', req.session.user);
    return next();
  }

  res.status(401).send(`
    <html>
      <head>
        <style>
          body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            font-family: Arial, sans-serif;
          }
          .container {
            text-align: center;
          }
          .message1 {
            font-size: 2em;
            font-style: italic;
            color: #ff0000;
            margin-bottom: 20px; /* Espacio entre los mensajes */
          }
          .message2 {
            font-size: 2em;
            font-style: italic;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="message1">Sorry, UNAUTHORIZED ACCESS.</div>
          <div class="message2">You have not logged in or registered yet.</div>
        </div>
      </body>
    </html>
  `);
}

module.exports = {
  isAuthenticated,
};
