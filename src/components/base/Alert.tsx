import { CheckCircleIcon, ExclamationTriangleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect } from "react";

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  alertStatus: boolean;
  changeAlertStatus: (status: boolean) => void;
  className?: string;
}

export const Alert = ({ 
  type, 
  message, 
  alertStatus, 
  changeAlertStatus, 
  className = "" 
}: AlertProps) => {
  useEffect(() => {
    if (alertStatus) {
      const timer = setTimeout(() => {
        changeAlertStatus(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alertStatus, changeAlertStatus]);

  if (!alertStatus || !message) return null;

  const getAlertStyles = () => {
    switch (type) {
      case 'success':
        return "bg-green-50 border-green-200 text-green-800";
      case 'error':
        return "bg-red-50 border-red-200 text-red-800";
      case 'warning':
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case 'info':
      default:
        return "bg-blue-50 border-blue-200 text-blue-800";
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-green-400" />;
      case 'error':
        return <XMarkIcon className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400" />;
      case 'info':
      default:
        return <CheckCircleIcon className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-md w-full ${className}`}>
      <div className={`rounded-lg border p-4 shadow-md ${getAlertStyles()}`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium">{message}</p>
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              className="inline-flex rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => changeAlertStatus(false)}
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};