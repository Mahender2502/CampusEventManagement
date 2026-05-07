import { Router } from 'express'

import validate from '../middleware/validate.js'
import { authMiddleware, roleMiddleware } from '../middleware/authMiddleware.js'
import { updateRegistrationStatusSchema } from '../validations/registrationValidation.js'
import { getMyEvents, getEventRegistrations, updateRegistrationStatus, getCoordinatorStats, getClubMembers } from '../controllers/coordinatorController.js'

const router = Router()

router.get('/stats', authMiddleware, roleMiddleware('coordinator', 'admin'), getCoordinatorStats)
router.get('/events', authMiddleware, roleMiddleware('coordinator', 'admin'), getMyEvents)
router.get('/events/:id/registrations', authMiddleware, roleMiddleware('coordinator', 'admin'), getEventRegistrations)

router.put('/registrations/:id/status', authMiddleware, roleMiddleware('coordinator', 'admin'), validate(updateRegistrationStatusSchema), updateRegistrationStatus)

router.get('/members', authMiddleware, roleMiddleware('coordinator', 'admin'), getClubMembers)

export default router
