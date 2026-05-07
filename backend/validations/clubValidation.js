import Joi from 'joi'

export const createClubSchema = Joi.object({
  name: Joi.string().min(3).max(120).required(),
  tagline: Joi.string().min(3).max(200).required(),
  description: Joi.string().allow('').max(2000),
})

export const updateClubSchema = Joi.object({
  name: Joi.string().min(3).max(120),
  tagline: Joi.string().min(3).max(200),
  description: Joi.string().allow('').max(2000),
}).min(1)
