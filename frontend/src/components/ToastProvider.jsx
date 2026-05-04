import React, { useEffect, useState, useCallback } from "react";
import Toast from "./ui/Toast";

let idCounter = 1;

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const onEvent = useCallback((e) => {
    const detail = e && e.detail ? e.detail : {};
    const message = detail.message || String(detail || "");
    const type = detail.type || "info";
    const duration = detail.duration || 4000;
    const id = idCounter++;

    setToasts((t) => [...t, { id, message, type, duration }]);
  }, []);

  useEffect(() => {
    window.addEventListener("app:toast", onEvent);
    return () => window.removeEventListener("app:toast", onEvent);
  }, [onEvent]);

  const remove = (id) => setToasts((t) => t.filter((x) => x.id !== id));

  return (
    <>
      {children}

      <div className="fixed right-4 bottom-4 z-50 flex flex-col gap-2 items-end">
        {toasts.map((t) => (
          <div key={t.id} onAnimationEnd={() => {}}>
            <Toast
              message={t.message}
              type={t.type}
              duration={t.duration}
              onClose={() => remove(t.id)}
            />
          </div>
        ))}
      </div>
    </>
  );
}
