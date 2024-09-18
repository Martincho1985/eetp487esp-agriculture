 // Verificar si el parámetro de éxito está en la URL
 const urlParams = new URLSearchParams(window.location.search);
 if (urlParams.get('success') === 'true') {
     Swal.fire({
         icon: 'success',
         title: 'Question added successfully',
         text: 'You can add another question or go to the Question Bank.',
         showCancelButton: true,
         confirmButtonText: 'Add More Questions',
         cancelButtonText: 'Go to Question Bank',
         reverseButtons: true
     }).then((result) => {
         if (result.isConfirmed) {
             // Si el usuario elige "Agregar más preguntas"
             window.location.href = '/new-question';
         } else if (result.dismiss === Swal.DismissReason.cancel) {
             // Si el usuario elige "Ir al Question Bank"
             window.location.href = '/question-bank';
         }
     });
 }