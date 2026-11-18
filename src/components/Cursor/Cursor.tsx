import React, { useEffect, useState, useRef } from 'react';
import { isReducedMotion } from '../../animations/animationPresets';
import './Cursor.css';

export const Cursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || isReducedMotion() || window.innerWidth <= 768) {
      return;
    }

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) setIsVisible(true);

      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    let animationFrameId: number;
    const render = () => {
      // Smooth linear interpolation for ring
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    animationFrameId = requestAnimationFrame(render);

    // Interactive element hover detection
    const handleElementOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.getAttribute('role') === 'button'
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mouseover', handleElementOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseover', handleElementOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  return (
    <>
      <div
        ref={dotRef}
        className={`custom-cursor-dot ${isVisible ? 'visible' : ''}`}
        aria-hidden="true"
      />
      <div
        ref={ringRef}
        className={`custom-cursor-ring ${isVisible ? 'visible' : ''} ${isHovered ? 'hovered' : ''}`}
        aria-hidden="true"
      />
    </>
  );
};
