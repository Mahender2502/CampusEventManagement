import AppError from '../utils/AppError.js'

export default function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500

  const payload = {
    success: false,
    message: err.message || 'Server error',
  }

  if (err.errors) payload.errors = err.errors

  if (err.name === 'ValidationError') {
    payload.message = 'Validation error'
    payload.errors = Object.values(err.errors).map((e) => e.message)
    return res.status(400).json(payload)
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0]
    payload.message = field ? `${field} already exists` : 'Duplicate key'
    return res.status(400).json(payload)
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Unauthorized' })
  }

  if (statusCode === 500 && !(err instanceof AppError)) {
    return res.status(500).json({ success: false, message: 'Server error' })
  }

  return res.status(statusCode).json(payload)
}
