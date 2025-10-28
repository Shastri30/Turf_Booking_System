import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";

interface PaymentFormProps {
  bookingData: {
    turfId: string;
    turfName: string;
    date: string;
    startTime: string;
    endTime: string;
    playerName: string;
    playerPhone: string;
    playerAge?: number;
    playerGender?: "male" | "female" | "other";
    playerAddress?: string;
    notes?: string;
    totalPrice: number;
    duration: number;
  };
  onBack: () => void;
  onPaymentSuccess: () => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentForm({ bookingData, onBack, onPaymentSuccess }: PaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const createBooking = useMutation(api.bookings.create);
  const createPaymentOrder = useMutation(api.payments.createOrder);
  const verifyPayment = useMutation(api.payments.verifyPayment);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Create payment order
      const order = await createPaymentOrder({
        amount: bookingData.totalPrice,
        currency: "INR",
        receipt: `booking_${Date.now()}`,
      });

      // Initialize Razorpay
      const options = {
        key: "rzp_test_9999999999", // Replace with your Razorpay key
        amount: order.amount,
        currency: order.currency,
        name: "TurfBook",
        description: `Booking for ${bookingData.turfName}`,
        order_id: order.id,
        handler: async function (response: any) {
          try {
            // Verify payment
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            // Create booking after successful payment
            await createBooking({
              turfId: bookingData.turfId as Id<"turfs">,
              date: bookingData.date,
              startTime: bookingData.startTime,
              endTime: bookingData.endTime,
              playerName: bookingData.playerName,
              playerPhone: bookingData.playerPhone,
              playerAge: bookingData.playerAge,
              playerGender: bookingData.playerGender,
              playerAddress: bookingData.playerAddress,
              notes: bookingData.notes,
              paymentId: response.razorpay_payment_id,
            });

            toast.success("Payment successful! Booking confirmed.");
            onPaymentSuccess();
          } catch (error) {
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: bookingData.playerName,
          contact: bookingData.playerPhone,
        },
        theme: {
          color: "#16a34a",
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error("Failed to initiate payment");
      setIsProcessing(false);
    }
  };

  const handleCashPayment = async () => {
    setIsProcessing(true);
    
    try {
      await createBooking({
        turfId: bookingData.turfId as Id<"turfs">,
        date: bookingData.date,
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        playerName: bookingData.playerName,
        playerPhone: bookingData.playerPhone,
        playerAge: bookingData.playerAge,
        playerGender: bookingData.playerGender,
        playerAddress: bookingData.playerAddress,
        notes: bookingData.notes,
        paymentMethod: "cash",
      });

      toast.success("Booking confirmed! Pay cash at the venue.");
      onPaymentSuccess();
    } catch (error) {
      toast.error("Failed to create booking");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="text-green-600 hover:text-green-700 font-medium mb-4 flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Back to booking details
        </button>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Payment</h2>
        <p className="text-gray-600">Complete your booking payment</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
        
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Turf:</span>
            <span className="font-medium">{bookingData.turfName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span className="font-medium">
              {new Date(bookingData.date).toLocaleDateString('en-IN', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Time:</span>
            <span className="font-medium">{bookingData.startTime} - {bookingData.endTime}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Duration:</span>
            <span className="font-medium">{bookingData.duration} hour{bookingData.duration > 1 ? 's' : ''}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Player:</span>
            <span className="font-medium">{bookingData.playerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Phone:</span>
            <span className="font-medium">{bookingData.playerPhone}</span>
          </div>
          <hr className="my-3" />
          <div className="flex justify-between text-lg font-semibold">
            <span>Total Amount:</span>
            <span className="text-green-600">₹{bookingData.totalPrice}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Options</h3>
        
        <div className="space-y-4">
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
              <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
            </svg>
            {isProcessing ? "Processing..." : "Pay Online (Card/UPI/Wallet)"}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">OR</span>
            </div>
          </div>

          <button
            onClick={handleCashPayment}
            disabled={isProcessing}
            className="w-full bg-green-600 text-white py-4 px-6 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {isProcessing ? "Processing..." : "Pay Cash at Venue"}
          </button>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Payment Information</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Online payments are processed securely through Razorpay</li>
            <li>• Cash payments must be made at the venue before play time</li>
            <li>• Refunds for cancellations will be processed within 5-7 business days</li>
            <li>• For support, contact us at support@turfbook.com</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
