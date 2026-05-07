import { Router } from 'express'

import { authMiddleware, roleMiddleware } from '../middleware/authMiddleware.js'
import { getMyRegistrations, getAllUsers, updateProfile, deleteUser } from '../controllers/userController.js'

const router = Router()

router.get('/me/registrations', authMiddleware, getMyRegistrations)
router.put('/profile', authMiddleware, updateProfile)

// Admin only routes
router.get('/', authMiddleware, roleMiddleware('admin'), getAllUsers)
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteUser)

export default router
