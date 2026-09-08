function FormField({ field, value, onChange }) {
  const baseClasses = 'w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[rgb(209,168,137)] focus:bg-white focus:ring-2 focus:ring-[rgb(209,168,137)]/20'

  if (field.type === 'textarea') {
    return (
      <label className="block space-y-2 text-sm text-slate-700">
        <span className="font-semibold text-slate-900">{field.label}</span>
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={field.placeholder}
          className={`${baseClasses} min-h-[140px] resize-none`}
        />
      </label>
    )
  }

  return (
    <label className="block space-y-2 text-sm text-slate-700">
      <span className="font-semibold text-slate-900">{field.label}</span>
      <input
        type={field.type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={field.placeholder}
        className={baseClasses}
      />
    </label>
  )
}

export default FormField
