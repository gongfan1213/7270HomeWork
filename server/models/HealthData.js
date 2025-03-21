const mongoose = require('mongoose');

const HealthDataSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  weight: {
    type: Number
  },
  bloodPressure: {
    systolic: Number,
    diastolic: Number
  },
  heartRate: {
    type: Number
  },
  sleepHours: {
    type: Number
  },
  mood: {
    type: String,
    enum: ['excellent', 'good', 'neutral', 'bad', 'terrible']
  },
  notes: {
    type: String
  }
});

module.exports = mongoose.model('HealthData', HealthDataSchema);