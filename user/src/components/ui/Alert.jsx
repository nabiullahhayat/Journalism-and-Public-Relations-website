import { FiAlertCircle, FiCheckCircle, FiInfo, FiX, FiAlertTriangle } from 'react-icons/fi';

const Alert = ({ type = 'info', title, message, onClose, className = '' }) => {
  const types = {
    success: {
      bgColor: 'bg-green-50', borderColor: 'border-green-200',
      textColor: 'text-green-800', iconColor: 'text-green-600', icon: FiCheckCircle,
    },
    error: {
      bgColor: 'bg-red-50', borderColor: 'border-red-200',
      textColor: 'text-red-800', iconColor: 'text-red-600', icon: FiAlertCircle,
    },
    warning: {
      bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800', iconColor: 'text-yellow-600', icon: FiAlertTriangle,
    },
    info: {
      bgColor: 'bg-[rgba(199,156,120,0.08)]', borderColor: 'border-[rgba(199,156,120,0.35)]',
      textColor: 'text-[#7a5c3a]', iconColor: 'text-[#C79C78]', icon: FiInfo,
    },
  };

  const config = types[type] || types.info;
  const Icon = config.icon;

  return (
    <div className={`${config.bgColor} ${config.borderColor} border rounded-lg p-4 ${className}`}>
      <div className="flex items-start">
        <div className={`flex-shrink-0 ${config.iconColor}`}>
          <Icon size={20} />
        </div>
        <div className="ml-3 flex-1">
          {title && <h3 className={`text-sm font-medium ${config.textColor} mb-1`}>{title}</h3>}
          {message && <p className={`text-sm ${config.textColor}`}>{message}</p>}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`ml-3 flex-shrink-0 ${config.iconColor} hover:opacity-75 transition-opacity`}
          >
            <FiX size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
