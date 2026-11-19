import React, { useState, useEffect, useRef } from 'react';
import { gsap } from '../../animations/gsap';
import { isReducedMotion } from '../../animations/animationPresets';
import { HeroParticlePortrait } from './HeroParticlePortrait';
import './Hero.css';

interface HeroProps {
  portraitSettled?: boolean;
}

export const Hero: React.FC<HeroProps> = ({ portraitSettled }) => {
  const heroRef = useRef<HTMLElement>(null);

  // Determine if preloader is active; if not present, start immediately
  const [shouldAnimate, setShouldAnimate] = useState(() => {
    if (typeof document === 'undefined') return true;
    return !document.querySelector('.cinematic-preloader');
  });

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

  // Title entrance animation when hero reveals
  useEffect(() => {
    if (!shouldAnimate || !heroRef.current) return;

    if (isReducedMotion()) {
      gsap.set(['.hero-name-heading', '.hero-portfolio-tag'], {
        opacity: 1,
        y: 0,
        x: 0,
      });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // 1. "ADIT JAIN" arrives at the bottom of the hero section
      tl.fromTo(
        '.hero-name-heading',
        { opacity: 0, y: 45, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.85, delay: 0.15 }
      )
        // 2. THEN "PORTFOLIO" in small text at bottom left comes in
        .fromTo(
          '.hero-portfolio-tag',
          { opacity: 0, x: -18 },
          { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' },
          '-=0.35'
        );
    }, heroRef);

    return () => ctx.revert();
  }, [shouldAnimate]);

  return (
    <section id="hero" ref={heroRef} className="hero-section" aria-label="Introduction">
      {/* ── Particle Portrait (dominant, full-viewport) ── */}
      <div className="hero-portrait-frame">
        <HeroParticlePortrait
          className="hero-particle-stage"
          startAssembly={shouldAnimate}
        />
      </div>

      {/* ── Overlaid "ADIT JAIN" & "PORTFOLIO" Typography ── */}
      <div className="hero-title-layer" aria-hidden="false">
        <div className="hero-title-lockup">
          <h1 className="hero-name-heading">ADIT JAIN</h1>
          <span className="hero-portfolio-tag">PORTFOLIO</span>
        </div>
      </div>
    </section>
  );
};
