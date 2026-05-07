import { api } from './api.js'

export const getClubs = () => api.get('/clubs')

export const getPublicClubs = () => api.get('/clubs/public')

export const joinClub = (clubId) => api.post(`/clubs/${clubId}/join`)

export const leaveClub = (clubId) => api.post(`/clubs/${clubId}/leave`)
