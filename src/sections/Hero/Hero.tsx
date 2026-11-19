import React, { useState, useEffect } from 'react';
import { HeroParticlePortrait } from './HeroParticlePortrait';
import './Hero.css';

interface HeroProps {
  portraitSettled?: boolean;
}

export const Hero: React.FC<HeroProps> = ({ portraitSettled }) => {
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

  return (
    <section id="hero" className="hero-section" aria-label="Introduction">
      {/* ── Particle Portrait (dominant, full-viewport) ── */}
      <div className="hero-portrait-frame">
        <HeroParticlePortrait
          className="hero-particle-stage"
          startAssembly={shouldAnimate}
        />
      </div>

      {/* ── Overlaid "PORTFOLIO" Typography ── */}
      <div className="hero-title-layer" aria-hidden="false">
        <h1 className="hero-portfolio-heading">PORTFOLIO</h1>
      </div>
    </section>
  );
};
