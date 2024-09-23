// login.js

document.getElementById('login-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    if (response.ok) {
      // Si el login es exitoso, redirigir al dashboard
      window.location.href = '/dashboard';
    } else {
      // Si el login falla, mostrar un SweetAlert con el mensaje de error
      const { error } = await response.json();
      Swal.fire({
        icon: 'error',
        title: 'Error logging in',
        text: 'Incorrect username or password',
        background: '#fff',
        confirmButtonColor: '#d33',
        confirmButtonText: 'OK',
        customClass: {
          title: 'custom-swal-title',
          htmlContainer: 'custom-swal-text',
          confirmButton: 'custom-swal-button',
          cancelButton: 'custom-swal-button'
        }
      });
    }
  } catch (error) {
    console.error('Error durante el inicio de sesión:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error de servidor',
      text: 'Error al conectar con el servidor',
      background: '#fff',
      confirmButtonColor: '#d33',
      confirmButtonText: 'OK',
      customClass: {
        title: 'custom-swal-title',
        htmlContainer: 'custom-swal-text',
        confirmButton: 'custom-swal-button',
        cancelButton: 'custom-swal-button'
      }
    });
  }
});
