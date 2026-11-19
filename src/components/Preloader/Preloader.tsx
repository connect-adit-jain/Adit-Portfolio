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
  const page1Ref = useRef<HTMLDivElement>(null);
  const page2Ref = useRef<HTMLDivElement>(null);
  const adRef = useRef<HTMLSpanElement>(null);
  const pivotRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const tjainRef = useRef<HTMLSpanElement>(null);
  const portfolioTextRef = useRef<HTMLHeadingElement>(null);
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

      tl.to([page1Ref.current, page2Ref.current, skipBtnRef.current], {
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

      // Initial state
      gsap.set(page1Ref.current, { opacity: 1 });
      gsap.set(page2Ref.current, { opacity: 0, display: 'none' });
      gsap.set(adRef.current, { opacity: 0, x: -35 });
      gsap.set(tjainRef.current, { opacity: 0, x: 35 });
      gsap.set(pivotRef.current, {
        y: -280,
        opacity: 0,
        scale: 0.9,
      });
      gsap.set(barRef.current, {
        rotation: 0,
        transformOrigin: '50% 100%',
      });

      // ── STAGE 1: "first 'I' should come with a dot" (Image 1) ──
      masterTl
        .to(pivotRef.current, {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.75,
          ease: 'bounce.out',
          delay: 0.25,
        })
        // ── STAGE 2: "I" bar tilts left -> "AD" appears (Image 2) ──
        .to(
          barRef.current,
          {
            rotation: -44,
            duration: 0.52,
            ease: 'power2.out',
          },
          '+=0.25'
        )
        .to(
          adRef.current,
          {
            opacity: 1,
            x: 0,
            duration: 0.45,
            ease: 'power2.out',
          },
          '-=0.38'
        )
        // ── STAGE 3: "I" bar tilts right -> "T JAIN" appears (Image 3) ──
        .to(
          barRef.current,
          {
            rotation: 40,
            duration: 0.58,
            ease: 'power1.inOut',
          },
          '+=0.15'
        )
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
        // ── STAGE 4: "I" snaps back to vertical center -> "ADIT JAIN" assembled ──
        .to(barRef.current, {
          rotation: 0,
          duration: 0.65,
          ease: 'elastic.out(1, 0.45)',
        })
        .to(
          [adRef.current, pivotRef.current, tjainRef.current],
          {
            textShadow:
              '0 0 35px rgba(216, 203, 179, 0.55), 0 0 15px rgba(216, 203, 179, 0.3)',
            duration: 0.4,
            ease: 'power2.out',
          },
          '-=0.2'
        )
        // ── STAGE 5: "then PORTFOLIO in next page" (Image 4) ──
        // Fade out Page 1
        .to(
          page1Ref.current,
          {
            opacity: 0,
            scale: 0.95,
            duration: 0.45,
            ease: 'power2.in',
          },
          '+=0.75'
        )
        // Activate and reveal Page 2 (huge PORTFOLIO)
        .set(page2Ref.current, { display: 'flex' })
        .fromTo(
          page2Ref.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.3 }
        )
        .fromTo(
          portfolioTextRef.current,
          { opacity: 0, scale: 0.92, y: 25 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.75,
            ease: 'power3.out',
          },
          '-=0.15'
        )
        // Hold on PORTFOLIO (~1.0s), then curtain exit to hero!
        .call(
          () => {
            finishPreloader();
          },
          undefined,
          '+=1.0'
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

      {/* Center Reel Stage: Page 1 (AD + I with dot + T JAIN) & Page 2 (PORTFOLIO) */}
      <div className="preloader-center-stage">
        {/* Soft Radial Spotlight Halo */}
        <div className="preloader-spotlight" aria-hidden="true" />

        {/* ── Page 1: "I" with dot -> AD -> T JAIN -> ADIT JAIN ── */}
        <div ref={page1Ref} className="preloader-page preloader-page-name">
          <div className="preloader-name-assembly" aria-label="Adit Jain">
            <span ref={adRef} className="assembly-part assembly-left">
              AD
            </span>

            {/* Middle: "I" bar + circular dot (Image 1, 2, 3) */}
            <div ref={pivotRef} className="assembly-i-unit">
              <span ref={barRef} className="assembly-i-bar" />
              <span ref={dotRef} className="assembly-i-dot" />
            </div>

            <span ref={tjainRef} className="assembly-part assembly-right">
              T&nbsp;JAIN
            </span>
          </div>
        </div>

        {/* ── Page 2: "then PORTFOLIO in next page" (Image 4) ── */}
        <div
          ref={page2Ref}
          className="preloader-page preloader-page-portfolio"
          aria-label="Portfolio"
        >
          <h1 ref={portfolioTextRef} className="preloader-huge-portfolio">
            PORTFOLIO
          </h1>
        </div>
      </div>

      {/* Subtle Background Halftone Grid */}
      <div className="preloader-bg-stipple" aria-hidden="true" />
    </aside>
  );
};
