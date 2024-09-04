document.addEventListener('DOMContentLoaded', function() {
    // Verificar si hay datos almacenados
    const storedUser = localStorage.getItem('storedUser');
    const storedPassword = localStorage.getItem('storedPassword');
    const rememberCheckbox = document.getElementById('remember');

    // Llenar los campos del formulario si hay datos almacenados
    if (storedUser && storedPassword) {
      document.getElementById('username').value = storedUser;
      document.getElementById('password').value = storedPassword;
      rememberCheckbox.checked = true;
    }

    // Manejar el envío del formulario
    document.querySelector('form').addEventListener('submit', function(event) {
      // Guardar datos solo si la casilla de verificación está marcada
      if (rememberCheckbox.checked) {
        localStorage.setItem('storedUser', document.getElementById('username').value);
        localStorage.setItem('storedPassword', document.getElementById('password').value);
      } else {
        // Limpiar datos almacenados si la casilla no está marcada
        localStorage.removeItem('storedUser');
        localStorage.removeItem('storedPassword');
      }
    });
  });

  