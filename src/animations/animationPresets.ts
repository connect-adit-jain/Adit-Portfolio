import { gsap } from './gsap';

export const isReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= 768;
};

/**
 * Editorial Fade-In-Up for section elements
 */
export const fadeInUp = (
  element: gsap.DOMTarget,
  trigger?: gsap.DOMTarget,
  delay: number = 0
) => {
  if (isReducedMotion()) {
    gsap.set(element, { opacity: 1, y: 0 });
    return null;
  }

  const yOffset = isMobile() ? 20 : 35;
  const duration = isMobile() ? 0.6 : 0.85;

  return gsap.fromTo(
    element,
    { opacity: 0, y: yOffset },
    {
      opacity: 1,
      y: 0,
      duration,
      delay,
      ease: 'power3.out',
      scrollTrigger: trigger
        ? {
            trigger,
            start: 'top 85%',
            toggleActions: 'play none none none',
          }
        : undefined,
    }
  );
};

/**
 * Staggered entrance for list of items or cards
 */
export const staggerChildren = (
  parent: gsap.DOMTarget,
  childrenSelector: string,
  staggerTime: number = 0.1
) => {
  if (isReducedMotion()) {
    const parentEl = typeof parent === 'string' ? document.querySelector(parent) : parent;
    if (parentEl && 'querySelectorAll' in (parentEl as HTMLElement)) {
      const items = (parentEl as HTMLElement).querySelectorAll(childrenSelector);
      items.forEach((item) => {
        (item as HTMLElement).style.opacity = '1';
        (item as HTMLElement).style.transform = 'none';
      });
    }
    return null;
  }

  const yOffset = isMobile() ? 15 : 25;

  return gsap.fromTo(
    `${typeof parent === 'string' ? parent : ''} ${childrenSelector}`,
    { opacity: 0, y: yOffset },
    {
      opacity: 1,
      y: 0,
      stagger: isMobile() ? staggerTime * 0.7 : staggerTime,
      duration: isMobile() ? 0.5 : 0.7,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: parent,
        start: 'top 82%',
        toggleActions: 'play none none none',
      },
    }
  );
};

/**
 * Editorial Line Drawing Animation
 */
export const revealLine = (line: gsap.DOMTarget, trigger?: gsap.DOMTarget) => {
  if (isReducedMotion()) {
    gsap.set(line, { scaleX: 1 });
    return null;
  }

  return gsap.fromTo(
    line,
    { scaleX: 0, transformOrigin: 'left center' },
    {
      scaleX: 1,
      duration: 1.1,
      ease: 'expo.out',
      scrollTrigger: trigger
        ? {
            trigger,
            start: 'top 88%',
            toggleActions: 'play none none none',
          }
        : undefined,
    }
  );
};
