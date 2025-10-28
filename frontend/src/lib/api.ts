import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
};

// Turfs API
export const turfsAPI = {
  getAll: (params?: any) => api.get('/turfs', { params }),
  getById: (id: string) => api.get(`/turfs/${id}`),
  create: (data: any) => api.post('/turfs', data),
  update: (id: string, data: any) => api.put(`/turfs/${id}`, data),
  delete: (id: string) => api.delete(`/turfs/${id}`),
  getAvailableSlots: (id: string, date: string) => 
    api.get(`/turfs/${id}/available-slots?date=${date}`),
};

// Bookings API
export const bookingsAPI = {
  create: (data: any) => api.post('/bookings', data),
  getMyBookings: () => api.get('/bookings/my-bookings'),
  getOwnerBookings: () => api.get('/bookings/owner-bookings'),
  getByTurf: (turfId: string, date: string) => 
    api.get(`/bookings/turf/${turfId}?date=${date}`),
  cancel: (id: string) => api.patch(`/bookings/${id}/cancel`),
  getById: (id: string) => api.get(`/bookings/${id}`),
};

// Favorites API
export const favoritesAPI = {
  add: (turfId: string) => api.post('/favorites', { turfId }),
  remove: (turfId: string) => api.delete(`/favorites/${turfId}`),
  getAll: () => api.get('/favorites'),
  check: (turfId: string) => api.get(`/favorites/check/${turfId}`),
};

// Payments API
export const paymentsAPI = {
  createOrder: (data: any) => api.post('/payments/create-order', data),
  verify: (data: any) => api.post('/payments/verify', data),
  getPayment: (paymentId: string) => api.get(`/payments/payment/${paymentId}`),
};

// Reviews API
export const reviewsAPI = {
  create: (data: any) => api.post('/reviews', data),
  getByTurf: (turfId: string, params?: any) => 
    api.get(`/reviews/turf/${turfId}`, { params }),
  getMyReviews: () => api.get('/reviews/my-reviews'),
  update: (id: string, data: any) => api.put(`/reviews/${id}`, data),
  delete: (id: string) => api.delete(`/reviews/${id}`),
};

export default api;
