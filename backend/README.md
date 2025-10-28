# GoTurf Backend API

A Node.js + Express + MongoDB backend for the GoTurf sports turf booking platform.

## Features

- User authentication with JWT
- Turf management (CRUD operations)
- Booking system with time slot validation
- Payment integration with Razorpay
- Email and SMS notifications
- Favorites system
- Review and rating system
- Admin panel functionality

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/goturf

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Email (Gmail)
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_app_password

# SMS (Twilio)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Payment (Razorpay)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Environment
NODE_ENV=development
```

### 3. Database Setup

Make sure MongoDB is running on your system. You can install MongoDB locally or use MongoDB Atlas.

### 4. Seed Data (Optional)

To populate the database with sample data:

```bash
node utils/seedData.js
```

This will create:
- An admin user (admin@goturf.com / admin123)
- Sample turfs in Mumbai

### 5. Start the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Turfs
- `GET /api/turfs` - Get all turfs (with filters)
- `GET /api/turfs/:id` - Get single turf
- `POST /api/turfs` - Create turf (Admin only)
- `PUT /api/turfs/:id` - Update turf (Admin only)
- `DELETE /api/turfs/:id` - Delete turf (Admin only)
- `GET /api/turfs/:id/available-slots` - Get available time slots

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my-bookings` - Get user's bookings
- `GET /api/bookings/owner-bookings` - Get owner's bookings
- `GET /api/bookings/turf/:turfId` - Get bookings by turf
- `PATCH /api/bookings/:id/cancel` - Cancel booking
- `GET /api/bookings/:id` - Get single booking

### Favorites
- `POST /api/favorites` - Add to favorites
- `DELETE /api/favorites/:turfId` - Remove from favorites
- `GET /api/favorites` - Get user's favorites
- `GET /api/favorites/check/:turfId` - Check if turf is favorite

### Payments
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify` - Verify payment
- `GET /api/payments/payment/:paymentId` - Get payment details

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/turf/:turfId` - Get turf reviews
- `GET /api/reviews/my-reviews` - Get user's reviews
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

## Database Models

### User
- name, email, password, phone
- isAdmin, isActive, avatar
- Timestamps

### Turf
- name, description, location
- pricePerHour, pricePerPerson
- category, amenities, rules
- ownerId, isActive
- averageRating, totalReviews
- Timestamps

### Booking
- turfId, userId, date, startTime, endTime
- totalPrice, status, playerDetails
- paymentId, paymentMethod
- Timestamps

### Favorite
- userId, turfId
- Timestamps

### Review
- turfId, userId, bookingId
- rating, comment, playerName
- Timestamps

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Input validation with express-validator
- Rate limiting
- CORS configuration
- Helmet for security headers
- Request compression

## Error Handling

The API includes comprehensive error handling with appropriate HTTP status codes and error messages.

## Testing

Run tests with:
```bash
npm test
```

## Deployment

1. Set up environment variables on your hosting platform
2. Ensure MongoDB is accessible
3. Set NODE_ENV to 'production'
4. Configure CORS for your frontend domain
5. Set up SSL certificates for HTTPS

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request
