import React from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Toast = () => {
  const { toasts, removeToast } = useToast();

  const getToastStyles = (type) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-900/80 border-green-700',
          text: 'text-green-200',
          icon: <CheckCircle className="w-5 h-5 text-green-400" />
        };
      case 'error':
        return {
          bg: 'bg-red-900/80 border-red-700',
          text: 'text-red-200',
          icon: <AlertCircle className="w-5 h-5 text-red-400" />
        };
      case 'warning':
        return {
          bg: 'bg-amber-900/80 border-amber-700',
          text: 'text-amber-200',
          icon: <AlertTriangle className="w-5 h-5 text-amber-400" />
        };
      case 'info':
      default:
        return {
          bg: 'bg-blue-900/80 border-blue-700',
          text: 'text-blue-200',
          icon: <Info className="w-5 h-5 text-blue-400" />
        };
    }
  };

  return (
    <div className="fixed top-4 right-4 z-9999 space-y-2 max-w-md">
      {toasts.map((toast) => {
        const styles = getToastStyles(toast.type);
        return (
          <div
            key={toast.id}
            className={`${styles.bg} border rounded-lg p-4 flex items-start gap-3 backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-300`}
          >
            {styles.icon}
            <div className={`flex-1 ${styles.text} text-sm`}>{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Toast;
