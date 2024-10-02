// register.js

document.getElementById('register-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const repeatPassword = document.getElementById('repeat-password').value;
  const role = document.getElementById('role').value;
  const accessCode = document.getElementById('access-code').value;
  
  if (password !== repeatPassword) {
    Swal.fire({
      icon: 'error',
      title: 'Registration Error',
      text: 'Passwords do not match.',
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
    return;
  }

  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, email, password, role, accessCode }) // Enviar el accessCode al servidor
    });

    const result = await response.json();
    if (!response.ok) {
        Swal.fire({
          icon: 'error',
          title: 'Access Code Error',
          text: 'Invalid access code for teacher registration.',
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
        return;
      }

    if (response.ok) {
      // Si el registro es exitoso, redirigir al login o mostrar un mensaje de éxito
      Swal.fire({
        icon: 'success',
        title: 'Registration Successful',
        text: 'Your account has been successfully created.',
        background: '#fff',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
        customClass: {
          title: 'custom-swal-title',
          htmlContainer: 'custom-swal-text',
          confirmButton: 'custom-swal-button',
          cancelButton: 'custom-swal-button'
        }
      }).then(() => {
        window.location.href = '/';
      });
    } else {
      // Si hay un error de registro, mostrar un SweetAlert con el mensaje de error
      const { error } = await response.json();
      Swal.fire({
        icon: 'error',
        title: 'Registration error',
        text: 'User already registered with that email or username.',
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
    console.error('Error durante el registro:', error);
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
