import { useState, useCallback, useContext, createContext } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const toastId = Math.random().toString(36).substr(2, 9); // Simple unique ID

  const addToast = useCallback((message, type = 'info') => {
    setToasts((prev) => [...prev, { id: toastId, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== toastId));
    }, 5000); // Auto-dismiss after 5 seconds
  }, [toastId]);

  const success = useCallback((message) => addToast(message, 'success'), [addToast]);
  const error = useCallback((message) => addToast(message, 'error'), [addToast]);
  const info = useCallback((message) => addToast(message, 'info'), [addToast]);
  const warning = useCallback((message) => addToast(message, 'warning'), [addToast]);

  return (
    <ToastContext.Provider value={{ toasts, success, error, info, warning }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
