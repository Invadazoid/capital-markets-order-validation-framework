import { useState, useCallback, useRef } from "react";

let toastId = 0;

export function useToast(duration = 4000) {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef({});

  const addToast = useCallback((message, type = "success") => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message, type }]);

    timersRef.current[id] = setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
      delete timersRef.current[id];
    }, duration);

    return id;
  }, [duration]);

  const removeToast = useCallback((id) => {
    clearTimeout(timersRef.current[id]);
    delete timersRef.current[id];
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
}
