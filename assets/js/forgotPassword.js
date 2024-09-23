document.getElementById('forgot-password-form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevenir el envío del formulario por defecto

    const form = event.target;
    const formData = new FormData(form);
    const email = formData.get('email');

    // Mostrar un mensaje de espera
    const waitAlert = Swal.fire({
        title: 'Please wait',
        text: 'Sending password reset email...',
        icon: 'info',
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
        Swal.showLoading();
        },
        customClass: {
          title: 'custom-swal-title',
          htmlContainer: 'custom-swal-text',
          confirmButton: 'custom-swal-button',
          cancelButton: 'custom-swal-button'
        }
    });
  
    try {
      const response = await fetch(form.action, {
        method: form.method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const result = await response.json();

      // Cerrar el mensaje de espera
      Swal.close();

      if (response.ok) {
        // Mostrar SweetAlert de éxito
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Password reset email sent.',
          confirmButtonText: 'OK',
          customClass: {
            title: 'custom-swal-title',
            htmlContainer: 'custom-swal-text',
            confirmButton: 'custom-swal-button',
            cancelButton: 'custom-swal-button'
          }
        }).then(() => {
          // Redirigir al login después de cerrar el SweetAlert
          window.location.href = '/'; // Ajusta la URL según sea necesario
        });
      } else {
        // Manejar error (por ejemplo, usuario no encontrado)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No user found with that email address.',
          customClass: {
            title: 'custom-swal-title',
            htmlContainer: 'custom-swal-text',
            confirmButton: 'custom-swal-button',
            cancelButton: 'custom-swal-button'
          }
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);

      // Cerrar el mensaje de espera
      Swal.close();

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to send the request. Please try again later.',
        customClass: {
          title: 'custom-swal-title',
          htmlContainer: 'custom-swal-text',
          confirmButton: 'custom-swal-button',
          cancelButton: 'custom-swal-button'
        }
      });
    }
});