import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Appointments
export const getApprovedAppointments = () => api.get('/appointments/approved');
export const getAvailableSlots = (room, date) => api.get('/appointments/available-slots', { params: { room, date } });
export const createAppointment = (data) => api.post('/appointments', data);
export const getAppointmentById = (id) => api.get(`/appointments/${id}`);
export const checkWeeklyLimit = (deviceId) => api.get(`/appointments/check-limit/${deviceId}`);
export const getMyAppointments = (deviceId) => api.get('/appointments', { params: { deviceId } });
export const cancelMyAppointment = (id, deviceId) => api.patch(`/appointments/${id}/cancel`, { deviceId });

export default api;
