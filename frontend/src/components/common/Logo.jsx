export default function Logo({ className = '' }) {
  return (
    <div className={`flex items-center gap-2 ${className}`.trim()}>
      <img 
        src="/event-management-concept.webp" 
        alt="CCEMS Logo" 
        className="h-9 w-9 rounded-xl object-cover shadow-sm"
      />
      <div className="leading-tight">
        <div className="text-sm font-semibold text-slate-900 dark:text-dark-text">CCEMS</div>
        <div className="text-[11px] text-slate-500 dark:text-dark-muted">Campus Club</div>
      </div>
    </div>
  )
}
