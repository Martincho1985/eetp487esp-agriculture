const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: { type: String, enum: ['student', 'teacher'], default: 'student' } // Agrega el campo de rol con un valor predeterminado
});


// Middleware para encriptar la contraseña antes de guardar el usuario
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Método para comparar la contraseña ingresada con la guardada
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    // Comparar la contraseña proporcionada con el hash almacenado en la base de datos
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    console.log('Contraseña ingresada:', candidatePassword);
    console.log('Contraseña en la base de datos:', this.password);
    console.log('Resultado de la comparación:', isMatch);
    return isMatch;
  } catch (error) {
    console.error('Error al comparar las contraseñas:', error);
    throw error;
  }
};

module.exports = mongoose.model('User', userSchema);
