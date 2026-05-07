import { Router } from 'express'

import validate from '../middleware/validate.js'
import { authMiddleware, roleMiddleware } from '../middleware/authMiddleware.js'
import { getUsers, deleteUser, getAdminDashboard, getAdminReports } from '../controllers/adminController.js'
import { getAdminClubs, createAdminClub, deleteAdminClub } from '../controllers/adminClubController.js'
import { createClubSchema } from '../validations/clubValidation.js'

const router = Router()

router.get('/users', authMiddleware, roleMiddleware('admin'), getUsers)
router.delete('/users/:id', authMiddleware, roleMiddleware('admin'), deleteUser)
router.get('/dashboard', authMiddleware, roleMiddleware('admin'), getAdminDashboard)
router.get('/reports', authMiddleware, roleMiddleware('admin'), getAdminReports)

router.get('/clubs', authMiddleware, roleMiddleware('admin'), getAdminClubs)
router.post('/clubs', authMiddleware, roleMiddleware('admin'), validate(createClubSchema), createAdminClub)
router.delete('/clubs/:id', authMiddleware, roleMiddleware('admin'), deleteAdminClub)

export default router
