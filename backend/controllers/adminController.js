import asyncHandler from '../middleware/asyncHandler.js'
import AppError from '../utils/AppError.js'
import { ok } from '../utils/apiResponse.js'
import User from '../models/User.js'
import Event from '../models/Event.js'
import Club from '../models/Club.js'
import Registration from '../models/Registration.js'

export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 })
  return ok(res, { message: 'Users fetched', data: users })
})

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) throw new AppError('User not found', 404)

  if (user.role === 'admin') throw new AppError('Cannot delete admin user', 400)

  await user.deleteOne()
  return ok(res, { message: 'User deleted', data: null })
})

export const getAdminDashboard = asyncHandler(async (req, res) => {
  const [totalUsers, totalEvents, totalClubs, totalRegistrations, weeklyRegs] = await Promise.all([
    User.countDocuments(),
    Event.countDocuments(),
    Club.countDocuments(),
    Registration.countDocuments(),
    Registration.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ])
  ])

  // Get monthly event creation stats for the chart
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5)
  sixMonthsAgo.setDate(1)
  sixMonthsAgo.setHours(0, 0, 0, 0)

  const monthlyEvents = await Event.aggregate([
    {
      $match: {
        createdAt: { $gte: sixMonthsAgo }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ])

  // Format chart data for last 6 months (fixing month offset)
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const chartData = []
  
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const month = d.getMonth()
    const year = d.getFullYear()
    const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`
    const monthName = monthNames[month]
    
    const found = monthlyEvents.find(m => m._id === monthKey)
    chartData.push({
      name: monthName,
      events: found ? found.count : 0
    })
  }

  return ok(res, {
    message: 'Admin dashboard fetched',
    data: {
      totalUsers,
      totalEvents,
      totalClubs,
      totalRegistrations,
      chartData
    },
  })
})

export const getAdminReports = asyncHandler(async (req, res) => {
  // Get all clubs from MongoDB
  const allClubs = await Club.find().select('name').lean()
  const clubNames = allClubs.map((c) => c.name)

  // Get registration counts per club
  const clubRegsAgg = await Registration.aggregate([
    {
      $lookup: {
        from: 'events',
        localField: 'event',
        foreignField: '_id',
        as: 'eventDoc',
      },
    },
    { $unwind: '$eventDoc' },
    {
      $group: {
        _id: '$eventDoc.club',
        count: { $sum: 1 },
      },
    },
  ])

  // Create a map of club -> count
  const regCountMap = new Map(clubRegsAgg.map((r) => [r._id, r.count || 0]))

  // Build distribution for ALL clubs (including those with 0 registrations)
  const clubDistribution = clubNames.map((clubName) => ({
    name: clubName,
    count: regCountMap.get(clubName) || 0,
  }))

  // Sort by count descending
  clubDistribution.sort((a, b) => b.count - a.count)

  // Calculate percentages
  const totalRegs = clubDistribution.reduce((sum, r) => sum + r.count, 0)
  const distributionWithPercent = clubDistribution.map((r) => ({
    name: r.name,
    count: r.count,
    value: totalRegs === 0 ? 0 : Math.round((r.count / totalRegs) * 100),
  }))

  return ok(res, {
    message: 'Admin reports fetched',
    data: {
      clubDistribution: distributionWithPercent,
      totalRegistrations: totalRegs,
      totalClubs: clubNames.length,
    },
  })
})

