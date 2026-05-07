import { Navigate, Route, Routes } from 'react-router-dom'

import LandingPage from './pages/LandingPage.jsx'
import LoginPage from './pages/auth/LoginPage.jsx'
import RegisterPage from './pages/auth/RegisterPage.jsx'

import StudentLayout from './layout/StudentLayout.jsx'
import CoordinatorLayout from './layout/CoordinatorLayout.jsx'
import AdminLayout from './layout/AdminLayout.jsx'

import StudentDashboardPage from './pages/student/StudentDashboardPage.jsx'
import StudentEventsPage from './pages/student/StudentEventsPage.jsx'
import StudentRegistrationsPage from './pages/student/StudentRegistrationsPage.jsx'

import CoordinatorDashboardPage from './pages/coordinator/CoordinatorDashboardPage.jsx'
import CoordinatorEventsPage from './pages/coordinator/CoordinatorEventsPage.jsx'

import AdminDashboardPage from './pages/admin/AdminDashboardPage.jsx'
import AdminUsersPage from './pages/admin/AdminUsersPage.jsx'
import AdminClubsPage from './pages/admin/AdminClubsPage.jsx'

import StudentClubsPage from './pages/student/StudentClubsPage.jsx'
import StudentAnnouncementsPage from './pages/student/StudentAnnouncementsPage.jsx'
import StudentProfilePage from './pages/student/StudentProfilePage.jsx'

import CoordinatorCreateEventPage from './pages/coordinator/CoordinatorCreateEventPage.jsx'
import CoordinatorRegistrationsPage from './pages/coordinator/CoordinatorRegistrationsPage.jsx'
import CoordinatorMembersPage from './pages/coordinator/CoordinatorMembersPage.jsx'
import CoordinatorAnnouncementsPage from './pages/coordinator/CoordinatorAnnouncementsPage.jsx'
import CoordinatorProfilePage from './pages/coordinator/CoordinatorProfilePage.jsx'

import AdminEventsPage from './pages/admin/AdminEventsPage.jsx'
import AdminReportsPage from './pages/admin/AdminReportsPage.jsx'
import AdminProfilePage from './pages/admin/AdminProfilePage.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/student" element={<StudentLayout />}>
        <Route path="dashboard" element={<StudentDashboardPage />} />
        <Route path="events" element={<StudentEventsPage />} />
        <Route path="registrations" element={<StudentRegistrationsPage />} />
        <Route path="clubs" element={<StudentClubsPage />} />
        <Route path="announcements" element={<StudentAnnouncementsPage />} />
        <Route path="profile" element={<StudentProfilePage />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      <Route path="/coordinator" element={<CoordinatorLayout />}>
        <Route path="dashboard" element={<CoordinatorDashboardPage />} />
        <Route path="create-event" element={<CoordinatorCreateEventPage />} />
        <Route path="events" element={<CoordinatorEventsPage />} />
        <Route path="registrations" element={<CoordinatorRegistrationsPage />} />
        <Route path="members" element={<CoordinatorMembersPage />} />
        <Route path="announcements" element={<CoordinatorAnnouncementsPage />} />
        <Route path="profile" element={<CoordinatorProfilePage />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="clubs" element={<AdminClubsPage />} />
        <Route path="events" element={<AdminEventsPage />} />
        <Route path="reports" element={<AdminReportsPage />} />
        <Route path="announcements" element={<CoordinatorAnnouncementsPage />} />
        <Route path="profile" element={<AdminProfilePage />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
