import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";
import PaymentForm from "./PaymentForm";

interface BookingFormProps {
  turfId: string;
  onBack: () => void;
  onBookingComplete: () => void;
}

export default function BookingForm({ turfId, onBack, onBookingComplete }: BookingFormProps) {
  const [selectedDate, setSelectedDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [selectedSlots, setSelectedSlots] = useState<number[]>([]);
  const [playerName, setPlayerName] = useState("");
  const [playerPhone, setPlayerPhone] = useState("");
  const [playerAge, setPlayerAge] = useState("");
  const [playerGender, setPlayerGender] = useState<"male" | "female" | "other">("male");
  const [playerAddress, setPlayerAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [showPayment, setShowPayment] = useState(false);

  const turf = useQuery(api.turfs.getById, { id: turfId as Id<"turfs"> });
  const availableSlots = useQuery(api.bookings.getAvailableSlots, { 
    turfId: turfId as Id<"turfs">, 
    date: selectedDate 
  });

  if (turf === undefined || availableSlots === undefined) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!turf) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Turf not found</h3>
        <button
          onClick={onBack}
          className="text-green-600 hover:text-green-700 font-medium"
        >
          ← Back to turfs
        </button>
      </div>
    );
  }

  const handleSlotToggle = (hour: number) => {
    setSelectedSlots(prev => {
      if (prev.includes(hour)) {
        return prev.filter(h => h !== hour);
      } else {
        return [...prev, hour].sort((a, b) => a - b);
      }
    });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/\D/g, '').slice(0, 10);
    setPlayerPhone(numericValue);
  };

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/\D/g, '').slice(0, 2);
    setPlayerAge(numericValue);
  };

  const calculateTotal = () => {
    return selectedSlots.length * turf.pricePerHour;
  };

  const getTimeRange = () => {
    if (selectedSlots.length === 0) return "";
    const start = Math.min(...selectedSlots);
    const end = Math.max(...selectedSlots) + 1;
    return `${start.toString().padStart(2, '0')}:00 - ${end.toString().padStart(2, '0')}:00`;
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedSlots.length === 0) {
      toast.error("Please select at least one time slot");
      return;
    }

    if (!playerName.trim()) {
      toast.error("Please enter player name");
      return;
    }

    if (playerPhone.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    if (!playerAge || parseInt(playerAge) < 5 || parseInt(playerAge) > 100) {
      toast.error("Please enter a valid age (5-100)");
      return;
    }

    if (!playerAddress.trim()) {
      toast.error("Please enter your address");
      return;
    }

    // Check if selected slots are consecutive
    const sortedSlots = [...selectedSlots].sort((a, b) => a - b);
    for (let i = 1; i < sortedSlots.length; i++) {
      if (sortedSlots[i] !== sortedSlots[i-1] + 1) {
        toast.error("Please select consecutive time slots");
        return;
      }
    }

    setShowPayment(true);
  };

  if (showPayment) {
    const bookingData = {
      turfId,
      turfName: turf.name,
      date: selectedDate,
      startTime: `${Math.min(...selectedSlots).toString().padStart(2, '0')}:00`,
      endTime: `${(Math.max(...selectedSlots) + 1).toString().padStart(2, '0')}:00`,
      playerName: playerName.trim(),
      playerPhone: playerPhone.trim(),
      playerAge: parseInt(playerAge),
      playerGender,
      playerAddress: playerAddress.trim(),
      notes: notes.trim() || undefined,
      totalPrice: calculateTotal(),
      duration: selectedSlots.length,
    };

    return (
      <PaymentForm
        bookingData={bookingData}
        onBack={() => setShowPayment(false)}
        onPaymentSuccess={onBookingComplete}
      />
    );
  }

  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateString = maxDate.toISOString().split('T')[0];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="text-green-600 hover:text-green-700 font-medium mb-4 flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Back to turfs
        </button>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Book {turf.name}</h2>
        <p className="text-gray-600">{turf.location} • ₹{turf.pricePerHour}/hour • ₹{turf.pricePerPerson}/person</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleProceedToPayment} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedSlots([]);
                }}
                min={today}
                max={maxDateString}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Available Time Slots
              </label>
              {availableSlots.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No available slots for this date</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot.hour}
                      type="button"
                      onClick={() => handleSlotToggle(slot.hour)}
                      className={`p-2 text-sm rounded-md border transition-colors ${
                        selectedSlots.includes(slot.hour)
                          ? 'bg-green-600 text-white border-green-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-green-500'
                      }`}
                    >
                      {slot.startTime}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Player Name *
                </label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number * (10 digits)
                </label>
                <input
                  type="tel"
                  value={playerPhone}
                  onChange={handlePhoneChange}
                  placeholder="Enter 10-digit phone number"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    playerPhone.length > 0 && playerPhone.length !== 10
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-300'
                  }`}
                  required
                />
                {playerPhone.length > 0 && playerPhone.length !== 10 && (
                  <p className="text-red-500 text-sm mt-1">
                    Phone number must be exactly 10 digits ({playerPhone.length}/10)
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age *
                </label>
                <input
                  type="text"
                  value={playerAge}
                  onChange={handleAgeChange}
                  placeholder="Enter age (5-100)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender *
                </label>
                <select
                  value={playerGender}
                  onChange={(e) => setPlayerGender(e.target.value as "male" | "female" | "other")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <textarea
                value={playerAddress}
                onChange={(e) => setPlayerAddress(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your complete address"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Any special requirements or notes..."
              />
            </div>

            <button
              type="submit"
              disabled={selectedSlots.length === 0 || playerPhone.length !== 10 || !playerAge || !playerAddress.trim()}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Proceed to Payment
            </button>
          </form>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Turf:</span>
                <span className="font-medium">{turf.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">
                  {new Date(selectedDate).toLocaleDateString('en-IN', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
              {selectedSlots.length > 0 && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">{getTimeRange()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{selectedSlots.length} hour{selectedSlots.length > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rate:</span>
                    <span className="font-medium">₹{turf.pricePerHour}/hour</span>
                  </div>
                  <hr className="my-3" />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span className="text-green-600">₹{calculateTotal()}</span>
                  </div>
                </>
              )}
            </div>

            {turf.amenities.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-2">Amenities</h4>
                <div className="flex flex-wrap gap-1">
                  {turf.amenities.map((amenity, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
