import { FiUser } from 'react-icons/fi';
import { getImageUrl } from '../utils/image';

const sizeClasses = {
  sm: 'w-16 h-16 text-lg',
  md: 'w-28 h-28 text-2xl',
  lg: 'w-40 h-40 text-3xl',
  xl: 'w-56 h-56 text-4xl',
};

const iconSizes = { sm: 24, md: 36, lg: 48, xl: 64 };

export const getInitials = (name = '') =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || '?';

const TeacherAvatar = ({
  teacher,
  name,
  image,
  size = 'md',
  className = '',
  ring = true,
}) => {
  const displayName = name || teacher?.name || '';
  const src = getImageUrl(image || teacher?.profileImage || teacher?.image);
  const sizeClass = sizeClasses[size] || sizeClasses.md;

  if (src) {
    return (
      <img
        src={src}
        alt={displayName}
        className={`${sizeClass} rounded-full object-cover ${ring ? 'ring-4 ring-slate-50' : ''} ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-full bg-gradient-to-br from-[#C79C78] to-[#8B6914] text-white font-serif font-bold flex items-center justify-center ${ring ? 'ring-4 ring-slate-50' : ''} ${className}`}
      aria-label={displayName}
    >
      {displayName ? getInitials(displayName) : <FiUser size={iconSizes[size] || 36} />}
    </div>
  );
};

export default TeacherAvatar;
