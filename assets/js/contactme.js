document.getElementById('contact-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  // Mostrar indicador de carga que el mensaje se esta enviando
  Swal.fire({
      title: 'Sending...',
      text: 'Please wait while we send your message.',
      icon: 'info',
      showConfirmButton: false,
      allowOutsideClick: false
  });

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const subject = document.getElementById('subject').value;
  const message = document.getElementById('message').value;

  try {
      const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, email, subject, message })
      });

      const data = await response.json();

      // Cerrar el mensaje de carga
      Swal.close();

      if (response.ok) {
          Swal.fire({
              title: 'Success!',
              text: 'Email sent successfully',
              icon: 'success',
              confirmButtonText: 'OK'
          });
          document.getElementById('contact-form').reset();
      } else {
          Swal.fire({
              title: 'Error!',
              text: 'Error sending email: ' + data.error,
              icon: 'error',
              confirmButtonText: 'Try Again'
          });
      }
  } catch (error) {
      // Cerrar el mensaje de carga
      Swal.close();
      
      Swal.fire({
          title: 'Error!',
          text: 'Error sending email: ' + error.message,
          icon: 'error',
          confirmButtonText: 'Try Again'
      });
  }
});
