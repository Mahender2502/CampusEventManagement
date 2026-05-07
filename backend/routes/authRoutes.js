import { Router } from 'express'

import validate from '../middleware/validate.js'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { registerSchema, loginSchema } from '../validations/authValidation.js'
import { register, login, getMe } from '../controllers/authController.js'

const router = Router()

router.post('/register', validate(registerSchema), register)
router.post('/login', validate(loginSchema), login)
router.get('/me', authMiddleware, getMe)

export default router
