function confirmDeletion(event, questionId) {
    event.preventDefault(); // Evita el envío inmediato del formulario

    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        customClass: {
            title: 'custom-swal-title',
            htmlContainer: 'custom-swal-text',
            confirmButton: 'custom-swal-button',
            cancelButton: 'custom-swal-button'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            // Muestra el mensaje de éxito y no se cerrará hasta que el usuario haga clic en "OK"
            Swal.fire({
                title: 'Deletion successful',
                text: 'The question has been deleted successfully',
                icon: 'success',
                confirmButtonText: 'OK',
                allowOutsideClick: false,  // Evita que se cierre al hacer clic fuera
                allowEscapeKey: false,      // Evita que se cierre con la tecla "Esc"
                customClass: {
                    title: 'custom-swal-title',
                    htmlContainer: 'custom-swal-text',
                    confirmButton: 'custom-swal-button',
                    cancelButton: 'custom-swal-button'
                }
            }).then(() => {
                // Después de que el usuario confirme el mensaje de éxito, se envía el formulario para eliminar
                document.getElementById(`delete-form-${questionId}`).submit();
            });
        } else {
            // Si cancela, simplemente se queda en la página sin hacer nada
            Swal.fire({
                title: 'Cancelled',
                text: 'Your question is safe!',
                icon: 'error',
                customClass: {
                    title: 'custom-swal-title',
                    htmlContainer: 'custom-swal-text',
                    confirmButton: 'custom-swal-button'
                }
            });
        }
    });
}
