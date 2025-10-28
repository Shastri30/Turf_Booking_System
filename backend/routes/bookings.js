const express = require('express');
const { body, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const Turf = require('../models/Turf');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Create booking
router.post('/', auth, [
  body('turfId').isMongoId().withMessage('Invalid turf ID'),
  body('date').matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Date must be in YYYY-MM-DD format'),
  body('startTime').matches(/^\d{2}:\d{2}$/).withMessage('Start time must be in HH:MM format'),
  body('endTime').matches(/^\d{2}:\d{2}$/).withMessage('End time must be in HH:MM format'),
  body('playerName').trim().isLength({ min: 2 }).withMessage('Player name must be at least 2 characters'),
  body('playerPhone').trim().isLength({ min: 10 }).withMessage('Player phone must be at least 10 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { turfId, date, startTime, endTime, playerName, playerPhone, playerAge, playerGender, playerAddress, notes, paymentMethod } = req.body;

    // Check if the time slot is available
    const existingBooking = await Booking.findOne({
      turfId,
      date,
      status: { $ne: 'cancelled' },
      $or: [
        {
          $and: [
            { startTime: { $lte: startTime } },
            { endTime: { $gt: startTime } }
          ]
        },
        {
          $and: [
            { startTime: { $lt: endTime } },
            { endTime: { $gte: endTime } }
          ]
        },
        {
          $and: [
            { startTime: { $gte: startTime } },
            { endTime: { $lte: endTime } }
          ]
        }
      ]
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'Time slot is already booked' });
    }

    // Get turf details for pricing
    const turf = await Turf.findById(turfId);
    if (!turf) {
      return res.status(404).json({ message: 'Turf not found' });
    }

    // Calculate duration and total price
    const startHour = parseInt(startTime.split(':')[0]);
    const endHour = parseInt(endTime.split(':')[0]);
    const duration = endHour - startHour;
    const totalPrice = duration * turf.pricePerHour;

    // Create booking
    const booking = new Booking({
      turfId,
      userId: req.user._id,
      date,
      startTime,
      endTime,
      totalPrice,
      status: 'confirmed',
      playerName,
      playerPhone,
      playerAge,
      playerGender,
      playerAddress,
      notes,
      paymentMethod: paymentMethod || 'online'
    });

    await booking.save();
    await booking.populate(['turfId', 'userId']);

    res.status(201).json({
      message: 'Booking created successfully',
      booking,
      bookingId: booking._id,
      confirmationId: booking.bookingId
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error while creating booking' });
  }
});

// Get user's bookings
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('turfId', 'name location')
      .sort({ createdAt: -1 });

    const bookingsWithTurfInfo = bookings.map(booking => ({
      ...booking.toObject(),
      turfName: booking.turfId?.name || 'Unknown Turf',
      turfLocation: booking.turfId?.location || ''
    }));

    res.json(bookingsWithTurfInfo);
  } catch (error) {
    console.error('Get my bookings error:', error);
    res.status(500).json({ message: 'Server error while fetching bookings' });
  }
});

// Cancel booking
router.patch('/:id/cancel', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('turfId');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns the booking or the turf
    const turf = await Turf.findById(booking.turfId);
    if (booking.userId.toString() !== req.user._id.toString() && 
        turf?.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to cancel this booking' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Server error while cancelling booking' });
  }
});

// Get single booking
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('turfId')
      .populate('userId', 'name email');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user has access to this booking
    const turf = await Turf.findById(booking.turfId);
    if (booking.userId._id.toString() !== req.user._id.toString() && 
        turf?.ownerId.toString() !== req.user._id.toString() &&
        !req.user.isAdmin) {
      return res.status(403).json({ message: 'Unauthorized to view this booking' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ message: 'Server error while fetching booking' });
  }
});

module.exports = router;
