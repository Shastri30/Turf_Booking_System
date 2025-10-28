import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";

export default function Dashboard() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTurf, setEditingTurf] = useState<any>(null);
  const [isAddingSamples, setIsAddingSamples] = useState(false);

  const myTurfs = useQuery(api.turfs.getMyTurfs);
  const ownerBookings = useQuery(api.bookings.getOwnerBookings);
  const addSampleTurfs = useMutation(api.addSampleTurfs.addSampleTurfs);

  if (myTurfs === undefined || ownerBookings === undefined) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const recentBookings = ownerBookings.slice(0, 5);
  const totalRevenue = ownerBookings
    .filter(booking => booking.status === 'confirmed')
    .reduce((sum, booking) => sum + booking.totalPrice, 0);

  const handleAddSampleTurfs = async () => {
    setIsAddingSamples(true);
    try {
      const result = await addSampleTurfs({});
      toast.success(result.message);
    } catch (error) {
      toast.error("Failed to add sample turfs");
    } finally {
      setIsAddingSamples(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Turf Management Dashboard</h2>
          <p className="text-gray-600 mt-1">Manage your turfs and track bookings</p>
        </div>
        <div className="flex gap-3">
          {myTurfs.length === 0 && (
            <button
              onClick={handleAddSampleTurfs}
              disabled={isAddingSamples}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isAddingSamples ? "Adding..." : "Add Sample Turfs"}
            </button>
          )}
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Create New Turf
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Turfs</p>
              <p className="text-2xl font-bold text-gray-900">{myTurfs.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{ownerBookings.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* My Turfs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">My Turfs</h3>
        </div>
        <div className="p-6">
          {myTurfs.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 text-6xl mb-4">🏟️</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No turfs yet</h3>
              <p className="text-gray-500 mb-4">Create your first turf to start accepting bookings</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                Create Your First Turf
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myTurfs.map((turf) => (
                <TurfCard 
                  key={turf._id} 
                  turf={turf} 
                  onEdit={() => setEditingTurf(turf)} 
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
        </div>
        <div className="p-6">
          {recentBookings.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-4">📅</div>
              <p className="text-gray-500">No bookings yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <BookingCard key={booking._id} booking={booking} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showCreateForm && (
        <TurfFormModal 
          onClose={() => setShowCreateForm(false)} 
        />
      )}
      
      {editingTurf && (
        <TurfFormModal 
          turf={editingTurf} 
          onClose={() => setEditingTurf(null)} 
        />
      )}
    </div>
  );
}

function TurfCard({ turf, onEdit }: { turf: any; onEdit: () => void }) {
  const toggleActive = useMutation(api.turfs.toggleActive);

  const handleToggleActive = async () => {
    try {
      await toggleActive({ id: turf._id });
      toast.success(`Turf ${turf.isActive ? 'deactivated' : 'activated'} successfully`);
    } catch (error) {
      toast.error("Failed to update turf status");
    }
  };

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

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{getCategoryIcon(turf.category)}</span>
          <div>
            <h4 className="font-semibold text-gray-900">{turf.name}</h4>
            <p className="text-sm text-gray-600">{turf.location}</p>
          </div>
        </div>
        <span className={`px-2 py-1 text-xs rounded-full ${
          turf.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {turf.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>
      
      <div className="text-sm text-gray-600 mb-3">
        <p>₹{turf.pricePerHour}/hour • ₹{turf.pricePerPerson}/person</p>
        <p>Max {turf.maxPlayers} players • {turf.category}</p>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={onEdit}
          className="flex-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          Edit
        </button>
        <button
          onClick={handleToggleActive}
          className={`flex-1 text-sm font-medium ${
            turf.isActive 
              ? 'text-red-600 hover:text-red-700' 
              : 'text-green-600 hover:text-green-700'
          }`}
        >
          {turf.isActive ? 'Deactivate' : 'Activate'}
        </button>
      </div>
    </div>
  );
}

function BookingCard({ booking }: { booking: any }) {
  const cancelBooking = useMutation(api.bookings.cancel);

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    
    try {
      await cancelBooking({ id: booking._id });
      toast.success("Booking cancelled successfully");
    } catch (error) {
      toast.error("Failed to cancel booking");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const formatPhoneNumber = (phone: string) => {
    // Format phone number as XXX-XXX-XXXX for better readability
    if (phone.length === 10) {
      return `${phone.slice(0, 3)}-${phone.slice(3, 6)}-${phone.slice(6)}`;
    }
    return phone;
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-semibold text-gray-900">{booking.turfName}</h4>
          <p className="text-sm text-gray-600">{booking.playerName} • {formatPhoneNumber(booking.playerPhone)}</p>
        </div>
        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(booking.status)}`}>
          {booking.status}
        </span>
      </div>
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>{booking.date} • {booking.startTime} - {booking.endTime}</span>
        <span className="font-semibold text-green-600">₹{booking.totalPrice}</span>
      </div>
      {booking.status === 'confirmed' && (
        <div className="mt-3">
          <button
            onClick={handleCancel}
            className="text-red-600 hover:text-red-700 text-sm font-medium"
          >
            Cancel Booking
          </button>
        </div>
      )}
    </div>
  );
}

function TurfFormModal({ turf, onClose }: { turf?: any; onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: turf?.name || "",
    description: turf?.description || "",
    location: turf?.location || "",
    pricePerHour: turf?.pricePerHour || 500,
    pricePerPerson: turf?.pricePerPerson || 50,
    category: turf?.category || "football",
    maxPlayers: turf?.maxPlayers || 22,
    amenities: turf?.amenities?.join(", ") || "",
    imageUrl: turf?.imageUrl || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createTurf = useMutation(api.turfs.create);
  const updateTurf = useMutation(api.turfs.update);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const amenitiesArray = formData.amenities
        .split(",")
        .map((a: string) => a.trim())
        .filter((a: string) => a.length > 0);

      const turfData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        pricePerHour: formData.pricePerHour,
        pricePerPerson: formData.pricePerPerson,
        category: formData.category as "football" | "cricket" | "hockey" | "badminton" | "basketball" | "multipurpose",
        maxPlayers: formData.maxPlayers,
        amenities: amenitiesArray,
        imageUrl: formData.imageUrl.trim() || undefined,
      };

      if (turf) {
        await updateTurf({ id: turf._id, ...turfData });
        toast.success("Turf updated successfully!");
      } else {
        await createTurf(turfData);
        toast.success("Turf created successfully!");
      }
      
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save turf");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {turf ? "Edit Turf" : "Create New Turf"}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Turf Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price per Hour (₹) *
              </label>
              <input
                type="number"
                value={formData.pricePerHour}
                onChange={(e) => setFormData({ ...formData, pricePerHour: parseInt(e.target.value) || 0 })}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price per Person (₹) *
              </label>
              <input
                type="number"
                value={formData.pricePerPerson}
                onChange={(e) => setFormData({ ...formData, pricePerPerson: parseInt(e.target.value) || 0 })}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              >
                <option value="football">Football</option>
                <option value="cricket">Cricket</option>
                <option value="hockey">Hockey</option>
                <option value="badminton">Badminton</option>
                <option value="basketball">Basketball</option>
                <option value="multipurpose">Multipurpose</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Players *
              </label>
              <input
                type="number"
                value={formData.maxPlayers}
                onChange={(e) => setFormData({ ...formData, maxPlayers: parseInt(e.target.value) || 0 })}
                min="1"
                max="50"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amenities (comma-separated)
              </label>
              <input
                type="text"
                value={formData.amenities}
                onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                placeholder="e.g., Parking, Washroom, Lighting, Changing Room"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL (optional)
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? "Saving..." : (turf ? "Update" : "Create")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
