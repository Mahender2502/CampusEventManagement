import { Router } from 'express'
import { authMiddleware, roleMiddleware } from '../middleware/authMiddleware.js'
import { getAnnouncements, createAnnouncement, deleteAnnouncement } from '../controllers/announcementController.js'

const router = Router()

router.get('/', authMiddleware, getAnnouncements)
router.post('/', authMiddleware, roleMiddleware('admin', 'coordinator'), createAnnouncement)
router.delete('/:id', authMiddleware, roleMiddleware('admin', 'coordinator'), deleteAnnouncement)

export default router
