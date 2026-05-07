import asyncHandler from '../middleware/asyncHandler.js'
import AppError from '../utils/AppError.js'
import { ok } from '../utils/apiResponse.js'
import Event from '../models/Event.js'
import Registration from '../models/Registration.js'
import Club from '../models/Club.js'
import Notification from '../models/Notification.js'

export const createEvent = asyncHandler(async (req, res) => {
  if (typeof req.body?.date === 'string' && req.body.date.includes('T') && !req.body.time) {
    const [datePart, timePart] = req.body.date.split('T')
    req.body.date = datePart
    req.body.time = timePart || '00:00'
  }

  const clubExists = await Club.exists({ name: req.body.club })
  if (!clubExists) throw new AppError('Club not found', 400)

  if (req.user.role === 'coordinator') {
    let coordinatorClub = req.user.clubs?.[0] || req.user.club

    if (!coordinatorClub) {
      const lastEvent = await Event.findOne({ createdBy: req.user._id }).sort({ createdAt: -1 }).select('club')
      if (lastEvent?.club) {
        coordinatorClub = lastEvent.club
        req.user.clubs = [coordinatorClub]
        await req.user.save()
      }
    }

    if (!coordinatorClub) throw new AppError('Coordinator is not assigned to a club', 400)
    if (req.body.club !== coordinatorClub) throw new AppError('Forbidden: cannot create event for this club', 403)
  }

  const event = await Event.create({
    ...req.body,
    createdBy: req.user._id,
  })

  return ok(res, { status: 201, message: 'Event created', data: event })
})

export const getEvents = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page || '1', 10), 1)
  const limit = Math.min(Math.max(parseInt(req.query.limit || '10', 10), 1), 50)
  const skip = (page - 1) * limit

  const clubsParam = typeof req.query.clubs === 'string' ? req.query.clubs.trim() : ''
  const clubs = clubsParam
    ? clubsParam
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean)
    : []

  const filter = clubs.length ? { club: { $in: clubs } } : {}

  const [items, total] = await Promise.all([
    Event.find(filter)
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Event.countDocuments(filter),
  ])

  return ok(res, {
    message: 'Events fetched',
    data: {
      items,
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  })
})

export const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id)
    .populate('createdBy', 'name email role')
    .populate('registeredUsers', 'name email role')

  if (!event) throw new AppError('Event not found', 404)

  return ok(res, { message: 'Event fetched', data: event })
})

export const updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id)
  if (!event) throw new AppError('Event not found', 404)

  if (typeof req.body?.date === 'string' && req.body.date.includes('T') && !req.body.time) {
    const [datePart, timePart] = req.body.date.split('T')
    req.body.date = datePart
    req.body.time = timePart || '00:00'
  }

  const isOwner = event.createdBy.toString() === req.user._id.toString()
  const isAdmin = req.user.role === 'admin'
  if (!isOwner && !isAdmin) throw new AppError('Forbidden', 403)

  Object.assign(event, req.body)
  await event.save()

  return ok(res, { message: 'Event updated', data: event })
})

export const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id)
  if (!event) throw new AppError('Event not found', 404)

  const isOwner = event.createdBy.toString() === req.user._id.toString()
  const isAdmin = req.user.role === 'admin'
  if (!isOwner && !isAdmin) throw new AppError('Forbidden', 403)

  await event.deleteOne()
  return ok(res, { message: 'Event deleted', data: null })
})

export const registerForEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id)
  if (!event) throw new AppError('Event not found', 404)

  const already = event.registeredUsers.some((u) => u.toString() === req.user._id.toString())
  if (already) throw new AppError('Already registered', 400)

  if (event.capacity && event.registeredUsers.length >= event.capacity) {
    throw new AppError('Event is full', 400)
  }

  const registration = await Registration.create({
    event: event._id,
    student: req.user._id,
    ...req.body,
  })

  event.registeredUsers.push(req.user._id)
  await event.save()

  await Notification.create({
    user: event.createdBy,
    type: 'registration_created',
    title: 'New event registration',
    body: `${req.user.name} registered for ${event.title}.`,
    link: `/coordinator/events/${event._id}`,
  })

  return ok(res, {
    status: 201,
    message: 'Registered successfully',
    data: registration,
  })
})
