import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowRight, Compass } from 'lucide-react';
import { gsap } from '../../animations/gsap';
import { isReducedMotion } from '../../animations/animationPresets';
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
    // Slightly more frames per character for a deliberate, cinematic scramble
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 16);
      const end = start + Math.floor(Math.random() * 24) + 14;
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
        if (!char || Math.random() < 0.24) {
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
  const textRef = useRef<HTMLHeadingElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const skipBtnRef = useRef<HTMLButtonElement>(null);
  const scramblerRef = useRef<TextScramble | null>(null);

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

    // Curtain exit animation upward into the Hero
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          onComplete();
        },
      });

      tl.to([textRef.current, subRef.current, orbRef.current, skipBtnRef.current], {
        opacity: 0,
        y: -30,
        duration: 0.5,
        ease: 'power2.in',
      }).to(
        containerRef.current,
        {
          yPercent: -100,
          duration: 0.8,
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

      // Step 1: Center glowing Sand spark pulses with gentle breath (0.0s – 0.8s)
      masterTl
        .fromTo(
          orbRef.current,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(1.7)' }
        )
        // Step 2: Scramble in the name "ADIT JAIN" (takes ~1.2s)
        .call(async () => {
          if (scramblerRef.current) {
            await scramblerRef.current.setText('ADIT JAIN');
          }
        }, undefined, '+=0.15')
        .fromTo(
          subRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
          '+=0.8'
        )
        // Step 3: Generous pause for impact on "ADIT JAIN" so it can be read clearly (1.2s hold)
        // Step 4: Morph "ADIT JAIN" into "PORTFOLIO" (~1.3s)
        .call(async () => {
          if (scramblerRef.current) {
            await scramblerRef.current.setText('PORTFOLIO');
          }
        }, undefined, '+=1.2')
        .to(subRef.current, {
          opacity: 0,
          y: -10,
          duration: 0.35,
        }, '-=0.2')
        // Step 5: Pause on "PORTFOLIO" (0.9s hold)
        // Step 6: "PORTFOLIO" slides down as the curtain lifts into the Hero section
        .to(textRef.current, {
          y: 45,
          opacity: 0.9,
          duration: 0.6,
          ease: 'power3.in',
        }, '+=0.9')
        .call(() => {
          finishPreloader();
        }, undefined, '+=0.1');
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

      {/* Center Reel Stage: Glowing Spark + Morphing Typography */}
      <div className="preloader-center-stage">
        {/* Glowing Sand Dot / Spark with Luminous Halo */}
        <div ref={orbRef} className="preloader-spark-orb" aria-hidden="true" />

        {/* Dynamic Morphing Text: "ADIT JAIN" -> "PORTFOLIO" */}
        <h1 ref={textRef} className="preloader-morph-title">
          <span className="scramble-char">!</span>
        </h1>

        {/* Subtitle that appears with name */}
        <p ref={subRef} className="preloader-sub-tag">
          Software Engineer &amp; Robotics Enthusiast
        </p>
      </div>

      {/* Subtle Background Halftone Grid */}
      <div className="preloader-bg-stipple" aria-hidden="true" />
    </aside>
  );
};
