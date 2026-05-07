import { api } from './api.js'

export const getEvents = (params) => api.get('/events', { params })
export const getEventsForClubs = (clubNames, params = {}) => {
  const clubs = Array.isArray(clubNames) ? clubNames.filter(Boolean).join(',') : ''
  return api.get('/events', { params: { ...params, clubs } })
}
export const getEvent = (id) => api.get(`/events/${id}`)
export const createEvent = (payload) => api.post('/events', payload)
export const updateEvent = (id, payload) => api.put(`/events/${id}`, payload)
export const deleteEvent = (id) => api.delete(`/events/${id}`)
export const registerForEvent = (id, payload) => api.post(`/events/${id}/register`, payload)

export const getMyRegistrations = () => api.get('/users/me/registrations')

export const getCoordinatorEvents = () => api.get('/coordinator/events')
export const getCoordinatorEventRegistrations = (id) => api.get(`/coordinator/events/${id}/registrations`)

export const updateCoordinatorRegistrationStatus = (id, payload) => api.put(`/coordinator/registrations/${id}/status`, payload)
