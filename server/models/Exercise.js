const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  type: {
    type: String,
    required: true,
    enum: ['running', 'walking', 'cycling', 'swimming', 'weightlifting', 'yoga', 'other']
  },
  duration: {
    type: Number,  // 分钟
    required: true
  },
  distance: {
    type: Number,  // 公里
  },
  caloriesBurned: {
    type: Number
  },
  notes: {
    type: String
  }
});

module.exports = mongoose.model('Exercise', ExerciseSchema);