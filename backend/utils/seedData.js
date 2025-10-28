const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Turf = require('../models/Turf');
require('dotenv').config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/goturf');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Turf.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@goturf.com',
      password: 'admin123',
      isAdmin: true
    });
    await adminUser.save();
    console.log('Admin user created');

    // Create sample turfs
    const sampleTurfs = [
      {
        name: "Andheri Sports Complex Football Ground",
        description: "Premium artificial turf with excellent drainage and lighting. Perfect for football matches and training sessions.",
        location: "Andheri West, Mumbai",
        pricePerHour: 800,
        pricePerPerson: 40,
        category: "football",
        maxPlayers: 22,
        minPlayers: 10,
        amenities: ["Floodlights", "Parking", "Washroom", "Changing Room", "Water Facility"],
        rules: ["No smoking", "No alcohol", "Proper sports attire required", "Maximum 2 hours per booking"],
        imageUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&h=300&fit=crop",
        isTopRated: true,
        popularityScore: 95,
        ownerId: adminUser._id,
        isActive: true,
        averageRating: 4.8,
        totalReviews: 45
      },
      {
        name: "Bandra Cricket Academy",
        description: "Professional cricket practice nets with bowling machines. Ideal for batting practice and coaching sessions.",
        location: "Bandra East, Mumbai",
        pricePerHour: 600,
        pricePerPerson: 50,
        category: "cricket",
        maxPlayers: 12,
        minPlayers: 6,
        amenities: ["Bowling Machine", "Nets", "Parking", "Equipment Rental", "Coaching Available"],
        rules: ["Helmet mandatory", "No metal spikes", "Book minimum 1 hour", "Cancel 24hrs in advance"],
        imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500&h=300&fit=crop",
        isTopRated: false,
        popularityScore: 78,
        ownerId: adminUser._id,
        isActive: true,
        averageRating: 4.2,
        totalReviews: 28
      },
      {
        name: "Powai Hockey Arena",
        description: "Natural grass field with modern facilities. Great for hockey matches and tournaments.",
        location: "Powai, Mumbai",
        pricePerHour: 700,
        pricePerPerson: 35,
        category: "hockey",
        maxPlayers: 22,
        minPlayers: 12,
        amenities: ["Natural Grass", "Goal Posts", "Parking", "Washroom", "First Aid"],
        rules: ["Proper hockey gear required", "No cleats on artificial surface", "Respect other players"],
        imageUrl: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=500&h=300&fit=crop",
        isTopRated: false,
        popularityScore: 65,
        ownerId: adminUser._id,
        isActive: true,
        averageRating: 3.9,
        totalReviews: 15
      },
      {
        name: "Malad Badminton Courts",
        description: "Indoor badminton courts with wooden flooring and professional lighting. Air-conditioned facility.",
        location: "Malad West, Mumbai",
        pricePerHour: 400,
        pricePerPerson: 100,
        category: "badminton",
        maxPlayers: 4,
        minPlayers: 2,
        amenities: ["Air Conditioning", "Wooden Floor", "Equipment Rental", "Seating Area", "Lockers"],
        rules: ["Non-marking shoes only", "No food inside court", "Book in advance", "45-minute slots"],
        imageUrl: "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=500&h=300&fit=crop",
        isTopRated: true,
        popularityScore: 88,
        ownerId: adminUser._id,
        isActive: true,
        averageRating: 4.6,
        totalReviews: 32
      },
      {
        name: "Thane Basketball Arena",
        description: "Professional-grade basketball court with high-quality flooring and adjustable hoops.",
        location: "Thane West, Mumbai",
        pricePerHour: 500,
        pricePerPerson: 50,
        category: "basketball",
        maxPlayers: 10,
        minPlayers: 6,
        amenities: ["Professional Grade", "HD Lighting", "Changing Room", "Equipment Storage", "Scoreboard"],
        rules: ["Basketball shoes required", "No dunking on adjustable hoops", "Respect equipment"],
        imageUrl: "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=500&h=300&fit=crop",
        isTopRated: false,
        popularityScore: 72,
        ownerId: adminUser._id,
        isActive: true,
        averageRating: 4.1,
        totalReviews: 19
      },
      {
        name: "Goregaon Sports Hub",
        description: "Multipurpose turf suitable for various sports including football, hockey, and general fitness activities.",
        location: "Goregaon East, Mumbai",
        pricePerHour: 600,
        pricePerPerson: 30,
        category: "multipurpose",
        maxPlayers: 30,
        minPlayers: 8,
        amenities: ["Multi-Sport", "Community Access", "Basic Facilities", "Parking", "Flexible Booking"],
        rules: ["Appropriate gear for each sport", "Clean up after use", "No glass bottles"],
        imageUrl: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=500&h=300&fit=crop",
        isTopRated: false,
        popularityScore: 60,
        ownerId: adminUser._id,
        isActive: true,
        averageRating: 3.7,
        totalReviews: 12
      }
    ];

    await Turf.insertMany(sampleTurfs);
    console.log('Sample turfs created');

    console.log('Seed data created successfully!');
    console.log('Admin credentials: admin@goturf.com / admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('Seed data error:', error);
    process.exit(1);
  }
};

seedData();
