const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  turfId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Turf',
    required: true
  }
}, {
  timestamps: true
});

// Compound index to ensure unique user-turf combinations
favoriteSchema.index({ userId: 1, turfId: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
