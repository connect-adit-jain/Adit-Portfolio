import React, { useEffect, useState, useRef } from 'react';
import { isReducedMotion } from '../../animations/animationPresets';
import './Cursor.css';

type CursorMode = 'default' | 'button' | 'project';

export const Cursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [cursorMode, setCursorMode] = useState<CursorMode>('default');
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

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

    const handleMouseDown = () => {
      setIsClicking(true);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    let animationFrameId: number;
    const render = () => {
      // Smooth linear interpolation for the orbit ring (lerp)
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    animationFrameId = requestAnimationFrame(render);

    // Contextual hover detection: project vs button vs normal
    const handleElementOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const projectTarget = target.closest(
        '.project-card, .project-editorial-card, .dossier-route-card, [data-cursor="project"], .project-item'
      );
      if (projectTarget) {
        setCursorMode('project');
        return;
      }

      const buttonTarget = target.closest(
        'button, a, [role="button"], input[type="submit"], .hero-btn-primary, .hero-btn-secondary'
      );
      if (buttonTarget) {
        setCursorMode('button');
        return;
      }

      setCursorMode('default');
    };

    window.addEventListener('mouseover', handleElementOver, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseover', handleElementOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  return (
    <>
      {/* Central Sand Dot */}
      <div
        ref={dotRef}
        className={`custom-cursor-dot ${isVisible ? 'visible' : ''} ${isClicking ? 'clicking' : ''}`}
        aria-hidden="true"
      />

      {/* Orbit Ring with Project View & Button Contraction */}
      <div
        ref={ringRef}
        className={`custom-cursor-ring ${isVisible ? 'visible' : ''} mode-${cursorMode} ${
          isClicking ? 'clicking' : ''
        }`}
        aria-hidden="true"
      >
        <span className="cursor-project-label">VIEW ↗</span>
      </div>
    </>
  );
};
