const mongoose = require('mongoose');

const turfSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  pricePerHour: {
    type: Number,
    required: true,
    min: 0
  },
  pricePerPerson: {
    type: Number,
    min: 0
  },
  imageUrl: {
    type: String
  },
  images: [{
    type: String
  }],
  amenities: [{
    type: String
  }],
  rules: [{
    type: String
  }],
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  category: {
    type: String,
    enum: ['football', 'cricket', 'hockey', 'badminton', 'basketball', 'multipurpose'],
    required: true
  },
  maxPlayers: {
    type: Number,
    min: 1
  },
  minPlayers: {
    type: Number,
    min: 1
  },
  averageRating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  isTopRated: {
    type: Boolean,
    default: false
  },
  popularityScore: {
    type: Number,
    default: 0
  },
  coordinates: {
    latitude: Number,
    longitude: Number
  }
}, {
  timestamps: true
});

// Index for geospatial queries
turfSchema.index({ "coordinates.latitude": 1, "coordinates.longitude": 1 });
turfSchema.index({ category: 1, isActive: 1 });
turfSchema.index({ pricePerHour: 1 });
turfSchema.index({ averageRating: -1 });

module.exports = mongoose.model('Turf', turfSchema);
