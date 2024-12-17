import { useRef, useCallback } from "react";

export function useThrottledCallback(
  callback: (...args: any[]) => void,
  delay: number,
  callAfterDelay: boolean = false
) {
  const lastCall = useRef(0);

  const throttledCallback = useCallback(
    (...args: any[]) => {
      const now = Date.now();
      const timeSinceLastCall = now - lastCall.current;

      if (timeSinceLastCall >= delay) {
        callback(...args);
        lastCall.current = now;
      } else if (callAfterDelay) {
        setTimeout(() => {
          callback(...args);
        }, delay - timeSinceLastCall);
      }
    },
    [callback, delay]
  );

  return throttledCallback;
}
