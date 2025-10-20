import React from "react";
import { FiAlertTriangle, FiX } from "react-icons/fi";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: "danger" | "warning" | "info";
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
  type = "warning",
}) => {
  if (!isOpen) return null;

  const typeStyles = {
    danger: "bg-red-200 text-red-600",
    warning: "bg-yellow-100 text-yellow-600",
    info: "bg-blue-100 text-blue-600",
  };

  const buttonStyles = {
    danger: "bg-red-600 hover:bg-red-700",
    warning: "bg-yellow-600 hover:bg-yellow-700",
    info: "bg-blue-600 hover:bg-blue-700",
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto ">
      <div className="flex items-center justify-center min-h-screen  ">
        <div
          className="fixed inset-0 transition-opacity bg-bg-400/50 backdrop-blur-sm"
          onClick={onCancel}
        />
        <div className="inline-block align-bottom bg-bg-400 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-bg-400 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div
                className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${typeStyles[type]} sm:mx-0 sm:h-10 sm:w-10`}
              >
                <FiAlertTriangle className="h-4 w-4" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                <h3 className="text-lg leading-6 font-medium text-white flex items-center justify-between">
                  {title}
                  <button
                    onClick={onCancel}
                    className="text-white-100/70 hover:text-white"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-white-100/70">{message}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-bg-100 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2">
            <button
              type="button"
              onClick={onConfirm}
              className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${buttonStyles[type]}`}
            >
              {confirmText}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-bg-200 shadow-sm px-4 py-2 bg-bg-300 text-base font-medium text-white hover:bg-bg-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-100 sm:mt-0 sm:w-auto sm:text-sm"
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
