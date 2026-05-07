import Joi from 'joi'

export const createRegistrationSchema = Joi.object({
  phone: Joi.string().min(6).max(20).required(),
  department: Joi.string().min(2).max(120).required(),
  year: Joi.number().integer().min(1).max(8).required(),
  rollNo: Joi.string().min(1).max(50).required(),
  notes: Joi.string().max(500).allow('').default(''),
})

export const updateRegistrationStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'approved', 'rejected').required(),
})
