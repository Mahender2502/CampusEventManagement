import { api } from './api.js'

export const getAdminClubs = () => api.get('/admin/clubs')

export const createAdminClub = (payload) => api.post('/admin/clubs', payload)

export const deleteAdminClub = (id) => api.delete(`/admin/clubs/${id}`)
