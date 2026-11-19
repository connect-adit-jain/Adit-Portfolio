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
  const groupAdRef = useRef<HTMLDivElement>(null);
  const unitIRef = useRef<HTMLDivElement>(null);
  const iBoxRef = useRef<HTMLDivElement>(null);
  const iDotRef = useRef<HTMLSpanElement>(null);
  const groupTjainRef = useRef<HTMLDivElement>(null);
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

      // Initial state
      gsap.set(groupAdRef.current, {
        opacity: 0,
        x: -35,
        rotation: -12,
        transformOrigin: 'bottom right',
      });
      gsap.set(groupTjainRef.current, {
        opacity: 0,
        x: 35,
        rotation: 10,
        transformOrigin: 'bottom left',
      });
      gsap.set(unitIRef.current, {
        y: -280,
        opacity: 0,
        scale: 0.9,
      });
      gsap.set(iBoxRef.current, {
        rotation: 0,
        transformOrigin: '50% 100%',
        width: '0.28em',
      });
      gsap.set(iDotRef.current, { opacity: 1, scale: 1 });
      gsap.set('.char-bot', { yPercent: 105, rotateX: -90, opacity: 0 });

      // ── STAGE 1: "first 'I' should come with a dot" (Image 1) ──
      masterTl
        .to(unitIRef.current, {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.75,
          ease: 'bounce.out',
          delay: 0.25,
        })
        // ── STAGE 2: "I" tilts left, "AD" appears tilting into place (Image 2) ──
        .to(
          iBoxRef.current,
          {
            rotation: -38,
            duration: 0.52,
            ease: 'power2.out',
          },
          '+=0.2'
        )
        .to(
          groupAdRef.current,
          {
            opacity: 1,
            x: 0,
            rotation: 0,
            duration: 0.5,
            ease: 'power2.out',
          },
          '-=0.36'
        )
        // ── STAGE 3: "I" tilts right, "T JAIN" appears tilting into place (Image 3) ──
        .to(
          iBoxRef.current,
          {
            rotation: 36,
            duration: 0.55,
            ease: 'power1.inOut',
          },
          '+=0.12'
        )
        .to(
          groupTjainRef.current,
          {
            opacity: 1,
            x: 0,
            rotation: 0,
            duration: 0.5,
            ease: 'power2.out',
          },
          '-=0.42'
        )
        // ── STAGE 4: "I" snaps to center, dot is removed, "ADIT JAIN" fully aligned ──
        .to(iBoxRef.current, {
          rotation: 0,
          duration: 0.65,
          ease: 'elastic.out(1, 0.45)',
        })
        .to(
          iDotRef.current,
          {
            opacity: 0,
            scale: 0,
            duration: 0.28,
            ease: 'power2.out',
          },
          '-=0.42'
        )
        // Ambient glow across perfectly aligned "ADIT JAIN"
        .to(
          stageRef.current,
          {
            textShadow:
              '0 0 35px rgba(216, 203, 179, 0.55), 0 0 15px rgba(216, 203, 179, 0.3)',
            duration: 0.35,
            ease: 'power2.out',
          },
          '-=0.2'
        )
        // ── STAGE 5: Letters smoothly change / morph into "PORTFOLIO" ──
        .to(
          '.char-top',
          {
            yPercent: -105,
            rotateX: 90,
            opacity: 0,
            duration: 0.65,
            ease: 'power2.inOut',
            stagger: 0.04,
          },
          '+=0.8'
        )
        .to(
          '.char-bot',
          {
            yPercent: 0,
            rotateX: 0,
            opacity: 1,
            duration: 0.65,
            ease: 'power2.inOut',
            stagger: 0.04,
          },
          '-=0.6'
        )
        // Expand widths for the incoming PORTFOLIO characters (R, F, and O in slot 6)
        .to(
          iBoxRef.current,
          {
            width: '0.66em',
            duration: 0.45,
            ease: 'power2.out',
          },
          '-=0.52'
        )
        .to(
          '.space-slot',
          {
            width: '0.58em',
            duration: 0.45,
            ease: 'power2.out',
          },
          '-=0.45'
        )
        .to(
          '.slot-w-j',
          {
            width: '0.68em',
            duration: 0.45,
            ease: 'power2.out',
          },
          '-=0.45'
        )
        .to(
          stageRef.current,
          {
            textShadow:
              '0 0 40px rgba(216, 203, 179, 0.65), 0 4px 30px rgba(30, 30, 28, 0.9)',
            duration: 0.4,
          },
          '-=0.2'
        )
        // Hold on PORTFOLIO (~1.1s), then curtain exit to hero!
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

      {/* Center Reel Stage: Morphing Typography */}
      <div className="preloader-center-stage">
        {/* Soft Radial Spotlight Halo (Image 1) */}
        <div className="preloader-spotlight" aria-hidden="true" />

        {/* Unified 9-character Stage: ADIT JAIN -> PORTFOLIO */}
        <div ref={stageRef} className="preloader-stage" aria-label="Adit Jain Portfolio">
          {/* Group 1: AD */}
          <div ref={groupAdRef} className="group-ad">
            <div className="slot slot-w-a">
              <span className="char-top">A</span>
              <span className="char-bot">P</span>
            </div>
            <div className="slot slot-w-d">
              <span className="char-top">D</span>
              <span className="char-bot">O</span>
            </div>
          </div>

          {/* Group 2: "I" with dot (exact same size as other letters, dot disappears on assemble) */}
          <div ref={unitIRef} className="unit-i">
            <div ref={iBoxRef} className="i-glyph-box">
              <span className="char-top">I</span>
              <span className="char-bot">R</span>
            </div>
            <span ref={iDotRef} className="i-dot" aria-hidden="true" />
          </div>

          {/* Group 3: T JAIN */}
          <div ref={groupTjainRef} className="group-tjain">
            <div className="slot slot-w-t">
              <span className="char-top">T</span>
              <span className="char-bot">T</span>
            </div>
            <div className="slot space-slot">
              <span className="char-top">&nbsp;</span>
              <span className="char-bot">F</span>
            </div>
            <div className="slot slot-w-j">
              <span className="char-top">J</span>
              <span className="char-bot">O</span>
            </div>
            <div className="slot slot-w-a2">
              <span className="char-top">A</span>
              <span className="char-bot">L</span>
            </div>
            <div className="slot slot-w-i2">
              <span className="char-top">I</span>
              <span className="char-bot">I</span>
            </div>
            <div className="slot slot-w-n">
              <span className="char-top">N</span>
              <span className="char-bot">O</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Background Halftone Grid */}
      <div className="preloader-bg-stipple" aria-hidden="true" />
    </aside>
  );
};
