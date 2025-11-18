
import { useState, useEffect, RefObject } from 'react';

const useIntersectionObserver = <T extends HTMLElement,>(
  elementRef: RefObject<T>,
  { threshold = 0.1, root = null, rootMargin = '0px', freezeOnceVisible = true }
): boolean => {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isCurrentlyIntersecting = entry.isIntersecting;
        if (freezeOnceVisible && isCurrentlyIntersecting) {
            setIntersecting(true);
            observer.unobserve(element);
        } else if (!freezeOnceVisible) {
            setIntersecting(isCurrentlyIntersecting);
        }
      },
      { threshold, root, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [elementRef, threshold, root, rootMargin, freezeOnceVisible]);

  return isIntersecting;
};

export default useIntersectionObserver;
