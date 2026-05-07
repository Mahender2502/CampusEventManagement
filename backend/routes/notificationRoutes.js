import { Router } from 'express'

import { authMiddleware } from '../middleware/authMiddleware.js'
import { getMyNotifications, markAllRead, markRead } from '../controllers/notificationController.js'

const router = Router()

router.get('/', authMiddleware, getMyNotifications)
router.put('/read-all', authMiddleware, markAllRead)
router.put('/:id/read', authMiddleware, markRead)

export default router
