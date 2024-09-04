//Mostrar contraseña
function togglePassword(inputId, icon) {
  const passwordInput = document.getElementById(inputId);
  const isPasswordVisible = passwordInput.type === 'password';
  passwordInput.type = isPasswordVisible ? 'text' : 'password';

  // Alterna la clase "visible" en el ícono
  if (isPasswordVisible) {
    icon.classList.add('visible');
  } else {
    icon.classList.remove('visible');
  }
}

function toggleAccessCodeField() {
  const roleSelect = document.getElementById('role');
  const accessCodeContainer = document.getElementById('access-code-container');

  if (roleSelect.value === 'teacher') {
    accessCodeContainer.style.display = 'block';

    // Llamada opcional para cambiar la visibilidad de la contraseña al mostrar el campo
    const accessCodeInput = document.getElementById('access-code');
    const icon = accessCodeContainer.querySelector('.toggle-password');

    // Resetea el campo y la visibilidad del icono al mostrarse
    accessCodeInput.type = 'password';
    icon.classList.remove('visible');

  } else {
    accessCodeContainer.style.display = 'none';
  }
}
