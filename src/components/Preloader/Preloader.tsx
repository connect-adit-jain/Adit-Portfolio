import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowRight, Compass } from 'lucide-react';
import { gsap } from '../../animations/gsap';
import { isReducedMotion } from '../../animations/animationPresets';
import { HalftoneParticleReveal } from '../HalftoneParticleReveal/HalftoneParticleReveal';
import './Preloader.css';

interface PreloaderProps {
  onComplete: () => void;
}

// Cinematic Character Scrambler
const SCRAMBLE_CHARS = '!<>-_\\/[]{}—=+*^?#________ABCDEFGIJKLMNOPQRSTUVWXYZ0123456789';

class TextScramble {
  el: HTMLElement;
  chars: string;
  frame: number;
  frameRequest: number | null;
  queue: Array<{ from: string; to: string; start: number; end: number; char?: string }>;
  resolve: (() => void) | null;

  constructor(el: HTMLElement) {
    this.el = el;
    this.chars = SCRAMBLE_CHARS;
    this.frame = 0;
    this.frameRequest = null;
    this.queue = [];
    this.resolve = null;
    this.update = this.update.bind(this);
  }

  setText(newText: string): Promise<void> {
    const oldText = this.el.innerText || '';
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise<void>((resolve) => {
      this.resolve = resolve;
    });

    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 14);
      const end = start + Math.floor(Math.random() * 20) + 12;
      this.queue.push({ from, to, start, end });
    }

    if (this.frameRequest) {
      cancelAnimationFrame(this.frameRequest);
    }
    this.frame = 0;
    this.update();
    return promise;
  }

  update() {
    let output = '';
    let complete = 0;

    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];

      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.25) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)];
          this.queue[i].char = char;
        }
        output += `<span class="scramble-char">${char}</span>`;
      } else {
        output += from;
      }
    }

    this.el.innerHTML = output;

    if (complete === this.queue.length) {
      if (this.resolve) this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }

  destroy() {
    if (this.frameRequest) {
      cancelAnimationFrame(this.frameRequest);
    }
  }
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const portraitWrapRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const finalMetaRef = useRef<HTMLDivElement>(null);
  const skipBtnRef = useRef<HTMLButtonElement>(null);
  const scramblerRef = useRef<TextScramble | null>(null);

  const [startParticles, setStartParticles] = useState(false);
  const [isSkipped, setIsSkipped] = useState(false);
  const isCompletedRef = useRef(false);

  // Complete preloader and trigger curtain exit
  const finishPreloader = useCallback(() => {
    if (isCompletedRef.current) return;
    isCompletedRef.current = true;

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

      tl.to([portraitWrapRef.current, textRef.current, subRef.current, finalMetaRef.current, skipBtnRef.current], {
        opacity: 0,
        y: -35,
        duration: 0.45,
        ease: 'power2.in',
      }).to(
        containerRef.current,
        {
          yPercent: -100,
          duration: 0.75,
          ease: 'power4.inOut',
        },
        '-=0.15'
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

    if (textRef.current) {
      scramblerRef.current = new TextScramble(textRef.current);
    }

    const ctx = gsap.context(() => {
      const masterTl = gsap.timeline();

      // Step 1: Center glowing Sand spark pulses (0.0s – 0.6s)
      masterTl
        .fromTo(
          orbRef.current,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.8)' }
        )
        // Step 2: Scramble in the name "ADIT JAIN" (0.6s – 1.8s)
        .call(async () => {
          if (scramblerRef.current) {
            await scramblerRef.current.setText('ADIT JAIN');
          }
        }, undefined, '+=0.1')
        .fromTo(
          subRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
          '+=0.6'
        )
        // Step 3: Hold on "ADIT JAIN" (1.8s – 2.8s)
        // Step 4: Morph "ADIT JAIN" into "PORTFOLIO" (2.8s – 3.8s)
        .call(async () => {
          if (scramblerRef.current) {
            await scramblerRef.current.setText('PORTFOLIO');
          }
        }, undefined, '+=1.0')
        .to(subRef.current, {
          opacity: 0,
          y: -10,
          duration: 0.3,
        }, '-=0.2')
        .to(orbRef.current, {
          opacity: 0,
          scale: 0.5,
          duration: 0.3,
        }, '-=0.3')
        // Step 5: Particles arrive and assemble the image above "PORTFOLIO" (3.8s – 5.8s)
        .call(() => {
          setStartParticles(true);
        }, undefined, '+=0.2')
        .fromTo(
          portraitWrapRef.current,
          { opacity: 0, scale: 0.96 },
          { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' },
          '<'
        )
        // Move "PORTFOLIO" slightly down to overlap the lower chest
        .to(
          textRef.current,
          { y: 25, duration: 0.6, ease: 'power2.out' },
          '<'
        )
        // Step 6: Complete Portrait & Final Composition (5.8s – 7.2s)
        // Reveal live HTML metadata: ADIT JAIN and SOFTWARE ENGINEERING STUDENT | FULL-STACK & AI DEVELOPER
        .fromTo(
          finalMetaRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
          '+=1.4'
        )
        // Hold the assembled particle portrait for a satisfying cinematic moment
        // Step 7: Curtain exit upward to load the next page (7.5s+)
        .call(() => {
          finishPreloader();
        }, undefined, '+=2.0');
    }, containerRef);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (scramblerRef.current) {
        scramblerRef.current.destroy();
      }
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

      {/* Center Reel Stage: Particle Image Canvas + Morphing Typography */}
      <div className="preloader-center-stage">
        {/* Living Particle Canvas: Particles stream in to assemble Adit's portrait */}
        <div ref={portraitWrapRef} className="preloader-portrait-wrapper">
          <HalftoneParticleReveal
            className="preloader-particle-canvas"
            autoStart={startParticles}
            settledImmediately={false}
            duration={2.0}
            initialDelay={0.0}
            aspectRatioFit="contain"
            verticalAlign="bottom"
            interactiveParallax={false}
          />
        </div>

        {/* Text Container: Spark + Morphing Title */}
        <div className="preloader-text-area">
          {/* Glowing Sand Dot / Spark */}
          <div ref={orbRef} className="preloader-spark-orb" aria-hidden="true" />

          {/* Dynamic Morphing Title: "ADIT JAIN" -> "PORTFOLIO" */}
          <h1 ref={textRef} className="preloader-morph-title">
            <span className="scramble-char">!</span>
          </h1>

          {/* Subtitle that appears during Name Reveal stage */}
          <p ref={subRef} className="preloader-sub-tag">
            Software Engineering Student | Full-Stack &amp; AI Developer
          </p>

          {/* Final Composition live HTML metadata that appears once portrait is assembled */}
          <div ref={finalMetaRef} className="preloader-final-meta">
            <span className="final-meta-name">ADIT JAIN</span>
            <span className="final-meta-role">
              Software Engineering Student | Full-Stack &amp; AI Developer
            </span>
          </div>
        </div>
      </div>

      {/* Subtle Background Halftone Grid */}
      <div className="preloader-bg-stipple" aria-hidden="true" />
    </aside>
  );
};
