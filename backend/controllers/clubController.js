import Club from '../models/Club.js'

export const listPublicClubs = async (req, res) => {
  try {
    const clubs = await Club.find().sort({ createdAt: -1 }).lean()
    const formatted = clubs.map((c) => ({
      _id: c._id,
      name: c.name,
      tagline: c.tagline,
      description: c.description,
      memberCount: c.members?.length || 0,
    }))

    res.status(200).json({ success: true, data: formatted })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch clubs' })
  }
}

export const getClubs = async (req, res) => {
  try {
    const clubs = await Club.find().populate('createdBy', 'name').lean()
    
    const formattedClubs = clubs.map(club => ({
      ...club,
      memberCount: club.members?.length || 0,
      isMember: club.members?.some(memberId => memberId.toString() === req.user?._id?.toString())
    }))

    res.status(200).json({
      success: true,
      data: formattedClubs,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch clubs',
    })
  }
}

export const joinClub = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user._id

    const club = await Club.findById(id)
    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found',
      })
    }

    const isAlreadyMember = club.members.some(memberId => memberId.toString() === userId.toString())
    if (isAlreadyMember) {
      return res.status(400).json({
        success: false,
        message: 'You are already a member of this club',
      })
    }

    club.members.push(userId)
    await club.save()

    res.status(200).json({
      success: true,
      message: 'Successfully joined the club',
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to join club',
    })
  }
}

export const leaveClub = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user._id

    const club = await Club.findById(id)
    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found',
      })
    }

    const isMember = club.members.some(memberId => memberId.toString() === userId.toString())
    if (!isMember) {
      return res.status(400).json({
        success: false,
        message: 'You are not a member of this club',
      })
    }

    club.members = club.members.filter(memberId => memberId.toString() !== userId.toString())
    await club.save()

    res.status(200).json({
      success: true,
      message: 'Successfully left the club',
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to leave club',
    })
  }
}
