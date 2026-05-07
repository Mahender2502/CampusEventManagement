export const dummyEvents = [
  {
    id: 'evt_001',
    title: 'AI & Future Tech Meetup',
    club: 'Tech Innovators Club',
    date: '2026-03-25T16:00:00.000Z',
    venue: 'Auditorium A',
    category: 'Tech',
    posterUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
    description:
      'A campus meetup to explore AI trends, demos, and career paths. Includes lightning talks and networking.',
    seatsTotal: 150,
    seatsTaken: 92,
  },
  {
    id: 'evt_002',
    title: 'Photography Walk: Golden Hour',
    club: 'Lens & Light Society',
    date: '2026-03-20T11:30:00.000Z',
    venue: 'Main Gate',
    category: 'Arts',
    posterUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    description:
      'Hands-on photo walk with composition tips, portrait sessions, and editing basics. Bring any camera.',
    seatsTotal: 60,
    seatsTaken: 38,
  },
  {
    id: 'evt_003',
    title: 'Startup Pitch Night',
    club: 'Entrepreneurship Cell',
    date: '2026-04-02T13:00:00.000Z',
    venue: 'Seminar Hall 2',
    category: 'Business',
    posterUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
    description:
      'Pitch your idea to a panel of mentors. Get feedback, meet cofounders, and learn fundraising basics.',
    seatsTotal: 120,
    seatsTaken: 80,
  },
]

export const dummyClubs = [
  {
    id: 'club_tech',
    name: 'Tech Innovators Club',
    tagline: 'Build. Learn. Ship.',
    members: 312,
  },
  {
    id: 'club_photo',
    name: 'Lens & Light Society',
    tagline: 'Capture stories in frames.',
    members: 180,
  },
  {
    id: 'club_ecell',
    name: 'Entrepreneurship Cell',
    tagline: 'From idea to impact.',
    members: 240,
  },
]

export const dummyStats = {
  student: {
    upcomingEvents: 3,
    registrations: 2,
    clubsJoined: 1,
    announcements: 4,
  },
  coordinator: {
    totalEvents: 8,
    pendingApprovals: 14,
    registrations: 246,
    members: 312,
  },
  admin: {
    totalClubs: 18,
    totalUsers: 3240,
    totalEvents: 128,
    reports: 7,
  },
}
