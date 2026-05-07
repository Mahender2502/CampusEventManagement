import { Calendar, MapPin, Users } from 'lucide-react'

function formatDate(iso) {
  const d = new Date(iso)
  return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

export default function EventCard({ event, action }) {
  const seatsLeft = Math.max(0, event.seatsTotal - event.seatsTaken)

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="aspect-[16/9] w-full overflow-hidden bg-slate-100">
        {event.posterUrl ? (
          <img
            src={event.posterUrl}
            alt={event.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : null}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-slate-900">{event.title}</div>
            <div className="mt-0.5 text-xs text-slate-500">{event.club}</div>
          </div>
          <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
            {event.category}
          </span>
        </div>

        <div className="mt-3 space-y-2 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-slate-400" />
            <span>{event.venue}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-slate-400" />
            <span>
              {seatsLeft} seats left ({event.seatsTaken}/{event.seatsTotal})
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            onClick={action?.onView}
          >
            Details
          </button>
          <button
            type="button"
            className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
            onClick={action?.onPrimary}
          >
            {action?.primaryLabel || 'Register'}
          </button>
        </div>
      </div>
    </div>
  )
}
