const mongoose = require('mongoose');

const examResultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  course: String,
  unit: String,
  attempts: { type: Number, default: 0 },
  highestScore: { type: Number, default: 0 },
  lastScore: { type: Number, default: 0 }
});

module.exports = mongoose.model('ExamResult', examResultSchema);
