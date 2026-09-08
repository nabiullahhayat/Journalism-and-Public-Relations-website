import FacultyLogo from './FacultyLogo';
import UniversityLogo from './UniversityLogo';

/** Side-by-side logos always share the same square box size. */
const sizes = {
  xs: { box: 'h-6 w-6', dim: 24, gap: 'gap-1.5' },
  sm: { box: 'h-7 w-7', dim: 28, gap: 'gap-2' },
  md: { box: 'h-9 w-9', dim: 36, gap: 'gap-2' },
  lg: { box: 'h-10 w-10', dim: 40, gap: 'gap-2.5' },
  /** Main site menu bar — matches typical university header crest size */
  nav: { box: 'h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16', dim: 64, gap: 'gap-2.5 sm:gap-3' },
};

const BrandLogos = ({ size = 'md', className = '', universityLink = true }) => {
  const s = sizes[size] || sizes.md;
  const logoClass = `${s.box} object-contain shrink-0`;

  return (
    <div className={`flex items-center ${s.gap} ${className}`}>
      <FacultyLogo size={s.dim} className={logoClass} />
      <UniversityLogo size={s.dim} className={logoClass} link={universityLink} />
    </div>
  );
};

export default BrandLogos;
