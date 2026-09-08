const Spinner = ({ size = 'md', color = 'primary', className = '' }) => {
  const sizes = {
    xs: 'h-4 w-4',
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24',
  };

  const colors = {
    primary: 'border-[#C79C78]',
    gray:    'border-gray-600',
    green:   'border-green-600',
    red:     'border-red-600',
    white:   'border-white',
    // legacy alias
    blue:    'border-[#C79C78]',
  };

  return (
    <div
      className={`animate-spin rounded-full border-b-2 ${sizes[size]} ${colors[color] || colors.primary} ${className}`}
    />
  );
};

export default Spinner;
