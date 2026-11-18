import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, Compass } from 'lucide-react';
import profileData from '../../data/profile.json';
import { gsap } from '../../animations/gsap';
import { isReducedMotion } from '../../animations/animationPresets';
import { HalftoneParticleReveal } from '../../components/HalftoneParticleReveal/HalftoneParticleReveal';
import './Hero.css';

interface HeroProps {
  portraitSettled?: boolean;
}

export const Hero: React.FC<HeroProps> = () => {
  const heroRef = useRef<HTMLElement>(null);

  // Determine whether preloader is covering screen; if not, animate immediately
  const [shouldAnimate, setShouldAnimate] = useState(() => {
    if (typeof document === 'undefined') return true;
    return !document.querySelector('.cinematic-preloader');
  });

  useEffect(() => {
    const handleStart = () => {
      setShouldAnimate(true);
    };

    window.addEventListener('start-hero-reveal', handleStart);
    window.addEventListener('preloader-complete', handleStart);

    // Fallback timer if preloader was dismissed or not present
    const timer = setTimeout(() => {
      setShouldAnimate(true);
    }, 6000);

    return () => {
      window.removeEventListener('start-hero-reveal', handleStart);
      window.removeEventListener('preloader-complete', handleStart);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!shouldAnimate || !heroRef.current) return;

    if (isReducedMotion()) {
      gsap.set(
        [
          '.hero-eyebrow-tag',
          '.hero-name-badge',
          '.hero-portfolio-title',
          '.hero-portfolio-sub',
          '.hero-bottom-dossier',
          '.hero-scroll-indicator',
        ],
        { opacity: 1, y: 0 }
      );
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Step 1: Reveal "PORTFOLIO" title and name badge while particles are combining (0.2s - 1.1s)
      tl.fromTo(
        '.hero-name-badge',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.25 }
      )
        .fromTo(
          '.hero-portfolio-title',
          { opacity: 0, y: 30, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 0.85, ease: 'power4.out' },
          '-=0.35'
        )
        .fromTo(
          '.hero-portfolio-sub',
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.6 },
          '-=0.4'
        )
        // Step 2: THEN, right as the dots finish combining into the exact portrait (~1.5s),
        // reveal the specs on the side corners!
        .fromTo(
          '.hero-eyebrow-tag',
          { opacity: 0, y: -15 },
          { opacity: 1, y: 0, duration: 0.65 },
          '+=0.45'
        )
        .fromTo(
          '.hero-bottom-dossier',
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.75 },
          '-=0.45'
        )
        .fromTo(
          '.hero-scroll-indicator',
          { opacity: 0 },
          { opacity: 1, duration: 0.5 },
          '-=0.2'
        );
    }, heroRef);

    return () => ctx.revert();
  }, [shouldAnimate]);

  return (
    <section id="hero" ref={heroRef} className="hero-section" aria-label="Introduction">
      <div className="container hero-container">
        {/* Top Corner Eyebrow Bar */}
        <div className="hero-eyebrow-tag">
          <span className="location-pill">
            <Compass size={13} aria-hidden="true" />
            {profileData.location}
          </span>
          <span className="separator-slash" aria-hidden="true">/</span>
          <span className="institution-tag">NIAT Jaipur — Vivekananda Global University</span>
          <span className="separator-slash" aria-hidden="true">/</span>
          <span className="cgpa-tag">CGPA: {profileData.cgpa}</span>
        </div>

        {/* Centerpiece: Halftone Portrait assembled by combining dots + Overlapping "PORTFOLIO" Title */}
        <div className="hero-center-stage">
          {/* Halftone Portrait: Combines dots into place slowly taking 1.6s */}
          <div className="hero-portrait-stage">
            <HalftoneParticleReveal
              className="hero-portrait"
              settledImmediately={false}
              autoStart={shouldAnimate}
              duration={1.6}
              initialDelay={0.15}
              interactiveParallax={true}
              aspectRatioFit="contain"
              verticalAlign="bottom"
            />
          </div>

          {/* Overlapping Hero Title: "PORTFOLIO" across lower chest */}
          <div className="hero-title-overlay">
            <span className="hero-name-badge">ADIT JAIN</span>
            <h1 className="hero-portfolio-title">PORTFOLIO</h1>
            <p className="hero-portfolio-sub">Software Engineering Student | Full-Stack &amp; AI Developer</p>
          </div>
        </div>

        {/* Flanking Editorial Details: Specs & Bio on Left Corner, Confirmed Stats on Right Corner */}
        <div className="hero-bottom-dossier">
          {/* Left Column: Summary Specs + Action CTAs */}
          <div className="dossier-left-col">
            <p className="hero-summary">
              {profileData.heroDescription}
            </p>

            <div className="hero-cta-group">
              <a href="#projects" className="hero-btn-primary" data-cursor="project">
                <span>Explore Work</span>
                <ArrowDown size={16} aria-hidden="true" />
              </a>
              <a href="#contact" className="hero-btn-secondary">
                <span>Resume / CV</span>
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Right Column: Confirmed Accolades & Metric Specs */}
          <div className="dossier-right-col">
            <div className="stat-card">
              <span className="stat-number">8.65</span>
              <span className="stat-desc">CGPA (3rd Sem)</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">₹35k</span>
              <span className="stat-desc">SKIT IEEE 1st Prize</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">₹20k</span>
              <span className="stat-desc">VGU Startup Grant</span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="hero-scroll-indicator">
          <a href="#recognition" aria-label="Scroll to recognition and achievements">
            <span className="scroll-text">Explore Verified Dossier</span>
            <span className="scroll-arrow" aria-hidden="true">↓</span>
          </a>
        </div>
      </div>
    </section>
  );
};
