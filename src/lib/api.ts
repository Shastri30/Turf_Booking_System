const API_BASE_URL = 'http://localhost:5000/api';

// Auth token management
const getAuthToken = () => localStorage.getItem('authToken');
const setAuthToken = (token: string) => localStorage.setItem('authToken', token);
const removeAuthToken = () => localStorage.removeItem('authToken');

// API request helper
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
};

// Auth API
export const authAPI = {
  register: async (userData: { name: string; email: string; password: string; phone?: string }) => {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (response.token) {
      setAuthToken(response.token);
    }
    return response;
  },

  login: async (credentials: { email: string; password: string }) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (response.token) {
      setAuthToken(response.token);
    }
    return response;
  },

  logout: () => {
    removeAuthToken();
  },

  getCurrentUser: () => apiRequest('/auth/me'),

  updateProfile: (userData: { name?: string; phone?: string }) =>
    apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),
};

// Turfs API
export const turfsAPI = {
  getAll: (params?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    location?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: number;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const queryString = queryParams.toString();
    return apiRequest(`/turfs${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id: string) => apiRequest(`/turfs/${id}`),

  getAvailableSlots: (id: string, date: string) =>
    apiRequest(`/turfs/${id}/available-slots?date=${date}`),

  create: (turfData: any) =>
    apiRequest('/turfs', {
      method: 'POST',
      body: JSON.stringify(turfData),
    }),
};

// Bookings API
export const bookingsAPI = {
  create: (bookingData: {
    turfId: string;
    date: string;
    startTime: string;
    endTime: string;
    playerName: string;
    playerPhone: string;
    playerAge?: number;
    playerGender?: string;
    playerAddress?: string;
    notes?: string;
    paymentMethod?: string;
  }) =>
    apiRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    }),

  getMyBookings: () => apiRequest('/bookings/my-bookings'),

  getById: (id: string) => apiRequest(`/bookings/${id}`),

  cancel: (id: string) =>
    apiRequest(`/bookings/${id}/cancel`, {
      method: 'PATCH',
    }),
};

// Favorites API
export const favoritesAPI = {
  add: (turfId: string) =>
    apiRequest('/favorites', {
      method: 'POST',
      body: JSON.stringify({ turfId }),
    }),

  remove: (turfId: string) =>
    apiRequest(`/favorites/${turfId}`, {
      method: 'DELETE',
    }),

  getAll: () => apiRequest('/favorites'),

  check: (turfId: string) => apiRequest(`/favorites/check/${turfId}`),
};

// Payments API
export const paymentsAPI = {
  createOrder: (orderData: { amount: number; currency?: string; receipt?: string }) =>
    apiRequest('/payments/create-order', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),

  verifyPayment: (paymentData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) =>
    apiRequest('/payments/verify', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    }),
};

// Reviews API
export const reviewsAPI = {
  create: (reviewData: {
    turfId: string;
    bookingId: string;
    rating: number;
    comment: string;
    playerName?: string;
  }) =>
    apiRequest('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    }),

  getByTurf: (turfId: string, page = 1, limit = 10) =>
    apiRequest(`/reviews/turf/${turfId}?page=${page}&limit=${limit}`),
};

export { getAuthToken, setAuthToken, removeAuthToken };
