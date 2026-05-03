import { useState, useCallback } from 'react';
import { useToast } from './useToast.jsx'; // Update import path

export const useAsyncAction = (action, successMessage) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { success, error: toastError } = useToast();

  const execute = useCallback(async (...args) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await action(...args);
      if (successMessage) {
        success(successMessage);
      }
      return result;
    } catch (err) {
      const errorMessage = err.message || 'An unexpected error occurred.';
      setError(errorMessage);
      toastError(errorMessage);
      throw err; // Re-throw to allow components to handle specific errors if needed
    } finally {
      setIsLoading(false);
    }
  }, [action, successMessage, success, toastError]);

  return { execute, isLoading, error };
};
