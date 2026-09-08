function SearchBar({ value, onChange }) {
  return (
    <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
      <span className="text-slate-400">Search</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full bg-transparent text-sm text-slate-700 outline-none"
        placeholder="Search content"
      />
    </div>
  )
}

export default SearchBar
