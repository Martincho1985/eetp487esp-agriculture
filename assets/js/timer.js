var timeLeft = 1200; // Tiempo límite en segundos (20 minutos)

function updateTime() {
  var minutes = Math.floor(timeLeft / 60);
  var seconds = timeLeft % 60;
  document.getElementById('timeRemaining').value = timeLeft;

  // Mostrar el temporizador en el formato MM:SS
  document.getElementById('timer').textContent = "Tiempo restante: " + 
    (minutes < 10 ? "0" + minutes : minutes) + ":" + 
    (seconds < 10 ? "0" + seconds : seconds);

  if (timeLeft <= 0) {
    clearInterval(timer);
    // Mostrar alerta de SweetAlert2 cuando el tiempo se acaba
    Swal.fire({
      title: 'Time is up!',
      text: 'The exam will be submitted automatically.',
      icon: 'warning',
      showConfirmButton: false,
      timer: 5000, // Duración de la alerta (5 segundos)
      customClass: {
        title: 'custom-swal-title',
        htmlContainer: 'custom-swal-text',
        confirmButton: 'custom-swal-button',
        cancelButton: 'custom-swal-button'
      },
      willClose: () => {
          // Después de cerrar la alerta, enviar el examen
          document.getElementById('exam-form').submit();
      }
  });
  } else {
    timeLeft--;
  }
}

var timer = setInterval(updateTime, 1000); // Actualiza cada segundo