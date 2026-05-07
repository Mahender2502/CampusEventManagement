import Joi from 'joi'

export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(80).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('student', 'coordinator', 'admin').default('student'),
  phone: Joi.string().allow('').optional(),
  department: Joi.string().allow('').optional(),
  year: Joi.string().allow('').optional(),
  rollNo: Joi.string().allow('').optional(),
  club: Joi.when('role', {
    is: 'coordinator',
    then: Joi.string().min(3).max(120).required(),
    otherwise: Joi.string().allow('').optional(),
  }),
  clubs: Joi.array().items(Joi.string()).optional(),
})

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})
