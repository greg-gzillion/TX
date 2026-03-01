import { useEffect, useRef } from 'react';

export const useScrollPrevention = () => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      e.preventDefault();
    };

    const element = elementRef.current;
    if (element) {
      element.addEventListener('click', handleClick);
    }

    return () => {
      if (element) {
        element.removeEventListener('click', handleClick);
      }
    };
  }, []);

  return elementRef;
};
