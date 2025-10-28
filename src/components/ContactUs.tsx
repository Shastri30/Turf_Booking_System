export default function ContactUs() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h2>
        <p className="text-gray-600">Get in touch with our team for any queries or support</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Get In Touch</h3>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Phone</p>
                <p className="text-gray-600">+91 98192 36329</p>
                <p className="text-gray-600">+91 80101 97163</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Email</p>
                <p className="text-gray-600">aaryan.shastri@somaiya.edu</p>
                <p className="text-gray-600">atish.shelavale@somaiya.edu</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Address</p>
                <p className="text-gray-600">410, B Building, K.J. Somaiya School Of Engineering</p>
                <p className="text-gray-600">Vidyavihar, Mumbai-400077</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Business Hours</p>
                <p className="text-gray-600">Monday - Sunday</p>
                <p className="text-gray-600">6:00 AM - 11:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Send us a Message</h3>
          
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject *
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option value="">Select a subject</option>
                <option value="booking">Booking Inquiry</option>
                <option value="payment">Payment Issue</option>
                <option value="refund">Refund Request</option>
                <option value="technical">Technical Support</option>
                <option value="feedback">Feedback</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message *
              </label>
              <textarea
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your message"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors font-medium"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h3>
        
        <div className="space-y-4">
          <div className="border-b border-gray-200 pb-4">
            <h4 className="font-medium text-gray-900 mb-2">How do I cancel my booking?</h4>
            <p className="text-gray-600 text-sm">You can cancel your booking from the "My Bookings" section. Refunds are processed according to our refund policy.</p>
          </div>
          
          <div className="border-b border-gray-200 pb-4">
            <h4 className="font-medium text-gray-900 mb-2">What payment methods do you accept?</h4>
            <p className="text-gray-600 text-sm">We accept online payments via cards, UPI, and wallets through Razorpay. You can also choose to pay cash at the venue.</p>
          </div>
          
          <div className="border-b border-gray-200 pb-4">
            <h4 className="font-medium text-gray-900 mb-2">Can I modify my booking?</h4>
            <p className="text-gray-600 text-sm">Currently, modifications are not available online. Please contact our support team for assistance with booking changes.</p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">What if it rains on my booking day?</h4>
            <p className="text-gray-600 text-sm">For outdoor turfs, we offer rescheduling or full refund in case of heavy rain. Indoor facilities are not affected by weather.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
