import { api } from './api.js'

export const getCoordinatorStats = () => api.get('/coordinator/stats')
export const getMyEvents = () => api.get('/coordinator/events')
export const getEventRegistrations = (id) => api.get(`/coordinator/events/${id}/registrations`)
export const updateRegistrationStatus = (id, status) => api.put(`/coordinator/registrations/${id}/status`, { status })
export const getClubMembers = () => api.get('/coordinator/members')
