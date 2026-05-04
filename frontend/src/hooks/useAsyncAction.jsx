import { useState, useCallback } from "react";

// Custom hook to run async actions with loading/error state and toast integration.
// Emits a global CustomEvent 'app:toast' with detail { message, type } on success/error.
export default function useAsyncAction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const notify = (message, type = "info") => {
    try {
      window.dispatchEvent(
        new CustomEvent("app:toast", { detail: { message, type } }),
      );
    } catch (e) {
      // fallback: console
      console[type === "error" ? "error" : "log"](message);
    }
  };

  const execute = useCallback(async (asyncFn, options = {}) => {
    // asyncFn can be a function returning a promise, or a promise itself
    const { successMessage, onSuccess, onError } = options;
    setLoading(true);
    setError(null);
    try {
      const result =
        typeof asyncFn === "function" ? await asyncFn() : await asyncFn;
      if (successMessage) notify(successMessage, "success");
      if (onSuccess) onSuccess(result);
      setLoading(false);
      return { success: true, data: result };
    } catch (err) {
      const message =
        (err && (err.message || err?.data?.message)) || "An error occurred";
      setError(message);
      notify(message, "error");
      if (onError) onError(err);
      setLoading(false);
      return { success: false, error: err };
    }
  }, []);

  return { execute, loading, error };
}
