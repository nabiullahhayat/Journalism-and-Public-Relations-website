import { forwardRef } from 'react';

const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      type = 'text',
      fullWidth = false,
      disabled = false,
      required = false,
      icon = null,
      className = '',
      containerClassName = '',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'block w-full px-3 py-2.5 border rounded-sm text-slate-900 placeholder-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors disabled:bg-slate-100 disabled:cursor-not-allowed';

    const stateStyles = error
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
      : 'border-slate-200 focus:border-[#C79C78] focus:ring-[#C79C78]/30';

    const widthClass = fullWidth ? 'w-full' : '';
    const iconPadding = icon ? 'pl-10' : '';

    return (
      <div className={`${widthClass} ${containerClassName}`}>
        {label && (
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            disabled={disabled}
            required={required}
            className={`${baseStyles} ${stateStyles} ${iconPadding} ${className}`}
            {...props}
          />
        </div>

        {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
        {helperText && !error && <p className="mt-1.5 text-sm text-slate-500">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
