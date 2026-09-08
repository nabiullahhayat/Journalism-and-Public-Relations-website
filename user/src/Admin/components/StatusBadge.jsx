function StatusBadge({ status }) {
  const badgeStyles = status === 'Draft'
    ? 'bg-slate-100 text-slate-700'
    : 'bg-[rgb(209,168,137)]/15 text-[rgb(137,109,90)]'

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${badgeStyles}`}>
      {status}
    </span>
  )
}

export default StatusBadge
