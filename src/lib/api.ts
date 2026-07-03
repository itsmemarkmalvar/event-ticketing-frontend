import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export interface Event {
  id: number;
  title: string;
  date: string;
  total_capacity: number;
  available_tickets: number;
  booked_tickets: number;
  bookings_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: number;
  event_id: number;
  event?: Event;
  customer_name: string;
  customer_email: string;
  ticket_quantity: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

// Events APIs
export const getEvents = async (): Promise<Event[]> => {
  const response = await api.get('/events');
  return response.data.data;
};

export const getEvent = async (id: number): Promise<Event> => {
  const response = await api.get(`/events/${id}`);
  return response.data.data;
};

export const createEvent = async (data: {
  title: string;
  date: string;
  total_capacity: number;
}): Promise<Event> => {
  const response = await api.post('/events', data);
  return response.data.data;
};

export const updateEvent = async (
  id: number,
  data: Partial<{
    title: string;
    date: string;
    total_capacity: number;
  }>
): Promise<Event> => {
  const response = await api.put(`/events/${id}`, data);
  return response.data.data;
};

export const deleteEvent = async (id: number): Promise<{ message: string }> => {
  const response = await api.delete(`/events/${id}`);
  return response.data;
};

// Bookings APIs
export const getBookings = async (eventId: number): Promise<Booking[]> => {
  const response = await api.get(`/events/${eventId}/bookings`);
  return response.data.data;
};

export const createBooking = async (data: {
  event_id: number;
  customer_name: string;
  customer_email: string;
  ticket_quantity: number;
}): Promise<Booking> => {
  const response = await api.post('/bookings', data);
  return response.data.data;
};

export const updateBookingStatus = async (
  id: number,
  status: 'pending' | 'confirmed' | 'cancelled'
): Promise<Booking> => {
  const response = await api.patch(`/bookings/${id}/status`, { status });
  return response.data.data;
};

export default api;
