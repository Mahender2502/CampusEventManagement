import { Router } from 'express'

import { authMiddleware, roleMiddleware } from '../middleware/authMiddleware.js'
import { studentDashboard, coordinatorDashboard } from '../controllers/dashboardController.js'

const router = Router()

router.get('/student', authMiddleware, roleMiddleware('student'), studentDashboard)
router.get('/coordinator', authMiddleware, roleMiddleware('coordinator'), coordinatorDashboard)

export default router
