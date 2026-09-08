import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';

const PageHero = ({ title, subtitle, breadcrumbs = [] }) => (
  <section className="relative overflow-hidden glass-hero border-b border-slate-200/80">
    <div className="absolute inset-0 hero-mesh opacity-50 pointer-events-none" />
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#C79C78]" />

    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 lg:py-20">
      {breadcrumbs.length > 0 && (
        <nav className="flex flex-wrap items-center gap-1 text-sm text-slate-500 mb-6" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-[#C79C78] transition-colors">Home</Link>
          {breadcrumbs.map((crumb) => (
            <span key={crumb.label} className="flex items-center gap-1">
              <FiChevronRight size={14} className="text-slate-400" />
              {crumb.href ? (
                <Link to={crumb.href} className="hover:text-[#C79C78] transition-colors">{crumb.label}</Link>
              ) : (
                <span className="text-[#C79C78] font-medium">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}

      <p className="text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-[#C79C78] mb-3">
        Kandahar University
      </p>
      <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight max-w-4xl text-slate-900">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-4 text-lg sm:text-xl text-slate-600 max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  </section>
);

export default PageHero;
