const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
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
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true
  },
  playerName: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Indexes
reviewSchema.index({ turfId: 1 });
reviewSchema.index({ userId: 1 });
reviewSchema.index({ bookingId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
