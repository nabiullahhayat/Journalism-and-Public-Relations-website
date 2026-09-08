function Pagination({ current, total, onChange }) {
  const pages = Array.from({ length: total }, (_, index) => index + 1)

  return (
    <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-slate-700">
      <span>Page</span>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onChange(page)}
          className={`rounded-2xl px-4 py-2 transition ${page === current ? 'bg-[rgb(209,168,137)] text-white' : 'bg-slate-50 hover:bg-slate-100'}`}
        >
          {page}
        </button>
      ))}
    </div>
  )
}

export default Pagination
