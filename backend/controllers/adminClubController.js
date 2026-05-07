import asyncHandler from '../middleware/asyncHandler.js'
import AppError from '../utils/AppError.js'
import { ok } from '../utils/apiResponse.js'
import Club from '../models/Club.js'

export const getAdminClubs = asyncHandler(async (req, res) => {
  const clubs = await Club.find().populate('createdBy', 'name email role').sort({ createdAt: -1 }).lean()

  const formatted = clubs.map((c) => ({
    ...c,
    memberCount: c.members?.length || 0,
  }))

  return ok(res, { message: 'Clubs fetched', data: formatted })
})

export const createAdminClub = asyncHandler(async (req, res) => {
  const existing = await Club.findOne({ name: req.body.name })
  if (existing) throw new AppError('Club with this name already exists', 400)

  const club = await Club.create({
    name: req.body.name,
    tagline: req.body.tagline,
    description: req.body.description,
    createdBy: req.user._id,
    members: [],
  })

  return ok(res, { status: 201, message: 'Club created', data: club })
})

export const deleteAdminClub = asyncHandler(async (req, res) => {
  const club = await Club.findById(req.params.id)
  if (!club) throw new AppError('Club not found', 404)

  await club.deleteOne()
  return ok(res, { message: 'Club deleted', data: null })
})
