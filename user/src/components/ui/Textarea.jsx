import { forwardRef } from 'react';

const Textarea = forwardRef(
  (
    {
      label,
      error,
      helperText,
      fullWidth = false,
      disabled = false,
      required = false,
      rows = 4,
      className = '',
      containerClassName = '',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'block w-full px-3 py-2.5 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed resize-y';

    const stateStyles = error
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-300 focus:border-[#C79C78] focus:ring-[#C79C78]';

    const widthClass = fullWidth ? 'w-full' : '';

    return (
      <div className={`${widthClass} ${containerClassName}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          disabled={disabled}
          required={required}
          rows={rows}
          className={`${baseStyles} ${stateStyles} ${className}`}
          {...props}
        />

        {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
        {helperText && !error && <p className="mt-1.5 text-sm text-gray-500">{helperText}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
export default Textarea;
