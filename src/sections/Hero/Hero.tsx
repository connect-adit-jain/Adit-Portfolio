import React, { useState, useEffect, useRef } from 'react';
import { gsap } from '../../animations/gsap';
import { isReducedMotion } from '../../animations/animationPresets';
import { runAlphabeticalMorph, CHAR_WIDTHS } from '../../animations/alphabeticalMorph';
import { HeroParticlePortrait } from './HeroParticlePortrait';
import './Hero.css';

interface HeroProps {
  portraitSettled?: boolean;
}

const HEADING_WORD = 'ADIT JAIN';
const TAG_WORD = 'PORTFOLIO';

export const Hero: React.FC<HeroProps> = ({ portraitSettled }) => {
  const heroRef = useRef<HTMLElement>(null);
  const headingSlotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tagSlotRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Determine if preloader is active; if not present, start immediately
  const [shouldAnimate, setShouldAnimate] = useState(() => {
    if (typeof document === 'undefined') return true;
    return !document.querySelector('.cinematic-preloader');
  });

  // Controls when the particle portrait dots start assembling (AFTER the text morphs arrive)
  const [particlesReady, setParticlesReady] = useState(false);

  useEffect(() => {
    if (portraitSettled) {
      setShouldAnimate(true);
    }
  }, [portraitSettled]);

  useEffect(() => {
    const handleStart = () => setShouldAnimate(true);
    window.addEventListener('start-hero-reveal', handleStart);
    window.addEventListener('preloader-complete', handleStart);
    // Fallback timer if preloader is not present or completed
    const fallbackTimer = setTimeout(() => setShouldAnimate(true), 4000);
    return () => {
      window.removeEventListener('start-hero-reveal', handleStart);
      window.removeEventListener('preloader-complete', handleStart);
      clearTimeout(fallbackTimer);
    };
  }, []);

  // Title entrance morph animation when hero reveals, followed by particle assembly
  useEffect(() => {
    if (!shouldAnimate || !heroRef.current) return;

    if (isReducedMotion()) {
      gsap.set(['.hero-name-heading', '.hero-portfolio-tag'], {
        opacity: 1,
        y: 0,
        x: 0,
      });
      setParticlesReady(true);
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Reveal title container smoothly
      gsap.fromTo(
        '.hero-title-lockup',
        { opacity: 0, y: 35 },
        { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out', delay: 0.1 }
      );

      const headingSlots = headingSlotRefs.current
        .filter((el): el is HTMLDivElement => el !== null)
        .map(cell => ({
          cell,
          inner: (cell.querySelector('.slot-inner') || cell) as HTMLElement,
        }));

      const tagSlots = tagSlotRefs.current
        .filter((el): el is HTMLDivElement => el !== null)
        .map(cell => ({
          cell,
          inner: (cell.querySelector('.slot-inner') || cell) as HTMLElement,
        }));

      // 1. Heading morphs onto hero section (morphing from PORTFOLIO -> ADIT JAIN)
      runAlphabeticalMorph({
        slots: headingSlots,
        fromText: 'PORTFOLIO',
        toText: 'ADIT JAIN',
        duration: 1.15,
        delay: 0.15,
        stagger: 0.035,
      });

      // 2. Tag morphs onto hero section at bottom-left (morphing into PORTFOLIO)
      runAlphabeticalMorph({
        slots: tagSlots,
        fromText: 'ADIT JAIN',
        toText: 'PORTFOLIO',
        duration: 1.0,
        delay: 0.35,
        stagger: 0.03,
        onComplete: () => {
          // Both texts have fully morphed and settled!
          // Now trigger particle portrait assembly within 2 seconds
          setParticlesReady(true);
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, [shouldAnimate]);

  return (
    <section id="hero" ref={heroRef} className="hero-section" aria-label="Introduction">
      {/* ── Particle Portrait (dominant, full-viewport) ── */}
      <div className="hero-portrait-frame">
        <HeroParticlePortrait
          className="hero-particle-stage"
          startAssembly={particlesReady}
        />
      </div>

      {/* ── Overlaid "ADIT JAIN" & "PORTFOLIO" Typography with Morph Effect ── */}
      <div className="hero-title-layer" aria-hidden="false">
        <div className="hero-title-lockup">
          <h1 className="hero-name-heading" aria-label="Adit Jain">
            {HEADING_WORD.split('').map((char, i) => (
              <div
                key={i}
                ref={el => { headingSlotRefs.current[i] = el; }}
                className="hero-slot"
                style={{ width: CHAR_WIDTHS[char] || '0.6em' }}
              >
                <span className="slot-inner">{char === ' ' ? '\u00A0' : char}</span>
              </div>
            ))}
          </h1>
          <span className="hero-portfolio-tag" aria-label="Portfolio">
            {TAG_WORD.split('').map((char, i) => (
              <div
                key={i}
                ref={el => { tagSlotRefs.current[i] = el; }}
                className="hero-tag-slot"
                style={{ width: CHAR_WIDTHS[char] || '0.6em' }}
              >
                <span className="slot-inner">{char === ' ' ? '\u00A0' : char}</span>
              </div>
            ))}
          </span>
        </div>
      </div>
    </section>
  );
};
