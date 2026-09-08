import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const SectionHeader = ({ eyebrow, title, description, actionLabel, actionHref, centered = false }) => (
  <div className={`mb-10 sm:mb-12 ${centered ? 'text-center max-w-3xl mx-auto' : 'flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4'}`}>
    <div className={centered ? '' : 'max-w-2xl'}>
      {eyebrow && (
        <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#C79C78] mb-2">
          {eyebrow}
        </p>
      )}
      <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
        {title}
      </h2>
      <div className={`mt-3 h-1 w-16 bg-[#C79C78] ${centered ? 'mx-auto' : ''}`} />
      {description && (
        <p className="mt-4 text-slate-600 text-base sm:text-lg leading-relaxed">{description}</p>
      )}
    </div>
    {actionLabel && actionHref && !centered && (
      <Link
        to={actionHref}
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#C79C78] hover:text-[#a8784e] transition-colors shrink-0"
      >
        {actionLabel} <FiArrowRight size={16} />
      </Link>
    )}
  </div>
);

export default SectionHeader;
