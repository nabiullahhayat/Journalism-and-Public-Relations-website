import { FiBell, FiLogOut, FiSearch, FiUser, FiMenu } from 'react-icons/fi'
import { useNavigate, useSearchParams } from 'react-router-dom'

function Navbar({ onOpenSidebar }) {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('search') ?? ''

  const handleSearchChange = (event) => {
    const value = event.target.value
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set('search', value)
    } else {
      params.delete('search')
    }
    setSearchParams(params)
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-4 py-4 shadow-sm backdrop-blur-md md:px-6">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button onClick={onOpenSidebar} className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 lg:hidden">
            <FiMenu />
          </button>
          <img src="/jour.png" alt="Faculty Logo" className="hidden h-10 w-10 rounded-2xl object-cover lg:block" />
          <div>
            <p className="text-sm font-semibold text-slate-900">Journalism & Public Relations</p>
            <p className="text-xs text-slate-500">Faculty administration</p>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center px-2 md:px-6">
          <div className="relative w-full max-w-xl">
            <FiSearch className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={handleSearchChange}
              placeholder="Search admin pages, content, or records..."
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-700 outline-none transition focus:border-[rgb(209,168,137)] focus:bg-white focus:ring-2 focus:ring-[rgb(209,168,137)]/20"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-700 shadow-sm transition hover:bg-slate-50">
            <FiBell />
          </button>
          <button className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-700 shadow-sm transition hover:bg-slate-50">
            <FiUser className="h-5 w-5" />
            <span className="text-sm font-semibold">Admin</span>
          </button>
          <button onClick={() => navigate('/login')} className="rounded-3xl bg-[rgb(209,168,137)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[rgb(137,109,90)]">
            <FiLogOut className="inline-block mr-2" /> Logout
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
