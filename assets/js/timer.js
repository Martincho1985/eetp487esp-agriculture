var timeLeft = 600; // Tiempo límite en segundos (10 minutos)

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
    alert("¡Se acabó el tiempo! El examen se enviará automáticamente.");
    document.getElementById('exam-form').submit(); // Envía el examen automáticamente
  } else {
    timeLeft--;
  }
}

var timer = setInterval(updateTime, 1000); // Actualiza cada segundo