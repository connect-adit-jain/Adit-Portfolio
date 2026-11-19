import React, { useState, useEffect, useRef } from 'react';
import { isReducedMotion } from '../../animations/animationPresets';
import { HeroParticlePortrait } from './HeroParticlePortrait';
import './Hero.css';

interface HeroProps {
  portraitSettled?: boolean;
}

export const Hero: React.FC<HeroProps> = ({ portraitSettled }) => {
  const heroRef = useRef<HTMLElement>(null);

  // Controls when the particle portrait dots start assembling (AFTER preloader text settles at bottom)
  const [particlesReady, setParticlesReady] = useState(false);

  // Controls hero text visibility (hidden while preloader is active, revealed when preloader text settles into place)
  const [titleVisible, setTitleVisible] = useState(() => {
    if (typeof document === 'undefined') return true;
    return !document.querySelector('.cinematic-preloader');
  });

  useEffect(() => {
    if (portraitSettled) {
      setTitleVisible(true);
      setParticlesReady(true);
    }
  }, [portraitSettled]);

  useEffect(() => {
    if (isReducedMotion()) {
      setTitleVisible(true);
      setParticlesReady(true);
      return;
    }

    const handleSettled = () => {
      setTitleVisible(true);
      setParticlesReady(true);
    };

    window.addEventListener('hero-text-settled', handleSettled);
    window.addEventListener('preloader-complete', handleSettled);

    return () => {
      window.removeEventListener('hero-text-settled', handleSettled);
      window.removeEventListener('preloader-complete', handleSettled);
    };
  }, []);

  return (
    <section id="hero" ref={heroRef} className="hero-section" aria-label="Introduction">
      {/* ── Particle Portrait (dominant, full-viewport) ── */}
      <div className="hero-portrait-frame">
        <HeroParticlePortrait
          className="hero-particle-stage"
          startAssembly={particlesReady}
        />
      </div>

      {/* ── Overlaid "ADIT JAIN" & "PORTFOLIO" Typography at Bottom ── */}
      <div
        className="hero-title-layer"
        style={{
          opacity: titleVisible ? 1 : 0,
          pointerEvents: titleVisible ? 'auto' : 'none',
        }}
        aria-hidden={!titleVisible}
      >
        <div className="hero-title-lockup">
          <h1 className="hero-name-heading" aria-label="Adit Jain">
            ADIT JAIN
          </h1>
          <span className="hero-portfolio-tag" aria-label="Portfolio">
            PORTFOLIO
          </span>
        </div>
      </div>
    </section>
  );
};
