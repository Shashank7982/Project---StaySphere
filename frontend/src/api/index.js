import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

// ─── Auth ────────────────────────────────────────────────────────────────────
export const getAuthStatus = () => api.get('/auth/status');
export const login = (data) => api.post('/auth/login', data);
export const signup = (data) => api.post('/auth/signup', data);
export const logout = () => api.post('/auth/logout');

// ─── Store ───────────────────────────────────────────────────────────────────
export const getHomes = (category) =>
  api.get('/store/homes', { params: category && category !== 'all' ? { category } : {} });

export const getHomeById = (id) => api.get(`/store/homes/${id}`);

export const searchHomes = (params) => api.get('/store/search', { params });

export const getBookings = () => api.get('/store/bookings');
export const createBooking = (data) => api.post('/store/bookings', data);

export const getFavourites = () => api.get('/store/favourites');

export const addToFavourites = (id) =>
  api.post('/store/favourites', { id });

export const removeFromFavourites = (homeId) =>
  api.post(`/store/favourites/delete/${homeId}`);

// ─── Host ────────────────────────────────────────────────────────────────────
export const getHostHomes = () => api.get('/host/hostHomeList');

export const getEditHome = (homeId) => api.get(`/host/editHome/${homeId}`);

export const addHome = (formData) =>
  api.post('/host/addHome', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

export const editHome = (formData) =>
  api.post('/host/editHome', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

export const deleteHome = (homeId) => api.post(`/host/deleteHome/${homeId}`);

export default api;
