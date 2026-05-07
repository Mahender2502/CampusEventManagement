import asyncHandler from '../middleware/asyncHandler.js'
import AppError from '../utils/AppError.js'
import { ok } from '../utils/apiResponse.js'
import Event from '../models/Event.js'
import Registration from '../models/Registration.js'
import Club from '../models/Club.js'
import Notification from '../models/Notification.js'

export const getCoordinatorStats = asyncHandler(async (req, res) => {
  let coordinatorClub = req.user.clubs?.[0] || req.user.club

  // Backfill for legacy coordinator accounts: infer club from existing events
  if (!coordinatorClub && req.user.role === 'coordinator') {
    const lastEvent = await Event.findOne({ createdBy: req.user._id }).sort({ createdAt: -1 }).select('club')
    if (lastEvent?.club) {
      coordinatorClub = lastEvent.club
      req.user.clubs = [coordinatorClub]
      await req.user.save()
    }
  }

  if (!coordinatorClub) {
    throw new AppError('Coordinator not assigned to any club. Please re-register as coordinator with a club or contact admin.', 400)
  }

  // 1. Total Events for this club
  const totalEvents = await Event.countDocuments({ club: coordinatorClub })

  // 2. Total Registrations for events in this club
  const events = await Event.find({ club: coordinatorClub }).select('_id')
  const eventIds = events.map(e => e._id)
  const registrationsCount = eventIds.length === 0
    ? 0
    : await Registration.countDocuments({ event: { $in: eventIds } })

  // 3. Total Members of this club
  const club = await Club.findOne({ name: coordinatorClub })
  const membersCount = club?.members?.length || 0

  // 4. Pending Registrations
  const pendingCount = eventIds.length === 0
    ? 0
    : await Registration.countDocuments({
      event: { $in: eventIds },
      status: 'pending',
    })

  // 5. Weekly Chart Data (last 7 days)
  const chartData = []
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const now = new Date()
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(now.getDate() - i)
    d.setHours(0, 0, 0, 0)
    
    const nextDay = new Date(d)
    nextDay.setDate(d.getDate() + 1)

    const count = eventIds.length === 0 
      ? 0 
      : await Registration.countDocuments({
          event: { $in: eventIds },
          createdAt: { $gte: d, $lt: nextDay }
        })

    chartData.push({
      name: dayNames[d.getDay()],
      regs: count
    })
  }

  return ok(res, {
    data: {
      totalEvents,
      registrations: registrationsCount,
      members: membersCount,
      pendingApprovals: pendingCount,
      chartData
    }
  })
})

export const getMyEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({ createdBy: req.user._id }).sort({ createdAt: -1 })
  return ok(res, { message: 'Coordinator events fetched', data: events })
})

export const getEventRegistrations = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id)
  if (!event) throw new AppError('Event not found', 404)

  const isOwner = event.createdBy.toString() === req.user._id.toString()
  const isAdmin = req.user.role === 'admin'
  if (!isOwner && !isAdmin) throw new AppError('Forbidden', 403)

  const registrations = await Registration.find({ event: event._id })
    .populate('student', 'name email role')
    .sort({ createdAt: -1 })

  return ok(res, {
    message: 'Event registrations fetched',
    data: {
      eventId: event._id,
      title: event.title,
      registrations,
      count: registrations.length,
    },
  })
})

export const updateRegistrationStatus = asyncHandler(async (req, res) => {
  const registration = await Registration.findById(req.params.id)
  if (!registration) throw new AppError('Registration not found', 404)

  const event = await Event.findById(registration.event)
  if (!event) throw new AppError('Event not found', 404)

  const isOwner = event.createdBy.toString() === req.user._id.toString()
  const isAdmin = req.user.role === 'admin'
  if (!isOwner && !isAdmin) throw new AppError('Forbidden', 403)

  registration.status = req.body.status
  await registration.save()

  await Notification.create({
    user: registration.student,
    type: 'registration_status',
    title: 'Registration status updated',
    body: `Your registration was ${registration.status}.`,
    link: `/student/registrations`,
  })

  const populated = await Registration.findById(registration._id)
    .populate('student', 'name email role')

  return ok(res, {
    message: 'Registration status updated',
    data: populated,
  })
})

export const getClubMembers = asyncHandler(async (req, res) => {
  let coordinatorClub = req.user.clubs?.[0] || req.user.club

  // Backfill for legacy coordinator accounts
  if (!coordinatorClub && req.user.role === 'coordinator') {
    const lastEvent = await Event.findOne({ createdBy: req.user._id }).sort({ createdAt: -1 }).select('club')
    if (lastEvent?.club) {
      coordinatorClub = lastEvent.club
      req.user.clubs = [coordinatorClub]
      await req.user.save()
    }
  }

  if (!coordinatorClub) {
    throw new AppError('Coordinator not assigned to any club', 400)
  }

  const club = await Club.findOne({ name: coordinatorClub }).populate('members', 'name email role createdAt')
  if (!club) {
    throw new AppError('Club not found', 404)
  }

  const members = (club.members || []).map((m) => ({
    _id: m._id,
    name: m.name,
    email: m.email,
    role: m.role,
    joinedAt: m.createdAt,
  }))

  return ok(res, {
    data: {
      clubName: club.name,
      memberCount: members.length,
      members,
    },
  })
})
