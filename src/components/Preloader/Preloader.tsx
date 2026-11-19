import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowRight, Compass } from 'lucide-react';
import { gsap } from '../../animations/gsap';
import { isReducedMotion } from '../../animations/animationPresets';
import './Preloader.css';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const adRef = useRef<HTMLSpanElement>(null);
  const pivotRef = useRef<HTMLSpanElement>(null);
  const tjainRef = useRef<HTMLSpanElement>(null);
  const portfolioRef = useRef<HTMLDivElement>(null);
  const skipBtnRef = useRef<HTMLButtonElement>(null);

  const [isSkipped, setIsSkipped] = useState(false);
  const isCompletedRef = useRef(false);

  // Complete preloader and trigger curtain exit
  const finishPreloader = useCallback(() => {
    if (isCompletedRef.current) return;
    isCompletedRef.current = true;

    // Dispatch event to let Hero know curtain exit is happening
    window.dispatchEvent(new Event('start-hero-reveal'));

    if (isReducedMotion()) {
      onComplete();
      return;
    }

    // Curtain exit animation upward into the loaded Hero page
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          onComplete();
        },
      });

      tl.to([stageRef.current, skipBtnRef.current], {
        opacity: 0,
        y: -30,
        duration: 0.4,
        ease: 'power2.in',
      }).to(
        containerRef.current,
        {
          yPercent: -100,
          duration: 0.75,
          ease: 'power4.inOut',
        },
        '-=0.1'
      );
    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  // Handle Skip Intro
  const handleSkip = useCallback(() => {
    setIsSkipped(true);
    finishPreloader();
  }, [finishPreloader]);

  useEffect(() => {
    // Keyboard listener for Escape key to skip intro
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    if (isReducedMotion()) {
      onComplete();
      return () => window.removeEventListener('keydown', handleKeyDown);
    }

    const ctx = gsap.context(() => {
      const masterTl = gsap.timeline();

      // Initial state: hide parts, position "i" high above
      gsap.set(adRef.current, { opacity: 0, x: -35 });
      gsap.set(tjainRef.current, { opacity: 0, x: 35 });
      gsap.set(portfolioRef.current, { opacity: 0, y: 22 });
      gsap.set(pivotRef.current, {
        y: -300,
        opacity: 0,
        scale: 0.85,
        transformOrigin: '50% 0%',
      });

      // Stage 1: "i" drops from up to down (0.2s – 0.95s)
      masterTl
        .to(
          pivotRef.current,
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.75,
            ease: 'bounce.out',
            delay: 0.25,
          }
        )
        // Stage 2: "i" swings left (0.95s – 1.45s)
        .to(
          pivotRef.current,
          {
            rotation: -28,
            x: -24,
            duration: 0.5,
            ease: 'power2.out',
          },
          '+=0.1'
        )
        // As it swings left, "AD" appears on the left
        .to(
          adRef.current,
          {
            opacity: 1,
            x: 0,
            duration: 0.45,
            ease: 'power2.out',
          },
          '-=0.35'
        )
        // Stage 3: "i" swings right (1.5s – 2.1s)
        .to(
          pivotRef.current,
          {
            rotation: 26,
            x: 20,
            duration: 0.58,
            ease: 'power1.inOut',
          },
          '+=0.05'
        )
        // As it swings right, "T JAIN" appears on the right
        .to(
          tjainRef.current,
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            ease: 'power2.out',
          },
          '-=0.45'
        )
        // Stage 4: "i" swings back to center and settles into place (2.15s – 2.8s)
        .to(
          pivotRef.current,
          {
            rotation: 0,
            x: 0,
            duration: 0.65,
            ease: 'elastic.out(1, 0.4)',
          }
        )
        // Subtle glow across the fully assembled "ADIT JAIN"
        .to(
          [adRef.current, pivotRef.current, tjainRef.current],
          {
            textShadow: '0 0 35px rgba(216, 203, 179, 0.55), 0 0 15px rgba(216, 203, 179, 0.3)',
            duration: 0.4,
            ease: 'power2.out',
          },
          '-=0.2'
        )
        // Stage 5: After "ADIT JAIN", "PORTFOLIO" text comes in!
        .fromTo(
          portfolioRef.current,
          { opacity: 0, y: 22, letterSpacing: '0.28em' },
          {
            opacity: 1,
            y: 0,
            letterSpacing: '0.14em',
            duration: 0.75,
            ease: 'power3.out',
          },
          '+=0.3'
        )
        // Stage 6: Hold so the full composition is visible (~1.1s)
        // Stage 7: Transition to hero section
        .call(
          () => {
            finishPreloader();
          },
          undefined,
          '+=1.1'
        );
    }, containerRef);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      ctx.revert();
    };
  }, [finishPreloader, handleSkip, onComplete]);

  return (
    <aside
      ref={containerRef}
      className={`cinematic-preloader ${isSkipped ? 'is-skipped' : ''}`}
      role="dialog"
      aria-label="Cinematic introduction sequence"
      aria-modal="true"
    >
      {/* Top Bar with Minimal Metadata & Skip Intro */}
      <div className="preloader-top-bar">
        <div className="preloader-brand-tag">
          <Compass size={13} aria-hidden="true" />
          <span>NIAT JAIPUR — VGU</span>
        </div>

        <button
          ref={skipBtnRef}
          type="button"
          className="preloader-skip-btn"
          onClick={handleSkip}
          aria-label="Skip introduction animation"
        >
          <span>Skip</span>
          <ArrowRight size={13} aria-hidden="true" />
          <span className="key-hint" aria-hidden="true">ESC</span>
        </button>
      </div>

      {/* Center Kinetic Stage: "i" Drops -> Swings Left ("AD") -> Swings Right ("T JAIN") -> "ADIT JAIN" -> "PORTFOLIO" */}
      <div className="preloader-center-stage">
        <div ref={stageRef} className="preloader-kinetic-stage">
          {/* Assembled Name Lockup */}
          <div className="preloader-name-assembly" aria-label="Adit Jain">
            <span ref={adRef} className="assembly-part assembly-left">
              AD
            </span>
            <span ref={pivotRef} className="assembly-i-pivot">
              <span className="assembly-i-letter">I</span>
            </span>
            <span ref={tjainRef} className="assembly-part assembly-right">
              T&nbsp;JAIN
            </span>
          </div>

          {/* PORTFOLIO reveal following ADIT JAIN */}
          <div ref={portfolioRef} className="preloader-portfolio-wrap" aria-label="Portfolio">
            <span className="preloader-portfolio-text">PORTFOLIO</span>
          </div>
        </div>
      </div>

      {/* Subtle Background Halftone Grid */}
      <div className="preloader-bg-stipple" aria-hidden="true" />
    </aside>
  );
};
