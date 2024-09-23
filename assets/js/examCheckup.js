document.getElementById('exam-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevenir el envío del formulario inicialmente

    // Contador de respuestas sin marcar
    let unanswered = 0;

    // Seleccionar todas las preguntas
    const questions = document.querySelectorAll('.question');

    // Recorrer las preguntas para verificar si alguna no ha sido respondida
    questions.forEach((question, index) => {
        const options = document.getElementsByName(`question_${index}`);
        let isAnswered = false;

        // Verificar si alguna opción está seleccionada
        options.forEach((option) => {
            if (option.checked) {
                isAnswered = true;
            }
        });

        // Si ninguna opción está seleccionada, incrementar el contador de no respondidas
        if (!isAnswered) {
            unanswered++;
        }
    });

    // Si hay respuestas sin marcar, mostrar alerta con SweetAlert
    if (unanswered > 0) {
        Swal.fire({
            title: 'Unanswered Questions',
            text: `There are ${unanswered} unanswered questions. Please review before submitting.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Submit Anyway',
            cancelButtonText: 'Review',
            customClass: {
                title: 'custom-swal-title',
                htmlContainer: 'custom-swal-text',
                confirmButton: 'custom-swal-button',
                cancelButton: 'custom-swal-button'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                // Enviar el formulario si el usuario decide enviar de todas maneras
                document.getElementById('exam-form').submit();
            }
        });
    } else {
        // Si todas las preguntas están respondidas, enviar el examen
        document.getElementById('exam-form').submit();
    }
});
