import asyncHandler from '../middleware/asyncHandler.js'
import { ok } from '../utils/apiResponse.js'
import Announcement from '../models/Announcement.js'
import AppError from '../utils/AppError.js'

export const getAnnouncements = asyncHandler(async (req, res) => {
  const query = {
    $or: [
      { targetRole: 'all' },
      { targetRole: req.user.role }
    ]
  }
  
  const items = await Announcement.find(query)
    .sort({ createdAt: -1 })
    .populate('createdBy', 'name role')

  return ok(res, {
    message: 'Announcements fetched',
    data: items
  })
})

export const createAnnouncement = asyncHandler(async (req, res) => {
  const { title, body, targetRole, club } = req.body
  
  const announcement = await Announcement.create({
    title,
    body,
    targetRole: targetRole || 'all',
    club: club || 'System',
    createdBy: req.user._id
  })

  return ok(res, {
    status: 201,
    message: 'Announcement created',
    data: announcement
  })
})

export const deleteAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await Announcement.findById(req.params.id)
  if (!announcement) throw new AppError('Announcement not found', 404)
  
  // Only creator or admin can delete
  if (announcement.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new AppError('Not authorized', 403)
  }

  await announcement.deleteOne()
  return ok(res, { message: 'Announcement deleted' })
})
