import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";

export default function MyBookings() {
  const [activeTab, setActiveTab] = useState<'bookings' | 'favorites'>('bookings');
  const bookings = useQuery(api.bookings.getMyBookings);
  const favorites = useQuery(api.favorites.getFavorites);
  const cancelBooking = useMutation(api.bookings.cancel);
  const removeFromFavorites = useMutation(api.favorites.removeFromFavorites);

  if (bookings === undefined || favorites === undefined) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const handleCancel = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    
    try {
      await cancelBooking({ id: bookingId as any });
      toast.success("Booking cancelled successfully");
    } catch (error) {
      toast.error("Failed to cancel booking");
    }
  };

  const handleRemoveFromFavorites = async (turfId: string) => {
    try {
      await removeFromFavorites({ turfId: turfId as Id<"turfs"> });
      toast.success("Removed from favorites");
    } catch (error) {
      toast.error("Failed to remove from favorites");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getPaymentMethodIcon = (method?: string) => {
    if (method === 'cash') {
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
        <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
      </svg>
    );
  };

  const isUpcoming = (date: string, startTime: string) => {
    const bookingDateTime = new Date(`${date}T${startTime}`);
    return bookingDateTime > new Date();
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">My Account</h2>
        <p className="text-gray-600">View your bookings and favorite turfs</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'bookings'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Bookings ({bookings?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'favorites'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Favorites ({favorites?.length || 0})
          </button>
        </nav>
      </div>

      {activeTab === 'bookings' ? (
        <BookingsTab 
          bookings={bookings}
          handleCancel={handleCancel}
          getPaymentMethodIcon={getPaymentMethodIcon}
          getStatusColor={getStatusColor}
          isUpcoming={isUpcoming}
        />
      ) : (
        <FavoritesTab 
          favorites={favorites}
          onRemove={handleRemoveFromFavorites}
        />
      )}
    </div>
  );
}

function BookingsTab({ bookings, handleCancel, getPaymentMethodIcon, getStatusColor, isUpcoming }: any) {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📅</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No bookings yet</h3>
        <p className="text-gray-500">Your bookings will appear here once you make them</p>
      </div>
    );
  }

  const upcomingBookings = bookings.filter((booking: any) => 
    booking.status === 'confirmed' && isUpcoming(booking.date, booking.startTime)
  );
  const pastBookings = bookings.filter((booking: any) => 
    booking.status === 'cancelled' || !isUpcoming(booking.date, booking.startTime)
  );

  return (
    <div className="space-y-8">
      {/* Upcoming Bookings */}
      {upcomingBookings.length > 0 && (
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Bookings</h3>
          </div>
          <div className="p-6 space-y-4">
            {upcomingBookings.map((booking: any) => (
              <BookingCard 
                key={booking._id} 
                booking={booking} 
                onCancel={handleCancel}
                showCancel={true}
                getPaymentMethodIcon={getPaymentMethodIcon}
                getStatusColor={getStatusColor}
              />
            ))}
          </div>
        </div>
      )}

      {/* Past Bookings */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {upcomingBookings.length > 0 ? 'Past Bookings' : 'All Bookings'}
          </h3>
        </div>
        <div className="p-6">
          {pastBookings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No past bookings</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pastBookings.map((booking: any) => (
                <BookingCard 
                  key={booking._id} 
                  booking={booking} 
                  onCancel={handleCancel}
                  showCancel={false}
                  getPaymentMethodIcon={getPaymentMethodIcon}
                  getStatusColor={getStatusColor}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FavoritesTab({ favorites, onRemove }: any) {
  if (favorites.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">❤️</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No favorites yet</h3>
        <p className="text-gray-500">Add turfs to your favorites to see them here</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">My Favorite Turfs</h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((turf: any) => (
            <FavoriteTurfCard 
              key={turf._id} 
              turf={turf} 
              onRemove={() => onRemove(turf._id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function FavoriteTurfCard({ turf, onRemove }: any) {
  const getCategoryIcon = (category: string) => {
    const icons = {
      football: "⚽",
      cricket: "🏏",
      hockey: "🏒",
      badminton: "🏸",
      basketball: "🏀",
      multipurpose: "🏟️"
    };
    return icons[category as keyof typeof icons] || "🏟️";
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? "text-yellow-400" : "text-gray-300"}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 relative">
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
      
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{getCategoryIcon(turf.category)}</span>
        <h4 className="font-semibold text-gray-900">{turf.name}</h4>
      </div>
      
      <p className="text-sm text-gray-600 mb-2">{turf.location}</p>
      
      {turf.averageRating ? (
        <div className="flex items-center mb-2">
          <div className="flex mr-2">
            {renderStars(Math.round(turf.averageRating))}
          </div>
          <span className="text-sm text-gray-600">
            {turf.averageRating.toFixed(1)}
          </span>
        </div>
      ) : (
        <span className="text-sm text-gray-500 mb-2 block">No reviews yet</span>
      )}
      
      <div className="text-lg font-bold text-green-600">
        ₹{turf.pricePerHour}/hour
      </div>
    </div>
  );
}

function BookingCard({ booking, onCancel, showCancel, getPaymentMethodIcon, getStatusColor }: any) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-semibold text-gray-900">{booking.turfName}</h4>
          <p className="text-sm text-gray-600">{booking.turfLocation}</p>
        </div>
        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(booking.status)}`}>
          {booking.status}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
        <div>
          <p><span className="font-medium">Date:</span> {new Date(booking.date).toLocaleDateString('en-IN')}</p>
          <p><span className="font-medium">Time:</span> {booking.startTime} - {booking.endTime}</p>
        </div>
        <div>
          <p><span className="font-medium">Player:</span> {booking.playerName}</p>
          <p><span className="font-medium">Phone:</span> {booking.playerPhone}</p>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {getPaymentMethodIcon(booking.paymentMethod)}
          <span className="text-sm text-gray-600 capitalize">
            {booking.paymentMethod || 'online'} payment
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-semibold text-green-600">₹{booking.totalPrice}</span>
          {showCancel && (
            <button
              onClick={() => onCancel(booking._id)}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
      
      {booking.bookingId && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Booking ID: <span className="font-mono">{booking.bookingId}</span>
          </p>
        </div>
      )}
    </div>
  );
}
