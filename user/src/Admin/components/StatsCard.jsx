function StatsCard({ label, value, icon, accent }) {
  const Icon = icon

  return (
    <article className={`rounded-[28px] border border-white/80 bg-white/90 p-6 shadow-soft ${accent}`}> 
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-slate-500">{label}</p>
          <p className="mt-3 text-4xl font-semibold text-slate-900">{value}</p>
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white text-3xl text-slate-900 shadow-sm">
          {Icon ? <Icon /> : <span className="text-xl">•</span>}
        </div>
      </div>
    </article>
  )
}

export default StatsCard
