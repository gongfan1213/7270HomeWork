const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', ''],
    default: ''
  },
  birthdate: {
    type: Date
  },
  height: {
    type: Number
  },
  goals: {
    targetWeight: Number,
    dailySteps: Number,
    weeklyExercise: Number,
    sleepHours: Number
  },
  preferences: {
    language: {
      type: String,
      default: 'zh-CN'
    },
    theme: {
      type: String,
      default: 'light'
    },
    weightUnit: {
      type: String,
      default: 'kg'
    },
    distanceUnit: {
      type: String,
      default: 'km'
    },
    notifications: {
      type: Boolean,
      default: true
    },
    reminders: {
      type: Boolean,
      default: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('user', UserSchema);