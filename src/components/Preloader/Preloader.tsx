import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowRight, Compass } from 'lucide-react';
import { gsap } from '../../animations/gsap';
import { isReducedMotion } from '../../animations/animationPresets';
import './Preloader.css';

interface PreloaderProps {
  onComplete: () => void;
}

// Cinematic Character Scrambler with slow, deliberate letter-by-letter reveal
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

  setText(newText: string, speedMultiplier = 1): Promise<void> {
    const oldText = this.el.innerText || '';
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise<void>((resolve) => {
      this.resolve = resolve;
    });

    this.queue = [];
    // Slow, deliberate sequential letter reveal:
    // charDelay: frames between starting next letter (e.g., 6 frames ~= 0.10s)
    // scrambleSpan: how long each letter scrambles before settling (e.g., 20 frames ~= 0.33s)
    const charDelay = Math.round(6 * speedMultiplier);
    const scrambleSpan = Math.round(20 * speedMultiplier);

    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = i * charDelay;
      const end = start + scrambleSpan;
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
        if (!char || Math.random() < 0.22) {
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

      tl.to([textRef.current, subRef.current, skipBtnRef.current, orbRef.current], {
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

    if (textRef.current) {
      scramblerRef.current = new TextScramble(textRef.current);
    }

    const ctx = gsap.context(() => {
      const masterTl = gsap.timeline();

      // Step 1: Center glowing Sand spark pulses (0.0s – 0.7s)
      masterTl
        .fromTo(
          orbRef.current,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(1.8)' }
        )
        // Step 2: Scramble in the name "ADIT JAIN" letter-by-letter slowly
        .call(async () => {
          if (scramblerRef.current) {
            await scramblerRef.current.setText('ADIT JAIN', 1.2);
          }
        }, undefined, '+=0.1')
        .fromTo(
          subRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
          '+=0.8'
        )
        // Step 3: Hold on "ADIT JAIN" so user can absorb it (~1.4s)
        // Step 4: Morph smoothly into "PORTFOLIO" letter-by-letter slowly
        .call(async () => {
          if (scramblerRef.current) {
            await scramblerRef.current.setText('PORTFOLIO', 1.2);
          }
        }, undefined, '+=1.4')
        .to(subRef.current, {
          opacity: 0,
          y: -10,
          duration: 0.4,
        }, '-=0.2')
        .to(orbRef.current, {
          opacity: 0,
          scale: 0.5,
          duration: 0.4,
        }, '-=0.3')
        // Step 5: Hold on "PORTFOLIO" (~1.2s)
        // Step 6: Curtain exit upward to reveal Hero page where portrait particles assemble
        .call(() => {
          finishPreloader();
        }, undefined, '+=1.3');
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

      {/* Center Reel Stage: Morphing Typography (NO image inside preloader) */}
      <div className="preloader-center-stage">
        <div className="preloader-text-area">
          {/* Glowing Sand Dot / Spark */}
          <div ref={orbRef} className="preloader-spark-orb" aria-hidden="true" />

          {/* Dynamic Morphing Title: "ADIT JAIN" -> "PORTFOLIO" */}
          <h1 ref={textRef} className="preloader-morph-title">
            <span className="scramble-char">!</span>
          </h1>

          {/* Subtitle that appears with name */}
          <p ref={subRef} className="preloader-sub-tag">
            Software Engineering Student | Full-Stack &amp; AI Developer
          </p>
        </div>
      </div>

      {/* Subtle Background Halftone Grid */}
      <div className="preloader-bg-stipple" aria-hidden="true" />
    </aside>
  );
};
