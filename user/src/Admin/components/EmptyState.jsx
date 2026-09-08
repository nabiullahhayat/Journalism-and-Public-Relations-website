function EmptyState({ title, description }) {
  return (
    <div className="rounded-[28px] border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-slate-600">
      <p className="text-lg font-semibold text-slate-900">{title}</p>
      <p className="mt-2 text-sm">{description}</p>
    </div>
  )
}

export default EmptyState
