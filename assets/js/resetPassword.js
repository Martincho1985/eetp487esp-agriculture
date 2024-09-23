document.getElementById('reset-password-form').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const newPassword = document.getElementById('newPassword').value;
    const repeatNewPassword = document.getElementById('repeatNewPassword').value;
    const token = document.getElementById('token').value;
  
    if (newPassword !== repeatNewPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Password reset error',
        text: 'Passwords do not match',
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

    // Mostrar SweetAlert de espera
    Swal.fire({
      title: 'Please wait...',
      text: 'Resetting your password...',
      background: '#fff',
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      showConfirmButton: false,
      customClass: {
        title: 'custom-swal-title',
        htmlContainer: 'custom-swal-text',
        confirmButton: 'custom-swal-button',
        cancelButton: 'custom-swal-button'
      },
      onBeforeOpen: () => {
        Swal.showLoading();
      }
      
    });

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newPassword, token })
      });
  
      Swal.close(); // Cerrar el SweetAlert de espera

      if (response.ok) {
        // Si el restablecimiento de contraseña es exitoso, redirigir al login o mostrar un mensaje de éxito
        Swal.fire({
          icon: 'success',
          title: 'Password reset successful',
          text: 'Your password has been successfully reset',
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
        // Si hay un error al restablecer la contraseña, mostrar un SweetAlert con el mensaje de error
        const { error } = await response.json();
        Swal.fire({
          icon: 'error',
          title: 'Password reset error',
          text: error || 'An error occurred while resetting the password',
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
      Swal.close(); // Cerrar el SweetAlert de espera en caso de error
      console.error('Error during password reset:', error);
      Swal.fire({
        icon: 'error',
        title: 'Server error',
        text: 'Error connecting to the server',
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
  