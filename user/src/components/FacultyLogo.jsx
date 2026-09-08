const FacultyLogo = ({
  className = 'h-9 w-9 object-contain shrink-0',
  size = 36,
  alt = 'Journalism & Public Relations Faculty',
  ...props
}) => (
  <img
    src="/jour.png"
    alt={alt}
    width={size}
    height={size}
    decoding="async"
    className={className}
    {...props}
  />
);

export default FacultyLogo;
