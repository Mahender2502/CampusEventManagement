import asyncHandler from '../middleware/asyncHandler.js'
import { ok } from '../utils/apiResponse.js'
import Notification from '../models/Notification.js'

export const getMyNotifications = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page || '1', 10), 1)
  const limit = Math.min(Math.max(parseInt(req.query.limit || '10', 10), 1), 50)
  const skip = (page - 1) * limit

  const [items, total, unreadCount] = await Promise.all([
    Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Notification.countDocuments({ user: req.user._id }),
    Notification.countDocuments({ user: req.user._id, readAt: null }),
  ])

  return ok(res, {
    data: {
      items,
      unreadCount,
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  })
})

export const markAllRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { user: req.user._id, readAt: null },
    { $set: { readAt: new Date() } },
  )

  return ok(res, { message: 'Notifications marked as read', data: null })
})

export const markRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOne({ _id: req.params.id, user: req.user._id })
  if (!notification) {
    return ok(res, { message: 'Notification not found', data: null })
  }

  if (!notification.readAt) {
    notification.readAt = new Date()
    await notification.save()
  }

  return ok(res, { message: 'Notification marked as read', data: notification })
})
