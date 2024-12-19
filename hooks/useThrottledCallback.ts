import { useRef, useCallback } from "react";

/**
 * Custom hook that returns a throttled version of a callback function
 * @param callback The function to throttle
 * @param delay The minimum time (in ms) that must pass between callback executions
 * @param callAfterDelay If true, queues the last call to execute after the delay instead of dropping it
 */
export function useThrottledCallback(
  callback: (...args: any[]) => void,
  delay: number,
  callAfterDelay: boolean = false
) {
  // Track the timestamp of the last callback execution
  const lastCall = useRef(0);
  // Store the timeout for delayed execution
  const timeoutRef = useRef<NodeJS.Timeout>();
  // Store the latest arguments for delayed execution
  const pendingArgsRef = useRef<any[]>();

  return useCallback(
    (...args: any[]) => {
      const now = Date.now();
      const timeSinceLastCall = now - lastCall.current;

      // Clear any existing queued execution
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // If enough time has passed, execute immediately
      if (timeSinceLastCall >= delay) {
        callback(...args);
        lastCall.current = now;
      }
      // If we want to queue the last call during the delay period
      else if (callAfterDelay) {
        // Store the latest arguments
        pendingArgsRef.current = args;

        // Queue the execution for when the delay period ends
        timeoutRef.current = setTimeout(() => {
          if (pendingArgsRef.current) {
            callback(...pendingArgsRef.current);
            lastCall.current = Date.now();
            pendingArgsRef.current = undefined;
          }
        }, delay - timeSinceLastCall);
      }
      // If callAfterDelay is false, the call is simply dropped
    },
    [callback, delay, callAfterDelay]
  );
}
