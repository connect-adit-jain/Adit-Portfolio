import React, { useEffect, useRef } from 'react';
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

  useEffect(() => {
    if (isReducedMotion() || !heroRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        delay: 0.35,
      });

      tl.fromTo(
        '.hero-eyebrow-tag',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6 }
      )
        .fromTo(
          '.hero-portfolio-title',
          { opacity: 0, y: 35, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 0.85, ease: 'power4.out' },
          '-=0.3'
        )
        .fromTo(
          '.hero-portfolio-sub',
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.6 },
          '-=0.4'
        )
        .fromTo(
          '.hero-bottom-dossier',
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.7 },
          '-=0.3'
        )
        .fromTo(
          '.hero-scroll-indicator',
          { opacity: 0 },
          { opacity: 1, duration: 0.5 },
          '-=0.3'
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="hero" ref={heroRef} className="hero-section" aria-label="Introduction">
      <div className="container hero-container">
        {/* Top Eyebrow Bar */}
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

        {/* Centerpiece: Halftone Portrait with Overlapping "PORTFOLIO" Title (Reel Reference) */}
        <div className="hero-center-stage">
          {/* Halftone Portrait: Settled with interactive mouse parallax on loaded page */}
          <div className="hero-portrait-stage">
            <HalftoneParticleReveal
              className="hero-portrait"
              settledImmediately={true}
              autoStart={false}
              duration={1.8}
              initialDelay={0.0}
              interactiveParallax={true}
              aspectRatioFit="contain"
              verticalAlign="bottom"
            />
          </div>

          {/* Overlapping Hero Title: "PORTFOLIO" across lower chest */}
          <div className="hero-title-overlay">
            <h1 className="hero-portfolio-title">PORTFOLIO</h1>
            <p className="hero-portfolio-sub">Software Engineer &amp; Applied AI Developer</p>
          </div>
        </div>

        {/* Flanking Editorial Details: Verified Summary on Left, Confirmed Stats on Right */}
        <div className="hero-bottom-dossier">
          {/* Left Column: Summary + Action CTAs */}
          <div className="dossier-left-col">
            <p className="hero-summary">
              {profileData.heroDescription}
            </p>

            <div className="hero-cta-group">
              <a href="#projects" className="hero-btn-primary">
                <span>View Projects</span>
                <ArrowDown size={16} aria-hidden="true" />
              </a>
              <a href="#contact" className="hero-btn-secondary">
                <span>Initiate Contact</span>
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Right Column: Confirmed Accolades & Metrics */}
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
