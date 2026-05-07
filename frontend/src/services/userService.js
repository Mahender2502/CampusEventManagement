import { api } from './api.js'

export const getAllUsers = () => api.get('/users')
export const deleteUser = (id) => api.delete(`/users/${id}`)
export const updateProfile = (data) => api.put('/users/profile', data)

export const getAdminUsers = () => api.get('/admin/users')
export const deleteAdminUser = (id) => api.delete(`/admin/users/${id}`)

export const getAdminDashboard = () => api.get('/admin/dashboard')
export const getAdminReports = () => api.get('/admin/reports')
export const getStudentDashboard = () => api.get('/dashboard/student')
export const getCoordinatorDashboard = () => api.get('/dashboard/coordinator')
