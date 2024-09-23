document.getElementById('updateQuestionBtn').addEventListener('click', function (event) {
    event.preventDefault(); // Evitar la acción predeterminada del formulario

    // Obtener la referencia del formulario
    const form = event.target.closest('form');

    // Enviar el formulario con fetch API usando el método PUT
    fetch(form.action, {
        method: 'POST', // Usamos POST porque tienes `_method=PUT` en la ruta
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(new FormData(form)) // Formatear el cuerpo como URL-encoded
    })
    .then(response => {
        if (response.ok) {
            // Mostrar el SweetAlert si la actualización es exitosa
            Swal.fire({
                icon: 'success',
                title: 'Update Successful',
                text: 'The question has been updated successfully.',
                confirmButtonText: 'OK',
                customClass: {
                    title: 'custom-swal-title',
                    htmlContainer: 'custom-swal-text',
                    confirmButton: 'custom-swal-button',
                    cancelButton: 'custom-swal-button'
                }
            }).then(() => {
                // Redirigir al usuario a la página de question-bank
                window.location.href = '/question-bank';
            });
        } else {
            // Manejar errores si ocurre algún problema
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'There was an issue updating the question.',
                customClass: {
                    title: 'custom-swal-title',
                    htmlContainer: 'custom-swal-text',
                    confirmButton: 'custom-swal-button',
                    cancelButton: 'custom-swal-button'
                }
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'There was a problem processing the request.',
            customClass: {
                title: 'custom-swal-title',
                htmlContainer: 'custom-swal-text',
                confirmButton: 'custom-swal-button',
                cancelButton: 'custom-swal-button'
            }
        });
    });
});
