import Joi from 'joi'

export const createEventSchema = Joi.object({
  title: Joi.string().min(3).max(120).required(),
  description: Joi.string().min(10).required(),
  date: Joi.string().required(),
  time: Joi.string(),
  venue: Joi.string().min(2).max(200).required(),
  club: Joi.string().min(2).max(120).required(),
  capacity: Joi.number().integer().min(1).allow(null),
})

export const updateEventSchema = Joi.object({
  title: Joi.string().min(3).max(120),
  description: Joi.string().min(10),
  date: Joi.string(),
  time: Joi.string(),
  venue: Joi.string().min(2).max(200),
  club: Joi.string().min(2).max(120),
  capacity: Joi.number().integer().min(1).allow(null),
}).min(1)
