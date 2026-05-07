import jwt from 'jsonwebtoken'

import asyncHandler from './asyncHandler.js'
import AppError from '../utils/AppError.js'
import User from '../models/User.js'

export const authMiddleware = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization
  const token = header?.startsWith('Bearer ') ? header.split(' ')[1] : null

  if (!token) {
    throw new AppError('No token provided', 401)
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  const user = await User.findById(decoded.id).select('-password')

  if (!user) {
    throw new AppError('User not found', 401)
  }

  req.user = user
  next()
})

export const roleMiddleware = (...roles) => (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Unauthorized', 401))
  }

  if (!roles.includes(req.user.role)) {
    return next(new AppError('Forbidden', 403))
  }

  next()
}
