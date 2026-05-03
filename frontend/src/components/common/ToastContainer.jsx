import React from 'react';
import { useToast } from '../../hooks/useToast.js';

function ToastContainer() {
  const { toasts } = useToast();

  const getToastClasses = (type) => {
    switch (type) {
      case 'success':
        return 'bg-emerald-500 border-emerald-700 text-white';
      case 'error':
        return 'bg-red-500 border-red-700 text-white';
      case 'warning':
        return 'bg-amber-500 border-amber-700 text-white';
      case 'info':
      default:
        return 'bg-blue-500 border-blue-700 text-white';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-lg border px-4 py-2 shadow-lg ${getToastClasses(toast.type)}`}
          role="alert"
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;
