import AppError from '../utils/AppError.js'

export default function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    })

    if (error) {
      return next(new AppError('Validation failed', 400, error.details.map((d) => d.message)))
    }

    req.body = value
    next()
  }
}
