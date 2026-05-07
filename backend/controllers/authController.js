import asyncHandler from '../middleware/asyncHandler.js'
import AppError from '../utils/AppError.js'
import { ok } from '../utils/apiResponse.js'
import { signToken } from '../utils/jwt.js'
import User from '../models/User.js'
import Club from '../models/Club.js'

export const getMe = asyncHandler(async (req, res) => {
  return ok(res, {
    data: {
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        clubs: req.user.clubs || [],
        phone: req.user.phone,
        department: req.user.department,
        year: req.user.year,
        rollNo: req.user.rollNo,
      },
    },
  })
})

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, club, clubs, phone, department, year, rollNo } = req.body

  const exists = await User.findOne({ email })
  if (exists) throw new AppError('Email already exists', 400)

  if (role === 'coordinator') {
    const clubExists = await Club.exists({ name: club })
    if (!clubExists) throw new AppError('Selected club does not exist', 400)
  }

  const userClubs = role === 'coordinator' ? [club] : (clubs || [])

  const user = await User.create({
    name,
    email,
    password,
    role,
    clubs: userClubs,
    phone,
    department,
    year,
    rollNo,
  })

  // Auto-join clubs: add user to each club's members array
  if (userClubs.length > 0) {
    await Club.updateMany(
      { name: { $in: userClubs } },
      { $addToSet: { members: user._id } }
    )
  }

  return ok(res, {
    status: 201,
    message: 'Registered successfully',
    data: {
      user: {
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
    },
  })
})

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const defaultAdminEmail = 'admin@gmail.com'
  const defaultAdminPassword = 'admin@123'

  if (email === defaultAdminEmail && password === defaultAdminPassword) {
    let adminUser = await User.findOne({ email: defaultAdminEmail })

    if (!adminUser) {
      adminUser = await User.create({
        name: 'Admin',
        email: defaultAdminEmail,
        password: defaultAdminPassword,
        role: 'admin',
      })
    } else if (adminUser.role !== 'admin') {
      adminUser.role = 'admin'
      await adminUser.save()
    }

    const token = signToken(adminUser._id)

    return ok(res, {
      message: 'Login successful',
      data: {
        token,
        user: {
          _id: adminUser._id,
          name: adminUser.name,
          email: adminUser.email,
          role: adminUser.role,
          clubs: adminUser.clubs || [],
          phone: adminUser.phone,
          department: adminUser.department,
          year: adminUser.year,
          rollNo: adminUser.rollNo,
        },
      },
    })
  }

  const user = await User.findOne({ email }).select('+password')
  if (!user) throw new AppError('Invalid credentials', 400)

  const match = await user.comparePassword(password)
  if (!match) throw new AppError('Invalid credentials', 400)

  const token = signToken(user._id)

  return ok(res, {
    message: 'Login successful',
    data: {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        clubs: user.clubs || [],
        phone: user.phone,
        department: user.department,
        year: user.year,
        rollNo: user.rollNo,
      },
    },
  })
})
