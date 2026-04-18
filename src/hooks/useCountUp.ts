import { useState, useCallback, useRef } from "react";

interface UseCountUpOptions {
  start?: number;
  end: number;
  duration?: number;
  decimals?: number;
}

interface UseCountUpReturn {
  value: number;
  startAnimation: () => void;
}

export function useCountUp({
  start = 0,
  end,
  duration = 1000,
  decimals = 0,
}: UseCountUpOptions): UseCountUpReturn {
  const [value, setValue] = useState(start);
  const animatingRef = useRef(false);

  const startAnimation = useCallback(() => {
    if (animatingRef.current) return;
    animatingRef.current = true;

    const startTime = performance.now();
    const range = end - start;

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + range * eased;
      setValue(parseFloat(current.toFixed(decimals)));

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setValue(parseFloat(end.toFixed(decimals)));
        animatingRef.current = false;
      }
    };

    requestAnimationFrame(step);
  }, [start, end, duration, decimals]);

  return { value, startAnimation };
}
