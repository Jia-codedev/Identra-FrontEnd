"use client";

import { useRef, useCallback, useEffect } from "react";

export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
) {
  const timer = useRef<number | null>(null);

  // Keep a stable reference to the latest callback
  const savedCallback = useRef(callback);
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  const debounced = useCallback((...args: Parameters<T>) => {
    if (typeof window === "undefined") return;
    if (timer.current) {
      window.clearTimeout(timer.current);
    }
    timer.current = window.setTimeout(() => {
      savedCallback.current(...args);
    }, delay) as unknown as number;
  }, [delay]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timer.current) {
        window.clearTimeout(timer.current);
      }
    };
  }, []);

  return debounced;
}

export default useDebouncedCallback;
