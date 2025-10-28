const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  turfId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Turf',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String,
    required: true // YYYY-MM-DD format
  },
  startTime: {
    type: String,
    required: true // HH:MM format
  },
  endTime: {
    type: String,
    required: true // HH:MM format
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  playerName: {
    type: String,
    required: true
  },
  playerPhone: {
    type: String,
    required: true
  },
  playerAge: {
    type: Number,
    min: 1,
    max: 100
  },
  playerGender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  playerAddress: {
    type: String
  },
  notes: {
    type: String
  },
  paymentId: {
    type: String
  },
  paymentMethod: {
    type: String,
    enum: ['online', 'cash'],
    default: 'online'
  },
  bookingId: {
    type: String,
    unique: true
  },
  emailSent: {
    type: Boolean,
    default: false
  },
  smsSent: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
bookingSchema.index({ turfId: 1, date: 1 });
bookingSchema.index({ userId: 1 });
bookingSchema.index({ bookingId: 1 });
bookingSchema.index({ status: 1 });

// Generate unique booking ID before saving
bookingSchema.pre('save', function(next) {
  if (!this.bookingId) {
    this.bookingId = `GT${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
