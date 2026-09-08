const Card = ({
  children,
  title,
  subtitle,
  actions,
  className = '',
  padding = true,
  hover = false,
}) => {
  const hoverClass = hover ? 'uni-card hover:-translate-y-0.5' : 'uni-card';
  const paddingClass = padding ? 'p-6' : '';

  return (
    <div className={`${hoverClass} shadow-soft overflow-hidden ${className}`}>
      {(title || subtitle || actions) && (
        <div className={`border-b border-slate-200 bg-slate-50/50 ${padding ? 'px-6 py-4' : 'p-4'}`}>
          <div className="flex items-center justify-between">
            <div>
              {title && <h3 className="font-serif text-lg font-semibold text-slate-900">{title}</h3>}
              {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
            </div>
            {actions && <div className="flex items-center space-x-2">{actions}</div>}
          </div>
        </div>
      )}
      <div className={paddingClass}>{children}</div>
    </div>
  );
};

export default Card;
