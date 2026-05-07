import asyncHandler from '../middleware/asyncHandler.js'
import { ok } from '../utils/apiResponse.js'
import Event from '../models/Event.js'

export const studentDashboard = asyncHandler(async (req, res) => {
  const [totalEvents, registeredEvents] = await Promise.all([
    Event.countDocuments(),
    Event.countDocuments({ registeredUsers: req.user._id }),
  ])

  return ok(res, {
    message: 'Student dashboard fetched',
    data: {
      totalEvents,
      registeredEvents,
    },
  })
})

export const coordinatorDashboard = asyncHandler(async (req, res) => {
  const [eventsCreated, registrationsAgg] = await Promise.all([
    Event.countDocuments({ createdBy: req.user._id }),
    Event.aggregate([
      { $match: { createdBy: req.user._id } },
      { $project: { count: { $size: '$registeredUsers' } } },
      { $group: { _id: null, total: { $sum: '$count' } } },
    ]),
  ])

  const totalRegistrations = registrationsAgg?.[0]?.total || 0

  return ok(res, {
    message: 'Coordinator dashboard fetched',
    data: {
      eventsCreated,
      totalRegistrations,
    },
  })
})
