import React, { useEffect } from "react";
import { FiCheckCircle, FiInfo, FiAlertCircle, FiX } from "react-icons/fi";

export type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type,
  onClose,
  duration = 4000,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return <FiCheckCircle className="h-5 w-5" />;
      case "error":
        return <FiAlertCircle className="h-5 w-5" />;
      case "warning":
        return <FiAlertCircle className="h-5 w-5" />;
      case "info":
        return <FiInfo className="h-5 w-5" />;
      default:
        return <FiInfo className="h-5 w-5" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-50 text-green-800 border-green-200";
      case "error":
        return "bg-red-50 text-red-800 border-red-200";
      case "warning":
        return "bg-yellow-50 text-yellow-800 border-yellow-200";
      case "info":
        return "bg-blue-50 text-blue-800 border-blue-200";
      default:
        return "bg-gray-50 text-gray-800 border-gray-200";
    }
  };

  return (
    <div
      className={`
        flex items-center justify-between gap-3 
        px-4 py-3 rounded-lg shadow-lg border
        ${getStyles()}
        animate-slide-in-right
        min-w-[320px] max-w-md
      `}
    >
      <div className="flex items-center gap-3">
        {getIcon()}
        <p className="text-sm font-medium">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="hover:opacity-70 transition-opacity"
        aria-label="Cerrar notificación"
      >
        <FiX className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Toast;
