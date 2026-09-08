import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiMenu, FiX, FiHome, FiInfo, FiUsers,
  FiBook, FiBookOpen, FiFileText, FiMail, FiExternalLink,
} from 'react-icons/fi';
import BrandLogos from './BrandLogos';
import UniversityLogo from './UniversityLogo';
import { KANDAHAR_UNIVERSITY_URL, DEVELOPER_NAME } from '../config/routes';

const navigation = [
  { name: 'Home', href: '/', icon: FiHome },
  { name: 'About', href: '/about', icon: FiInfo },
  { name: 'Departments', href: '/departments', icon: FiUsers },
  { name: 'Courses', href: '/courses', icon: FiBook },
  { name: 'Faculty', href: '/teachers', icon: FiUsers },
  { name: 'News', href: '/news', icon: FiFileText },
  { name: 'Research', href: '/monographs', icon: FiBookOpen },
  { name: 'Contact', href: '/contact', icon: FiMail },
];

const Layout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <div className="min-h-screen flex flex-col page-backdrop">
      <div className="glass-bar text-slate-600 text-xs sm:text-sm hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">
          <span className="tracking-wide font-medium">Journalism & Public Relations Faculty</span>
          <div className="flex items-center gap-2">
            <UniversityLogo size={24} className="h-6 w-6 opacity-90" link={false} />
            <a
              href={KANDAHAR_UNIVERSITY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-[#C79C78] transition-colors"
            >
              Kandahar University <FiExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>

      <header className="glass-panel-strong sticky top-0 z-50 border-b border-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center min-h-[4.5rem] py-2 sm:min-h-[5rem] lg:min-h-[5.25rem]">
            <Link to="/" className="flex items-center gap-3 sm:gap-4 shrink-0 group">
              <BrandLogos size="nav" />
              <div className="hidden sm:block border-l border-slate-200/80 pl-4">
                <a
                  href={KANDAHAR_UNIVERSITY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] uppercase tracking-[0.15em] text-[#C79C78] font-semibold leading-tight hover:text-[#a8784e] transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  Kandahar University
                </a>
                <p className="text-sm lg:text-base font-serif font-bold text-slate-900 leading-snug group-hover:text-[#a8784e] transition-colors">
                  Journalism & PR Faculty
                </p>
              </div>
            </Link>

            <nav className="hidden xl:flex items-center gap-0.5">
              {navigation.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`px-3 py-2 text-sm font-medium transition-colors relative rounded-md ${
                      active ? 'text-[#C79C78] bg-[rgba(199,156,120,0.1)]' : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-slate-700 hover:bg-white/60"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-white/60 glass-panel max-h-[70vh] overflow-y-auto">
            <div className="px-4 py-3 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium ${
                      active ? 'bg-[rgba(199,156,120,0.15)] text-[#C79C78]' : 'text-slate-700'
                    }`}
                  >
                    <Icon size={18} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="relative mt-auto">
        <div className="h-1 bg-[#C79C78]" />
        <div className="glass-panel-strong border-t border-white/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              <div className="lg:col-span-2">
                <BrandLogos size="md" className="mb-5" universityLink />
                <h3 className="font-serif text-slate-900 text-xl font-bold mb-3">
                  Journalism & Public Relations Faculty
                </h3>
                <p className="text-sm leading-relaxed max-w-md text-slate-600 mb-4">
                  Educating ethical journalists and communication professionals through rigorous academic programs, research, and community engagement.
                </p>
                <a
                  href={KANDAHAR_UNIVERSITY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-[#C79C78] hover:text-[#a8784e] transition-colors"
                >
                  Kandahar University <FiExternalLink size={12} />
                </a>
              </div>

              <div>
                <h4 className="text-slate-900 text-sm font-semibold uppercase tracking-wider mb-4">Academics</h4>
                <ul className="space-y-2.5 text-sm text-slate-600">
                  <li><Link to="/departments" className="hover:text-[#C79C78] transition-colors">Departments</Link></li>
                  <li><Link to="/courses" className="hover:text-[#C79C78] transition-colors">Courses</Link></li>
                  <li><Link to="/teachers" className="hover:text-[#C79C78] transition-colors">Faculty Directory</Link></li>
                  <li><Link to="/monographs" className="hover:text-[#C79C78] transition-colors">Research & Monographs</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-slate-900 text-sm font-semibold uppercase tracking-wider mb-4">Connect</h4>
                <ul className="space-y-2.5 text-sm text-slate-600">
                  <li><Link to="/about" className="hover:text-[#C79C78] transition-colors">About Us</Link></li>
                  <li><Link to="/news" className="hover:text-[#C79C78] transition-colors">News & Events</Link></li>
                  <li><Link to="/contact" className="hover:text-[#C79C78] transition-colors">Contact</Link></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-slate-200/80 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-500">
              <p>© {new Date().getFullYear()} Journalism & Public Relations Faculty, Kandahar University</p>
              <p>Developed by {DEVELOPER_NAME}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
