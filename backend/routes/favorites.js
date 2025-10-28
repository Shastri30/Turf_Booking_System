const express = require('express');
const Favorite = require('../models/Favorite');
const Turf = require('../models/Turf');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Add to favorites
router.post('/', auth, async (req, res) => {
  try {
    const { turfId } = req.body;

    if (!turfId) {
      return res.status(400).json({ message: 'Turf ID is required' });
    }

    // Check if turf exists
    const turf = await Turf.findById(turfId);
    if (!turf) {
      return res.status(404).json({ message: 'Turf not found' });
    }

    // Check if already in favorites
    const existingFavorite = await Favorite.findOne({
      userId: req.user._id,
      turfId
    });

    if (existingFavorite) {
      return res.status(400).json({ message: 'Already in favorites' });
    }

    // Add to favorites
    const favorite = new Favorite({
      userId: req.user._id,
      turfId
    });

    await favorite.save();

    res.status(201).json({
      message: 'Added to favorites successfully',
      favorite
    });
  } catch (error) {
    console.error('Add to favorites error:', error);
    res.status(500).json({ message: 'Server error while adding to favorites' });
  }
});

// Remove from favorites
router.delete('/:turfId', auth, async (req, res) => {
  try {
    const { turfId } = req.params;

    const favorite = await Favorite.findOneAndDelete({
      userId: req.user._id,
      turfId
    });

    if (!favorite) {
      return res.status(404).json({ message: 'Favorite not found' });
    }

    res.json({ message: 'Removed from favorites successfully' });
  } catch (error) {
    console.error('Remove from favorites error:', error);
    res.status(500).json({ message: 'Server error while removing from favorites' });
  }
});

// Get user's favorites
router.get('/', auth, async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.user._id })
      .populate('turfId')
      .sort({ createdAt: -1 });

    const favoriteTurfs = favorites
      .filter(fav => fav.turfId) // Filter out any null turfs
      .map(fav => fav.turfId);

    res.json(favoriteTurfs);
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ message: 'Server error while fetching favorites' });
  }
});

// Check if turf is favorite
router.get('/check/:turfId', auth, async (req, res) => {
  try {
    const { turfId } = req.params;

    const favorite = await Favorite.findOne({
      userId: req.user._id,
      turfId
    });

    res.json({ isFavorite: !!favorite });
  } catch (error) {
    console.error('Check favorite error:', error);
    res.status(500).json({ message: 'Server error while checking favorite status' });
  }
});

module.exports = router;
