import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import swaggerUi from 'swagger-ui-express'

import authRoutes from './routes/authRoutes.js'
import eventRoutes from './routes/eventRoutes.js'
import userRoutes from './routes/userRoutes.js'
import coordinatorRoutes from './routes/coordinatorRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import clubRoutes from './routes/clubRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'
import announcementRoutes from './routes/announcementRoutes.js'

import errorHandler from './middleware/errorHandler.js'
import { swaggerSpec } from './config/swagger.js'

export default function createApp() {
  const app = express()

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
      credentials: true,
    }),
  )

  app.use(express.json())

  if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'))
  }

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 300,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  )

  app.get('/api', (req, res) => {
    res.json({ success: true, message: 'CCEMS Backend API', data: null })
  })

  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec()))

  app.use('/api/auth', authRoutes)
  app.use('/api/events', eventRoutes)
  app.use('/api/users', userRoutes)
  app.use('/api/coordinator', coordinatorRoutes)
  app.use('/api/admin', adminRoutes)
  app.use('/api/dashboard', dashboardRoutes)
  app.use('/api/clubs', clubRoutes)
  app.use('/api/notifications', notificationRoutes)
  app.use('/api/announcements', announcementRoutes)

  app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' })
  })

  app.use(errorHandler)

  return app
}
