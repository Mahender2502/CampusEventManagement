import dotenv from 'dotenv'
import createApp from './app.js'
import { connectDB } from './config/db.js'

dotenv.config()

const PORT = process.env.PORT || 5000

async function start() {
  await connectDB(process.env.MONGODB_URI)
  const app = createApp()

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start().catch((err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})
