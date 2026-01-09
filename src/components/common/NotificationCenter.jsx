import React from 'react';
import { X, AlertCircle, CheckCircle, InfoIcon, AlertTriangle } from 'lucide-react';

const NotificationCenter = ({ notifications, removeNotification }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} className="text-green-600" />;
      case 'error':
        return <AlertCircle size={20} className="text-red-600" />;
      case 'warning':
        return <AlertTriangle size={20} className="text-yellow-600" />;
      case 'info':
      default:
        return <InfoIcon size={20} className="text-blue-600" />;
    }
  };

  const getStyles = (type) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-800',
        };
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-800',
        };
      case 'info':
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
        };
    }
  };

  return (
    <div className="fixed top-20 right-4 z-50 space-y-3 max-w-md">
      {notifications.map((notif) => {
        const styles = getStyles(notif.type);
        return (
          <div
            key={notif.id}
            className={`${styles.bg} ${styles.border} border rounded-lg p-4 flex items-start gap-3 animate-slide-in-down shadow-lg`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {getIcon(notif.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`${styles.text} text-sm font-medium`}>
                {notif.message}
              </p>
            </div>
            <button
              onClick={() => removeNotification(notif.id)}
              className={`${styles.text} hover:opacity-70 transition-opacity flex-shrink-0`}
            >
              <X size={18} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default NotificationCenter;
