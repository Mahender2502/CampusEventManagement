import { Router } from 'express'

import { authMiddleware, roleMiddleware } from '../middleware/authMiddleware.js'
import { getClubs, joinClub, leaveClub, listPublicClubs } from '../controllers/clubController.js'

const router = Router()

router.get('/public', listPublicClubs)

router.get('/', authMiddleware, roleMiddleware('student'), getClubs)
router.post('/:id/join', authMiddleware, roleMiddleware('student'), joinClub)
router.post('/:id/leave', authMiddleware, roleMiddleware('student'), leaveClub)

export default router
