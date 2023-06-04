import { useRef } from 'react';

const useCallbackDebounce = (callback: (...args: any[]) => void, debounceTime?: number) => {
  const timer = useRef<NodeJS.Timeout | null>(null);

  const debounce = (...args: unknown[]) => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(() => callback(...args), debounceTime || 500);
  };

  return debounce;
};

export default useCallbackDebounce;
