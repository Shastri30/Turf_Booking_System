export default function RefundPolicy() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Refund Policy</h2>
        <p className="text-gray-600">Understanding our refund and cancellation terms</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="space-y-8">
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Cancellation Policy</h3>
            <div className="space-y-4">
              <div className="bg-green-50 border-l-4 border-green-400 p-4">
                <h4 className="font-medium text-green-800 mb-2">24+ Hours Before Booking</h4>
                <p className="text-green-700 text-sm">Full refund (100% of booking amount)</p>
              </div>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <h4 className="font-medium text-yellow-800 mb-2">12-24 Hours Before Booking</h4>
                <p className="text-yellow-700 text-sm">Partial refund (75% of booking amount)</p>
              </div>
              
              <div className="bg-orange-50 border-l-4 border-orange-400 p-4">
                <h4 className="font-medium text-orange-800 mb-2">6-12 Hours Before Booking</h4>
                <p className="text-orange-700 text-sm">Partial refund (50% of booking amount)</p>
              </div>
              
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <h4 className="font-medium text-red-800 mb-2">Less than 6 Hours Before Booking</h4>
                <p className="text-red-700 text-sm">No refund (0% of booking amount)</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Weather Policy</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>For outdoor turfs, if heavy rain occurs during your booking time, you are eligible for a full refund or free rescheduling.</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>Weather-related cancellations must be reported within 2 hours of the booking start time.</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>Indoor facilities are not affected by weather conditions and normal cancellation policy applies.</span>
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Refund Process</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Online Payments</h4>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>• Refunds processed within 5-7 business days</li>
                  <li>• Amount credited to original payment method</li>
                  <li>• Email notification sent upon processing</li>
                  <li>• Bank processing may take additional 2-3 days</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Cash Payments</h4>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>• Refund available at venue counter</li>
                  <li>• Valid ID and booking confirmation required</li>
                  <li>• Available during business hours only</li>
                  <li>• Bank transfer option available on request</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Special Circumstances</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Medical Emergency</h4>
              <p className="text-blue-800 text-sm mb-2">
                In case of medical emergencies, we offer full refund regardless of cancellation time with proper medical documentation.
              </p>
              <p className="text-blue-700 text-xs">
                Medical certificate from registered practitioner required within 48 hours of booking time.
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Terms & Conditions</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">1.</span>
                <span>Refund requests must be submitted through the GoTurf.com platform or by contacting customer support.</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">2.</span>
                <span>Processing fees (if any) charged by payment gateways are non-refundable.</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">3.</span>
                <span>Refunds are processed only to the original payment method used for booking.</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">4.</span>
                <span>GoTurf.com reserves the right to modify this policy with prior notice to users.</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">5.</span>
                <span>Disputes regarding refunds will be resolved as per Indian consumer protection laws.</span>
              </li>
            </ul>
          </section>

          <section className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Need Help?</h3>
            <p className="text-gray-600 mb-4">
              If you have any questions about our refund policy or need assistance with a cancellation, 
              our customer support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span className="text-gray-700">+91 98192 36329</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span className="text-gray-700">aaryan.shastri@somaiya.edu</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
