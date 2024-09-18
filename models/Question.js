const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    course: String,  // e.g., "Curso 1"
    unit: String,    // e.g., "Unidad o Categoria"
    question: String,
    options: [String], // Array de opciones
    correctAnswer: String,
    feedback: String
}, { timestamps: true }); // Esto agregará automáticamente createdAt y updatedAt

module.exports = mongoose.model('Question', questionSchema);
