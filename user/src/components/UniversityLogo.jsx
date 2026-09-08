import { KANDAHAR_UNIVERSITY_URL } from '../config/routes';

const UniversityLogo = ({
  className = 'h-9 w-9 object-contain shrink-0',
  size = 36,
  alt = 'Kandahar University',
  link = true,
  ...props
}) => {
  const img = (
    <img
      src="/kdr.png"
      alt={alt}
      width={size}
      height={size}
      decoding="async"
      className={className}
      {...props}
    />
  );

  if (!link) return img;

  return (
    <a
      href={KANDAHAR_UNIVERSITY_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex shrink-0"
      aria-label="Kandahar University website"
    >
      {img}
    </a>
  );
};

export default UniversityLogo;
