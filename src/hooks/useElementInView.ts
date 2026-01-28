import { useState, useRef, useEffect } from 'react';

export const useElementInView = (
  options: IntersectionObserverInit
): [React.RefObject<HTMLLIElement | null>, boolean] => {
  const [isInView, setIsInView] = useState(false);
  const targetRef = useRef(null);

  useEffect(() => {
    const element = targetRef.current;
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      setIsInView(entry.isIntersecting);
    }, options);

    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [options]);

  return [targetRef, isInView];
};
