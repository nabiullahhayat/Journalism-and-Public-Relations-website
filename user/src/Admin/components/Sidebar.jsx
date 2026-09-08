import { NavLink } from 'react-router-dom'
import { FiX } from 'react-icons/fi'
import { sidebarLinks } from '../config/resourceConfig'

function Sidebar({ open, onClose }) {
  return (
    <aside className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-[#f2efe9] p-5 transition-transform duration-300 lg:static lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'} lg:flex`}>
      <div className="mb-8 flex items-center justify-between gap-3 rounded-3xl bg-white p-4 shadow-soft">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgb(209,168,137)] text-white">J</div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Journalism Faculty</p>
            <p className="text-xs text-slate-500">Admin portal</p>
          </div>
        </div>
        <button onClick={onClose} className="rounded-full border border-slate-200 bg-slate-50 p-2 text-slate-600 hover:bg-slate-100 lg:hidden">
          <FiX />
        </button>
      </div>
      <nav className="space-y-2">
        {sidebarLinks.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.key}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-[rgb(209,168,137)] text-white shadow-soft'
                    : 'text-slate-700 hover:bg-white hover:text-[rgb(137,109,90)]'
                }`
              }
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-[rgb(137,109,90)] shadow-sm group-hover:bg-[rgb(209,168,137)] group-hover:text-white">
                <Icon />
              </span>
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar
