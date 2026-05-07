import { api } from './api.js'

export async function getMyNotifications(params = {}) {
  return api.get('/notifications', { params })
}

export async function markAllNotificationsRead() {
  return api.put('/notifications/read-all')
}

export async function markNotificationRead(id) {
  return api.put(`/notifications/${id}/read`)
}
