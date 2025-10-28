const express = require('express');
const { body, validationResult } = require('express-validator');
const Turf = require('../models/Turf');
const Booking = require('../models/Booking');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all turfs
router.get('/', async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      location,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 20
    } = req.query;

    const filter = { isActive: true };

    // Apply filters
    if (category && category !== 'all') {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.pricePerHour = {};
      if (minPrice) filter.pricePerHour.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerHour.$lte = Number(maxPrice);
    }

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    // Sorting
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    const turfs = await Turf.find(filter)
      .populate('ownerId', 'name email')
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    const total = await Turf.countDocuments(filter);

    res.json({
      turfs,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / Number(limit)),
        total
      }
    });
  } catch (error) {
    console.error('Get turfs error:', error);
    res.status(500).json({ message: 'Server error while fetching turfs' });
  }
});

// Get single turf
router.get('/:id', async (req, res) => {
  try {
    const turf = await Turf.findById(req.params.id).populate('ownerId', 'name email');
    
    if (!turf) {
      return res.status(404).json({ message: 'Turf not found' });
    }

    res.json(turf);
  } catch (error) {
    console.error('Get turf error:', error);
    res.status(500).json({ message: 'Server error while fetching turf' });
  }
});

// Create turf (Admin only)
router.post('/', adminAuth, [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('location').trim().isLength({ min: 5 }).withMessage('Location must be at least 5 characters'),
  body('pricePerHour').isNumeric().isFloat({ min: 0 }).withMessage('Price per hour must be a positive number'),
  body('category').isIn(['football', 'cricket', 'hockey', 'badminton', 'basketball', 'multipurpose']).withMessage('Invalid category')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const turfData = {
      ...req.body,
      ownerId: req.user._id
    };

    const turf = new Turf(turfData);
    await turf.save();

    await turf.populate('ownerId', 'name email');

    res.status(201).json({
      message: 'Turf created successfully',
      turf
    });
  } catch (error) {
    console.error('Create turf error:', error);
    res.status(500).json({ message: 'Server error while creating turf' });
  }
});

// Get available slots for a turf
router.get('/:id/available-slots', async (req, res) => {
  try {
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }

    const turf = await Turf.findById(req.params.id);
    if (!turf) {
      return res.status(404).json({ message: 'Turf not found' });
    }

    // Get all bookings for this turf on this date
    const bookings = await Booking.find({
      turfId: req.params.id,
      date,
      status: { $ne: 'cancelled' }
    });

    // Get current time
    const now = new Date();
    const currentHour = now.getHours();
    const isToday = date === now.toISOString().split('T')[0];

    // Generate available time slots (6 AM to 11 PM)
    const availableSlots = [];
    for (let hour = 6; hour < 23; hour++) {
      // Skip past hours if booking for today
      if (isToday && hour <= currentHour) {
        continue;
      }

      const startTime = `${hour.toString().padStart(2, '0')}:00`;
      const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
      
      // Check if this slot conflicts with any booking
      const isBooked = bookings.some(booking => {
        const bookingStart = parseInt(booking.startTime.split(':')[0]);
        const bookingEnd = parseInt(booking.endTime.split(':')[0]);
        return hour >= bookingStart && hour < bookingEnd;
      });

      if (!isBooked) {
        availableSlots.push({
          startTime,
          endTime,
          hour,
          price: turf.pricePerHour
        });
      }
    }

    res.json({ availableSlots });
  } catch (error) {
    console.error('Get available slots error:', error);
    res.status(500).json({ message: 'Server error while fetching available slots' });
  }
});

module.exports = router;
