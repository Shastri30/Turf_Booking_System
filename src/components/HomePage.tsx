import { useState } from "react";

interface HomePageProps {
  onBrowseTurfs: () => void;
}

export default function HomePage({ onBrowseTurfs }: HomePageProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const features = [
    {
      title: "Easy Online Booking",
      description: "Book your favorite sports turf in just a few clicks. No more phone calls or waiting in queues.",
      icon: "📱"
    },
    {
      title: "Multiple Sports Categories",
      description: "Choose from Football, Cricket, Hockey, Badminton, Basketball, and Multipurpose turfs.",
      icon: "⚽"
    },
    {
      title: "Secure Payments",
      description: "Pay online securely or choose cash payment at the venue. Your choice, your convenience.",
      icon: "💳"
    },
    {
      title: "Real-time Availability",
      description: "See live availability of time slots and book instantly without any conflicts.",
      icon: "⏰"
    },
    {
      title: "Reviews & Ratings",
      description: "Read genuine reviews from other players to make informed decisions about your booking.",
      icon: "⭐"
    },
    {
      title: "Instant Notifications",
      description: "Get booking confirmations via email and SMS with your unique booking ID.",
      icon: "📧"
    }
  ];

  const sports = [
    { name: "Football", icon: "⚽", color: "bg-green-500" },
    { name: "Cricket", icon: "🏏", color: "bg-blue-500" },
    { name: "Hockey", icon: "🏒", color: "bg-red-500" },
    { name: "Badminton", icon: "🏸", color: "bg-yellow-500" },
    { name: "Basketball", icon: "🏀", color: "bg-orange-500" },
    { name: "Multipurpose", icon: "🏟️", color: "bg-purple-500" }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center py-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Welcome to <span className="text-green-600">GoTurf.com</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Your one-stop destination for booking premium sports turfs. Play your favorite sport 
          at the best venues with hassle-free online booking and secure payments.
        </p>
        <button
          onClick={onBrowseTurfs}
          className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors shadow-lg"
        >
          Browse Available Turfs
        </button>
      </div>

      {/* Sports Categories */}
      <div className="bg-gray-50 rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Sports We Cover</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {sports.map((sport, index) => (
            <div key={index} className="text-center">
              <div className={`${sport.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl`}>
                {sport.icon}
              </div>
              <p className="font-medium text-gray-700">{sport.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features Carousel */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Why Choose GoTurf.com?</h2>
        
        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {features.map((feature, index) => (
              <div key={index} className="w-full flex-shrink-0 px-4">
                <div className="text-center max-w-2xl mx-auto">
                  <div className="text-6xl mb-4">{feature.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 text-lg">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Controls */}
        <div className="flex justify-center mt-8 space-x-2">
          {features.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                currentSlide === index ? 'bg-green-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        <div className="flex justify-center mt-6 space-x-4">
          <button
            onClick={() => setCurrentSlide(currentSlide > 0 ? currentSlide - 1 : features.length - 1)}
            className="bg-gray-200 hover:bg-gray-300 p-2 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentSlide(currentSlide < features.length - 1 ? currentSlide + 1 : 0)}
            className="bg-gray-200 hover:bg-gray-300 p-2 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
            <h3 className="font-semibold text-gray-900 mb-2">Browse Turfs</h3>
            <p className="text-gray-600 text-sm">Explore available turfs by category, location, and price</p>
          </div>
          <div className="text-center">
            <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
            <h3 className="font-semibold text-gray-900 mb-2">Select Time</h3>
            <p className="text-gray-600 text-sm">Choose your preferred date and time slots</p>
          </div>
          <div className="text-center">
            <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
            <h3 className="font-semibold text-gray-900 mb-2">Make Payment</h3>
            <p className="text-gray-600 text-sm">Pay securely online or choose cash at venue</p>
          </div>
          <div className="text-center">
            <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">4</div>
            <h3 className="font-semibold text-gray-900 mb-2">Play & Enjoy</h3>
            <p className="text-gray-600 text-sm">Show up at the venue and enjoy your game!</p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center py-12 bg-green-600 text-white rounded-lg">
        <h2 className="text-3xl font-bold mb-4">Ready to Play?</h2>
        <p className="text-xl mb-8">Join thousands of players who trust GoTurf.com for their sports booking needs</p>
        <button
          onClick={onBrowseTurfs}
          className="bg-white text-green-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
        >
          Start Booking Now
        </button>
      </div>
    </div>
  );
}
