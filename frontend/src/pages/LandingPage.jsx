import { Link } from 'react-router-dom'
import { ArrowRight, CalendarDays, ShieldCheck, Sparkles, Users } from 'lucide-react'

import Navbar from '../components/Navbar.jsx'
import Container from '../components/common/Container.jsx'
import { dummyClubs, dummyEvents } from '../services/dummyData.js'

function SectionTitle({ eyebrow, title, subtitle }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      {eyebrow ? (
        <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600">{eyebrow}</div>
      ) : null}
      <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-dark-text sm:text-4xl">{title}</h2>
      {subtitle ? <p className="mt-3 text-base text-slate-600 dark:text-dark-muted">{subtitle}</p> : null}
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg">
      <Navbar />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-[-240px] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-indigo-200/60 blur-3xl dark:bg-indigo-900/20" />
          <div className="absolute left-[15%] top-[220px] h-[360px] w-[360px] rounded-full bg-purple-200/50 blur-3xl dark:bg-purple-900/20" />
        </div>

        <Container className="py-16 sm:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm dark:border-dark-border dark:bg-dark-card dark:text-dark-text">
                <Sparkles className="h-4 w-4 text-indigo-600" />
                Modern campus club operations
              </div>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-900 dark:text-dark-text sm:text-5xl">
                Campus Club Event
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {' '}Management
                </span>
              </h1>
              <p className="mt-4 max-w-xl text-base text-slate-600 dark:text-dark-muted">
                KMIT is a SaaS-style dashboard to discover events, manage registrations, and streamline club
                coordination across campus.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
                >
                  Create account
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-dark-border dark:bg-dark-card">
                  <div className="text-xs text-slate-500 dark:text-dark-muted">Active clubs</div>
                  <div className="mt-1 text-2xl font-semibold text-slate-900 dark:text-dark-text">{dummyClubs.length}</div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-dark-border dark:bg-dark-card">
                  <div className="text-xs text-slate-500 dark:text-dark-muted">Upcoming events</div>
                  <div className="mt-1 text-2xl font-semibold text-slate-900 dark:text-dark-text">{dummyEvents.length}</div>
                </div>
                <div className="hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:block dark:border-dark-border dark:bg-dark-card">
                  <div className="text-xs text-slate-500 dark:text-dark-muted">Avg. rating</div>
                  <div className="mt-1 text-2xl font-semibold text-slate-900 dark:text-dark-text">4.8</div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm dark:border-dark-border dark:from-dark-card dark:to-dark-bg">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-dark-border dark:bg-dark-card">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-dark-muted">
                      Upcoming event
                    </div>
                    <div className="mt-1 text-lg font-semibold text-slate-900 dark:text-dark-text">{dummyEvents[0].title}</div>
                    <div className="mt-1 text-sm text-slate-600 dark:text-dark-muted">{dummyEvents[0].club}</div>
                  </div>
                  <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-700">
                    <CalendarDays className="h-6 w-6" />
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
                    <div className="text-xs text-slate-500 dark:text-dark-muted">Venue</div>
                    <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-dark-text">{dummyEvents[0].venue}</div>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
                    <div className="text-xs text-slate-500 dark:text-dark-muted">Seats</div>
                    <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-dark-text">
                      {dummyEvents[0].seatsTaken}/{dummyEvents[0].seatsTotal}
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3 dark:border-dark-border dark:bg-dark-card">
                  <div className="text-xs font-semibold text-slate-700 dark:text-dark-text">Why students love KMIT</div>
                  <ul className="mt-2 space-y-2 text-sm text-slate-600 dark:text-dark-muted">
                    <li className="flex items-start gap-2">
                      <ShieldCheck className="mt-0.5 h-4 w-4 text-indigo-600" />
                      Centralized registrations with clear status tracking
                    </li>
                    <li className="flex items-start gap-2">
                      <Users className="mt-0.5 h-4 w-4 text-indigo-600" />
                      Club discovery, announcements, and participation analytics
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section id="features" className="border-t border-slate-200 bg-slate-50 py-16 sm:py-20 dark:border-dark-border dark:bg-dark-bg">
        <Container>
          <SectionTitle
            eyebrow="Features"
            title="A dashboard built for campus life"
            subtitle="Role-based interfaces for students, coordinators and admins—designed like modern SaaS tools."
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Role-based dashboards',
                body: 'Separate portals for students, coordinators and admins with clean navigation.',
                icon: <ShieldCheck className="h-5 w-5" />,
              },
              {
                title: 'Event discovery',
                body: 'Search and browse event cards with details, posters and quick actions.',
                icon: <CalendarDays className="h-5 w-5" />,
              },
              {
                title: 'Club showcase',
                body: 'Highlight clubs, member counts and participation across campus.',
                icon: <Users className="h-5 w-5" />,
              },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-dark-border dark:bg-dark-card">
                <div className="inline-flex rounded-xl bg-indigo-50 p-2 text-indigo-700">{f.icon}</div>
                <div className="mt-3 text-sm font-semibold text-slate-900 dark:text-dark-text">{f.title}</div>
                <div className="mt-1 text-sm text-slate-600 dark:text-dark-muted">{f.body}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section id="events" className="py-16 sm:py-20">
        <Container>
          <SectionTitle
            eyebrow="Upcoming"
            title="Don’t miss out on next big event"
            subtitle="A quick preview of upcoming campus events—students can register in a single click."
          />

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {dummyEvents.map((e) => (
              <div key={e.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-dark-border dark:bg-dark-card">
                <div className="text-sm font-semibold text-slate-900 dark:text-dark-text">{e.title}</div>
                <div className="mt-1 text-sm text-slate-600 dark:text-dark-muted">{e.club}</div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-xs text-slate-500 dark:text-dark-muted">{new Date(e.date).toLocaleDateString()}</div>
                  <Link
                    to="/student/events"
                    className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section id="clubs" className="border-t border-slate-200 bg-slate-50 py-16 sm:py-20 dark:border-dark-border dark:bg-dark-bg">
        <Container>
          <SectionTitle eyebrow="Clubs" title="Discover campus communities" subtitle="Find clubs that match your interests and stay updated." />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {dummyClubs.map((c) => (
              <div key={c.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-dark-border dark:bg-dark-card">
                <div className="text-sm font-semibold text-slate-900 dark:text-dark-text">{c.name}</div>
                <div className="mt-1 text-sm text-slate-600 dark:text-dark-muted">{c.tagline}</div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-xs text-slate-500 dark:text-dark-muted">{c.members} members</div>
                  <Link
                    to="/register"
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-dark-border dark:bg-dark-card dark:text-dark-text dark:hover:bg-slate-800"
                  >
                    Join
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <footer className="border-t border-slate-200 bg-white py-10 dark:border-dark-border dark:bg-dark-card">
        <Container>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm font-semibold text-slate-900 dark:text-dark-text">KMIT</div>
            <div className="text-sm text-slate-500 dark:text-dark-muted">© {new Date().getFullYear()} Campus Club Event Management System</div>
          </div>
        </Container>
      </footer>
    </div>
  )
}
