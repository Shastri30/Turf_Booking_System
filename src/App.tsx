import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import HomePage from './components/HomePage';
import TurfList from './components/TurfList';
import BookingForm from './components/BookingForm';
import MyBookings from './components/MyBookings';
import Dashboard from './components/Dashboard';
import ContactUs from './components/ContactUs';
import RefundPolicy from './components/RefundPolicy';
import SignInForm from './SignInForm';
import SignOutButton from './SignOutButton';
import { useAuth } from './contexts/AuthContext';

type Page = 'home' | 'turfs' | 'booking' | 'my-bookings' | 'dashboard' | 'contact' | 'refund-policy';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedTurf, setSelectedTurf] = useState<any>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SignInForm />
      </div>
    );
  }

  const handleBookTurf = (turf: any) => {
    setSelectedTurf(turf);
    setCurrentPage('booking');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} onBookTurf={handleBookTurf} />;
      case 'turfs':
        return <TurfList onBookTurf={handleBookTurf} />;
      case 'booking':
        return <BookingForm turf={selectedTurf} onBack={() => setCurrentPage('turfs')} />;
      case 'my-bookings':
        return <MyBookings />;
      case 'dashboard':
        return <Dashboard />;
      case 'contact':
        return <ContactUs />;
      case 'refund-policy':
        return <RefundPolicy />;
      default:
        return <HomePage onNavigate={setCurrentPage} onBookTurf={handleBookTurf} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setCurrentPage('home')}
                className="text-2xl font-bold text-green-600"
              >
                GoTurf.com
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentPage('home')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentPage === 'home'
                    ? 'text-green-600 bg-green-50'
                    : 'text-gray-700 hover:text-green-600'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => setCurrentPage('turfs')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentPage === 'turfs'
                    ? 'text-green-600 bg-green-50'
                    : 'text-gray-700 hover:text-green-600'
                }`}
              >
                Browse Turfs
              </button>
              <button
                onClick={() => setCurrentPage('my-bookings')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentPage === 'my-bookings'
                    ? 'text-green-600 bg-green-50'
                    : 'text-gray-700 hover:text-green-600'
                }`}
              >
                My Bookings
              </button>
              {user.isAdmin && (
                <button
                  onClick={() => setCurrentPage('dashboard')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentPage === 'dashboard'
                      ? 'text-green-600 bg-green-50'
                      : 'text-gray-700 hover:text-green-600'
                  }`}
                >
                  Dashboard
                </button>
              )}
              <button
                onClick={() => setCurrentPage('contact')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentPage === 'contact'
                    ? 'text-green-600 bg-green-50'
                    : 'text-gray-700 hover:text-green-600'
                }`}
              >
                Contact
              </button>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Welcome, {user.name}</span>
                <SignOutButton />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">GoTurf.com</h3>
              <p className="text-gray-300">
                Your premier destination for booking sports turfs and facilities.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setCurrentPage('turfs')}
                    className="text-gray-300 hover:text-white"
                  >
                    Browse Turfs
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentPage('my-bookings')}
                    className="text-gray-300 hover:text-white"
                  >
                    My Bookings
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentPage('contact')}
                    className="text-gray-300 hover:text-white"
                  >
                    Contact Us
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentPage('refund-policy')}
                    className="text-gray-300 hover:text-white"
                  >
                    Refund Policy
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <p className="text-gray-300">Phone: +91 98192 36329</p>
              <p className="text-gray-300">Phone: +91 80101 97163</p>
              <p className="text-gray-300">Email: info@goturf.com</p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-300">
              © 2024 GoTurf.com. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
