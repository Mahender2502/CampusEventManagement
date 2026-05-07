import { api } from './api.js'

export async function getAnnouncements() {
  return api.get('/announcements')
}

export async function createAnnouncement(data) {
  return api.post('/announcements', data)
}

export async function deleteAnnouncement(id) {
  return api.delete(`/announcements/${id}`)
}
