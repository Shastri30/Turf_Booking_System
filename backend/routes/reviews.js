const express = require('express');
const { body, validationResult } = require('express-validator');
const Review = require('../models/Review');
const Turf = require('../models/Turf');
const Booking = require('../models/Booking');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Create review
router.post('/', auth, [
  body('turfId').isMongoId().withMessage('Invalid turf ID'),
  body('bookingId').isMongoId().withMessage('Invalid booking ID'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').trim().isLength({ min: 10 }).withMessage('Comment must be at least 10 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { turfId, bookingId, rating, comment, playerName } = req.body;

    // Verify booking exists and belongs to user
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to review this booking' });
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({ message: 'Can only review completed bookings' });
    }

    // Check if review already exists for this booking
    const existingReview = await Review.findOne({ bookingId });
    if (existingReview) {
      return res.status(400).json({ message: 'Review already exists for this booking' });
    }

    // Create review
    const review = new Review({
      turfId,
      userId: req.user._id,
      bookingId,
      rating,
      comment,
      playerName: playerName || req.user.name
    });

    await review.save();

    // Update turf's average rating
    await updateTurfRating(turfId);

    res.status(201).json({
      message: 'Review created successfully',
      review
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Server error while creating review' });
  }
});

// Get reviews for a turf
router.get('/turf/:turfId', async (req, res) => {
  try {
    const { turfId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const reviews = await Review.find({ turfId })
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Review.countDocuments({ turfId });

    res.json({
      reviews,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / Number(limit)),
        total
      }
    });
  } catch (error) {
    console.error('Get turf reviews error:', error);
    res.status(500).json({ message: 'Server error while fetching reviews' });
  }
});

// Helper function to update turf's average rating
async function updateTurfRating(turfId) {
  try {
    const reviews = await Review.find({ turfId });
    
    if (reviews.length === 0) {
      await Turf.findByIdAndUpdate(turfId, {
        averageRating: 0,
        totalReviews: 0
      });
      return;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    await Turf.findByIdAndUpdate(turfId, {
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      totalReviews: reviews.length,
      isTopRated: averageRating >= 4.5 && reviews.length >= 10
    });
  } catch (error) {
    console.error('Update turf rating error:', error);
  }
}

module.exports = router;
