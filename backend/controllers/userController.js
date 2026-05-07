import User from '../models/User.js'
import asyncHandler from '../middleware/asyncHandler.js'
import AppError from '../utils/AppError.js'
import { ok } from '../utils/apiResponse.js'
import Registration from '../models/Registration.js'

export const getMyRegistrations = asyncHandler(async (req, res) => {
  const registrations = await Registration.find({ student: req.user._id })
    .populate('event')
    .sort({ createdAt: -1 })

  return ok(res, { message: 'My registrations fetched', data: registrations })
})

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 })
  return ok(res, { data: users })
})

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, phone, department, year, rollNo } = req.body
  const user = await User.findById(req.user._id)

  if (!user) throw new AppError('User not found', 404)

  if (email && email !== user.email) {
    const existing = await User.findOne({ email })
    if (existing) throw new AppError('Email already in use', 400)
    user.email = email
  }

  if (name) user.name = name
  if (phone !== undefined) user.phone = phone
  if (department !== undefined) user.department = department
  if (year !== undefined) user.year = year
  if (rollNo !== undefined) user.rollNo = rollNo
  
  await user.save()

  return ok(res, {
    message: 'Profile updated',
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      clubs: user.clubs,
      phone: user.phone,
      department: user.department,
      year: user.year,
      rollNo: user.rollNo,
    },
  })
})

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id)
  if (!user) throw new AppError('User not found', 404)
  return ok(res, { message: 'User deleted' })
})

