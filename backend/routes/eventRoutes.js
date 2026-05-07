import { Router } from 'express'

import validate from '../middleware/validate.js'
import { authMiddleware, roleMiddleware } from '../middleware/authMiddleware.js'
import { createEventSchema, updateEventSchema } from '../validations/eventValidation.js'
import { createRegistrationSchema } from '../validations/registrationValidation.js'
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  registerForEvent,
} from '../controllers/eventController.js'

const router = Router()

router.get('/', getEvents)
router.get('/:id', getEventById)

router.post('/', authMiddleware, roleMiddleware('coordinator', 'admin'), validate(createEventSchema), createEvent)
router.put('/:id', authMiddleware, roleMiddleware('coordinator', 'admin'), validate(updateEventSchema), updateEvent)
router.delete('/:id', authMiddleware, roleMiddleware('coordinator', 'admin'), deleteEvent)

router.post('/:id/register', authMiddleware, roleMiddleware('student'), validate(createRegistrationSchema), registerForEvent)

export default router
