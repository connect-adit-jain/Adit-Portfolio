import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowRight, Compass } from 'lucide-react';
import { gsap } from '../../animations/gsap';
import { isReducedMotion } from '../../animations/animationPresets';
import { runAlphabeticalMorph } from '../../animations/alphabeticalMorph';
import './Preloader.css';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleLockupRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLSpanElement>(null);
  const groupAdRef = useRef<HTMLDivElement>(null);
  const unitIRef = useRef<HTMLDivElement>(null);
  const iBoxRef = useRef<HTMLDivElement>(null);
  const iDotRef = useRef<HTMLSpanElement>(null);
  const groupTjainRef = useRef<HTMLDivElement>(null);
  const skipBtnRef = useRef<HTMLButtonElement>(null);
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [isSkipped, setIsSkipped] = useState(false);
  const isCompletedRef = useRef(false);

  // Complete preloader and handover to Hero
  const finishPreloader = useCallback(() => {
    if (isCompletedRef.current) return;
    isCompletedRef.current = true;

    // Dispatch events to let Hero know the text has arrived and settled
    window.dispatchEvent(new Event('hero-text-settled'));
    window.dispatchEvent(new Event('preloader-complete'));

    onComplete();
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
          ease: 'power3.out',
        })
        .to(
          iDotRef.current,
          {
            opacity: 0,
            scale: 0,
            duration: 0.28,
            ease: 'power2.out',
            onComplete: () => {
              if (iDotRef.current) iDotRef.current.style.display = 'none';
            },
          },
          '-=0.42'
        )
        // ── STAGE 5: Letters of ADIT JAIN change alphabetically to PORTFOLIO ──
        .call(
          () => {
            const morphSlots = slotRefs.current
              .filter((el): el is HTMLDivElement => el !== null)
              .map(cell => ({
                cell,
              }));

            runAlphabeticalMorph({
              slots: morphSlots,
              fromText: 'ADIT JAIN',
              toText: 'PORTFOLIO',
              duration: 1.15,
              stagger: 0.035,
              onComplete: () => {
                // Pause on PORTFOLIO (~0.7s)
                gsap.delayedCall(0.7, () => {
                  // ── STAGE 6: Seamless Transition: The preloader text moves to hero section with morph! ──
                  // 1. Fade out preloader dark backdrop and surrounding UI, revealing hero canvas underneath
                  gsap.to(
                    [
                      '.preloader-spotlight',
                      '.preloader-bg-stipple',
                      '.preloader-top-bar',
                      containerRef.current,
                    ],
                    {
                      opacity: 0,
                      duration: 0.85,
                      ease: 'power2.out',
                    }
                  );

                  // 2. Measure exact target coordinates of the hero title lockup
                  let targetY = window.innerHeight * 0.35;
                  let targetX = 0;
                  const heroLockup = document.querySelector('.hero-title-lockup');
                  if (heroLockup && titleLockupRef.current) {
                    const heroRect = heroLockup.getBoundingClientRect();
                    const preloaderRect = titleLockupRef.current.getBoundingClientRect();
                    if (heroRect.top > 0) {
                      targetY = heroRect.top - preloaderRect.top;
                      targetX = heroRect.left - preloaderRect.left;
                    }
                  }

                  // The preloader text glides smoothly from center to exact bottom hero position
                  gsap.to(titleLockupRef.current, {
                    x: targetX,
                    y: targetY,
                    duration: 1.35,
                    ease: 'power3.inOut',
                  });

                  // 3. As it moves down, it morphs from PORTFOLIO back to ADIT JAIN
                  runAlphabeticalMorph({
                    slots: morphSlots,
                    fromText: 'PORTFOLIO',
                    toText: 'ADIT JAIN',
                    duration: 1.15,
                    delay: 0.1,
                    stagger: 0.035,
                  });

                  // 4. The small PORTFOLIO tag appears at bottom-left of ADIT JAIN
                  gsap.to(tagRef.current, {
                    opacity: 1,
                    duration: 0.5,
                    delay: 0.85,
                    ease: 'power2.out',
                    onComplete: () => {
                      finishPreloader();
                    },
                  });
                });
              },
            });
          },
          undefined,
          '+=0.6' // clean pause on settled ADIT JAIN
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

        <div ref={titleLockupRef} className="preloader-title-lockup">
          {/* Unified 9-character Stage: ADIT JAIN -> PORTFOLIO -> ADIT JAIN */}
          <div ref={stageRef} className="preloader-stage" aria-label="Adit Jain Portfolio">
            {/* Group 1: AD */}
            <div ref={groupAdRef} className="group-ad">
              <div
                ref={el => { slotRefs.current[0] = el; }}
                className="slot slot-w-a"
              >
                <span className="slot-inner">A</span>
              </div>
              <div
                ref={el => { slotRefs.current[1] = el; }}
                className="slot slot-w-d"
              >
                <span className="slot-inner">D</span>
              </div>
            </div>

            {/* Group 2: Unit "I" with dot */}
            <div ref={unitIRef} className="unit-i">
              <div
                ref={el => {
                  iBoxRef.current = el;
                  slotRefs.current[2] = el;
                }}
                className="i-glyph-box slot-w-i"
              >
                <span className="slot-inner">I</span>
              </div>
              <span ref={iDotRef} className="i-dot" aria-hidden="true" />
            </div>

            {/* Group 3: T JAIN */}
            <div ref={groupTjainRef} className="group-tjain">
              <div
                ref={el => { slotRefs.current[3] = el; }}
                className="slot slot-w-t"
              >
                <span className="slot-inner">T</span>
              </div>
              <div
                ref={el => { slotRefs.current[4] = el; }}
                className="slot space-slot"
              >
                <span className="slot-inner">&nbsp;</span>
              </div>
              <div
                ref={el => { slotRefs.current[5] = el; }}
                className="slot slot-w-j"
              >
                <span className="slot-inner">J</span>
              </div>
              <div
                ref={el => { slotRefs.current[6] = el; }}
                className="slot slot-w-a2"
              >
                <span className="slot-inner">A</span>
              </div>
              <div
                ref={el => { slotRefs.current[7] = el; }}
                className="slot slot-w-i2"
              >
                <span className="slot-inner">I</span>
              </div>
              <div
                ref={el => { slotRefs.current[8] = el; }}
                className="slot slot-w-n"
              >
                <span className="slot-inner">N</span>
              </div>
            </div>
          </div>

          <span ref={tagRef} className="preloader-portfolio-tag" aria-label="Portfolio">
            PORTFOLIO
          </span>
        </div>
      </div>

      {/* Subtle Background Halftone Grid */}
      <div className="preloader-bg-stipple" aria-hidden="true" />
    </aside>
  );
};
