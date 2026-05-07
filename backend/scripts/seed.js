import dotenv from 'dotenv'
import { connectDB } from '../config/db.js'
import User from '../models/User.js'
import Event from '../models/Event.js'
import Club from '../models/Club.js'

dotenv.config()

async function seed() {
  await connectDB(process.env.MONGODB_URI)

  await Promise.all([User.deleteMany({}), Event.deleteMany({}), Club.deleteMany({})])

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@ccems.com',
    password: 'admin123',
    role: 'admin',
  })

  const coordinator = await User.create({
    name: 'Coordinator User',
    email: 'coordinator@ccems.com',
    password: 'coord123',
    role: 'coordinator',
  })

  const student = await User.create({
    name: 'Student User',
    email: 'student@ccems.com',
    password: 'stud123',
    role: 'student',
  })

  await Club.create({
    name: 'Tech Innovators Club',
    tagline: 'Build. Learn. Ship.',
    description: 'A community for tech enthusiasts to build projects and learn together.',
    members: [],
    createdBy: coordinator._id,
  })

  await Club.create({
    name: 'Lens & Light Society',
    tagline: 'Capture stories in frames.',
    description: 'Photography club for creative minds.',
    members: [],
    createdBy: coordinator._id,
  })

  await Club.create({
    name: 'Entrepreneurship Cell',
    tagline: 'From idea to impact.',
    description: 'For aspiring entrepreneurs and innovators.',
    members: [],
    createdBy: coordinator._id,
  })

  await Event.create({
    title: 'AI & Future Tech Meetup',
    description: 'A campus meetup to explore AI trends, demos, and career paths.',
    date: '2026-03-25',
    time: '16:00',
    venue: 'Auditorium A',
    club: 'Tech Innovators Club',
    createdBy: coordinator._id,
    capacity: 150,
    registeredUsers: [student._id],
  })

  await Event.create({
    title: 'Photography Walk: Golden Hour',
    description: 'Hands-on photo walk with composition tips and editing basics.',
    date: '2026-03-20',
    time: '11:30',
    venue: 'Main Gate',
    club: 'Lens & Light Society',
    createdBy: coordinator._id,
    capacity: 60,
    registeredUsers: [],
  })

  console.log('Seed complete')
  console.log('Admin:', admin.email, 'admin123')
  console.log('Coordinator:', coordinator.email, 'coord123')
  console.log('Student:', student.email, 'stud123')
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
