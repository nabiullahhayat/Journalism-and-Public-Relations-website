import { forwardRef } from 'react';

const Button = forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      disabled = false,
      loading = false,
      icon = null,
      type = 'button',
      className = '',
      onClick,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary:   'bg-[#C79C78] hover:bg-[#a8784e] text-white focus:ring-[#C79C78]',
      secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
      success:   'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
      danger:    'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
      warning:   'bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500',
      outline:   'border-2 border-[#C79C78] text-[#C79C78] hover:bg-[rgba(199,156,120,0.08)] focus:ring-[#C79C78]',
      ghost:     'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
      link:      'text-[#C79C78] hover:text-[#a8784e] underline-offset-4 hover:underline focus:ring-[#C79C78]',
    };

    const sizes = {
      xs: 'px-2.5 py-1.5 text-xs',
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2.5 text-base',
      lg: 'px-5 py-3 text-lg',
      xl: 'px-6 py-3.5 text-xl',
    };

    const widthClass = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        onClick={onClick}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {icon && !loading && <span className="mr-2">{icon}</span>}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
