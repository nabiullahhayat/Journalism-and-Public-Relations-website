import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  FiHome, FiUsers, FiBook, FiBookOpen, FiFileText, FiSettings,
  FiLogOut, FiMenu, FiX, FiUser, FiShield, FiInfo, FiMail,
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import BrandLogos from '../components/BrandLogos';
import { ADMIN_ROUTES } from '../config/routes';

const navigation = [
  { name: 'Dashboard', href: ADMIN_ROUTES.dashboard, icon: FiHome, roles: ['superadmin', 'admin', 'editor', 'viewer'] },
  { name: 'Admins', href: ADMIN_ROUTES.admins, icon: FiShield, roles: ['superadmin', 'admin'] },
  { name: 'Departments', href: ADMIN_ROUTES.departments, icon: FiUsers, roles: ['superadmin', 'admin', 'editor'] },
  { name: 'Courses', href: ADMIN_ROUTES.courses, icon: FiBook, roles: ['superadmin', 'admin', 'editor'] },
  { name: 'Teachers', href: ADMIN_ROUTES.teachers, icon: FiUsers, roles: ['superadmin', 'admin', 'editor'] },
  { name: 'News', href: ADMIN_ROUTES.news, icon: FiFileText, roles: ['superadmin', 'admin', 'editor'] },
  { name: 'Monographs', href: ADMIN_ROUTES.monographs, icon: FiBookOpen, roles: ['superadmin', 'admin', 'editor'] },
  { name: 'About', href: ADMIN_ROUTES.about, icon: FiInfo, roles: ['superadmin', 'admin', 'editor'] },
  { name: 'Contact', href: ADMIN_ROUTES.contact, icon: FiMail, roles: ['superadmin', 'admin', 'editor'] },
  { name: 'Profile', href: ADMIN_ROUTES.profile, icon: FiUser, roles: ['superadmin', 'admin', 'editor', 'viewer'] },
  { name: 'Settings', href: ADMIN_ROUTES.settings, icon: FiSettings, roles: ['superadmin', 'admin'] },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const userRole = user?.role;

  const filteredNavigation = navigation.filter(
    (item) => userRole && item.roles.includes(userRole)
  );

  const isActive = (path) => {
    if (path === ADMIN_ROUTES.dashboard) {
      return location.pathname === ADMIN_ROUTES.dashboard;
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const currentPage = navigation.find((item) => isActive(item.href));

  return (
    <div className="min-h-screen page-backdrop">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 glass-panel-strong border-r border-white/80 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200/60">
            <Link to={ADMIN_ROUTES.dashboard} className="flex items-center space-x-2 min-w-0" onClick={() => setSidebarOpen(false)}>
              <BrandLogos size="sm" universityLink={false} />
              <span className="text-sm font-bold text-slate-900 truncate">Admin</span>
            </Link>
            <button type="button" onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-white/60">
              <FiX size={20} />
            </button>
          </div>

          <div className="p-4 border-b border-slate-200/60">
            <div className="flex items-center space-x-3 glass-panel rounded-xl p-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[rgba(199,156,120,0.15)]">
                <FiUser size={20} className="text-[#C79C78]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">{user?.fullName || user?.username || 'Admin'}</p>
                <p className="text-xs text-slate-500 capitalize">{userRole || 'loading...'}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {filteredNavigation.length === 0 ? (
              <p className="text-sm text-slate-500 px-4 py-3">Loading menu...</p>
            ) : (
              filteredNavigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      active ? 'text-white shadow-md bg-[#C79C78]' : 'text-slate-700 hover:bg-white/60'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.name}</span>
                  </Link>
                );
              })
            )}
          </nav>

          <div className="p-4 border-t border-slate-200/60">
            <button
              type="button"
              onClick={() => logout()}
              className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-red-50/80 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors"
            >
              <FiLogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64 min-h-screen flex flex-col">
        <header className="sticky top-0 z-30 glass-panel-strong border-b border-white/80 h-16 flex items-center px-4 sm:px-6 lg:px-8 shrink-0">
          <button type="button" onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-white/60 mr-4">
            <FiMenu size={24} />
          </button>

          <div className="flex-1 flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
              {currentPage?.name || 'Admin Panel'}
            </h1>
            <Link
              to="/"
              className="hidden sm:flex items-center space-x-2 px-4 py-2 text-sm font-medium text-[#C79C78] hover:text-[#a8784e] glass-panel rounded-lg"
            >
              <FiHome size={18} />
              <span>View Website</span>
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
