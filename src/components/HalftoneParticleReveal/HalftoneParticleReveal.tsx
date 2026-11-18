import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from '../../animations/gsap';
import type { SampledPoint } from '../../utils/halftoneSampler';
import { sampleHalftonePortrait } from '../../utils/halftoneSampler';
import './HalftoneParticleReveal.css';

interface HalftoneParticleRevealProps {
  imageSrc?: string;
  className?: string;
  duration?: number;
  initialDelay?: number;
  autoStart?: boolean;
  settledImmediately?: boolean;
  onComplete?: () => void;
  onProgress?: (p: number) => void;
  interactiveParallax?: boolean;
  aspectRatioFit?: 'contain' | 'cover';
  verticalAlign?: 'bottom' | 'center';
}

// Deterministic Pseudo-Random Generator (Mulberry32)
function pseudoRandom(seed: number): number {
  let t = (seed += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

export const HalftoneParticleReveal: React.FC<HalftoneParticleRevealProps> = ({
  imageSrc = '/assets/profile/adit-halftone-hero.png',
  className = '',
  duration = 2.4,
  initialDelay = 0.35,
  autoStart = true,
  settledImmediately = false,
  onComplete,
  onProgress,
  interactiveParallax = true,
  aspectRatioFit = 'contain',
  verticalAlign = 'bottom',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  // Animation and state refs
  const progressRef = useRef<{ value: number }>({ value: settledImmediately ? 1 : 0 });
  const animFrameRef = useRef<number | null>(null);
  const pointsRef = useRef<SampledPoint[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const isSettledRef = useRef<boolean>(settledImmediately);

  // Parallax tracking
  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });

  // Render loop
  const renderFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const progress = progressRef.current.value;

    if (onProgress) {
      onProgress(progress);
    }

    // Charcoal background: #1E1E1C
    ctx.fillStyle = '#1E1E1C';
    ctx.fillRect(0, 0, width, height);

    // Subject bounding box in 1024x682:
    // Active subject X is 138 to 889 (width 751)
    // Active subject Y is 51 to 681 (height 630, bottom at Y=681)
    const subjectW = 751;
    const subjectH = 630;
    const subjectBottomY = 681;

    let scale = Math.min((width * 0.98) / subjectW, (height * 0.98) / subjectH);
    if (aspectRatioFit === 'cover') {
      scale = Math.max(width / subjectW, height / subjectH);
    }

    const destW = 1024 * scale;
    const destH = 682 * scale;

    let offsetX = (width - destW) / 2;
    let offsetY: number;
    if (verticalAlign === 'center') {
      offsetY = (height - destH) / 2;
    } else {
      // Anchor subject bottom firmly to canvas bottom
      offsetY = height - (subjectBottomY * scale);
    }

    // Subtle parallax offset when settled
    if (interactiveParallax && isSettledRef.current) {
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;
      offsetX += mouseRef.current.x * 12;
      offsetY += mouseRef.current.y * 12;
    }

    // 1. Cross-fade the full-definition halftone portrait ONLY in the final stage (progress > 0.70)
    // This guarantees the user actively SEES the particles assemble the image first!
    if ((progress > 0.70 || isSettledRef.current) && imgRef.current) {
      const imgAlpha = isSettledRef.current ? 1 : Math.min(1, (progress - 0.70) / 0.30);
      ctx.globalAlpha = imgAlpha;
      ctx.drawImage(imgRef.current, offsetX, offsetY, destW, destH);
      ctx.globalAlpha = 1;
    }

    // 2. Render converging Sand particles/dots
    const points = pointsRef.current;
    const totalPoints = points.length;

    if (totalPoints > 0 && (progress < 1 || !imgRef.current)) {
      const particleAlphaMult = progress > 0.75 ? Math.max(0, 1 - (progress - 0.75) / 0.25) : 1;
      const sandR = 216;
      const sandG = 203;
      const sandB = 179;
      // Distinct, prominent dots during the assembly phase
      const baseRadius = width < 768 ? 1.3 : 1.7;

      for (let i = 0; i < totalPoints; i++) {
        const pt = points[i];

        // Target coordinate in fitted canvas space
        const targetX = offsetX + pt.nx * destW;
        const targetY = offsetY + pt.ny * destH;

        // Dispersed start coordinate (seeded deterministic pseudo-random)
        const randSeedX = i * 29 + 11;
        const randSeedY = i * 47 + 23;
        const randSeedCurve = i * 71 + 37;

        const scatterSpread = 1.45;
        const startX = width * 0.5 + (pseudoRandom(randSeedX) - 0.5) * width * scatterSpread;
        const startY = height * 0.5 + (pseudoRandom(randSeedY) - 0.5) * height * scatterSpread;

        // Staggered per-particle timeline (local progress)
        const pStart = pseudoRandom(i * 13 + 7) * 0.22;
        const pEnd = 0.78 + pseudoRandom(i * 19 + 5) * 0.22;
        const localT = Math.max(0, Math.min(1, (progress - pStart) / (pEnd - pStart)));

        // Organic curved path (quadratic Bezier control point)
        const curveIntensity = (pseudoRandom(randSeedCurve) - 0.5) * (width * 0.35);
        const midX = (startX + targetX) * 0.5 + curveIntensity;
        const midY = (startY + targetY) * 0.5 + (pseudoRandom(randSeedCurve + 1) - 0.5) * (height * 0.25);

        // Bezier interpolation
        const invT = 1 - localT;
        const curX = invT * invT * startX + 2 * invT * localT * midX + localT * localT * targetX;
        const curY = invT * invT * startY + 2 * invT * localT * midY + localT * localT * targetY;

        // Target size and alpha based on pixel brightness
        const targetRadius = baseRadius * (0.8 + pt.brightness * 1.15);
        const targetAlpha = 0.35 + pt.brightness * 0.65;

        // Scaled size and alpha during assembly
        const curRadius = localT < 0.05 ? 0.8 : (0.5 + localT * 0.5) * targetRadius;
        const curAlpha = Math.max(0.12, localT * targetAlpha) * particleAlphaMult;

        ctx.fillStyle = `rgba(${sandR}, ${sandG}, ${sandB}, ${curAlpha})`;
        ctx.beginPath();
        ctx.arc(curX, curY, curRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Continue render loop if animation is progressing or interactive parallax active
    if (progress < 1) {
      animFrameRef.current = requestAnimationFrame(renderFrame);
    } else {
      isSettledRef.current = true;
      if (interactiveParallax) {
        animFrameRef.current = requestAnimationFrame(renderFrame);
      } else {
        // Pause loop to conserve CPU/battery once assembled
        animFrameRef.current = null;
      }
    }
  }, [aspectRatioFit, verticalAlign, interactiveParallax, onProgress]);

  // GSAP Driven Particle Assembly Timeline
  const startAssemblyTimeline = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const tl = gsap.timeline({
      delay: initialDelay,
      onComplete: () => {
        isSettledRef.current = true;
        if (onComplete) onComplete();
      },
    });

    timelineRef.current = tl;

    // Start requestAnimationFrame loop
    if (!animFrameRef.current) {
      animFrameRef.current = requestAnimationFrame(renderFrame);
    }

    // Eased convergence from 0 to 1
    tl.to(progressRef.current, {
      value: 1,
      duration,
      ease: 'power3.inOut',
    });
  }, [initialDelay, duration, onComplete, renderFrame]);

  // Setup canvas resolution and particles
  const initParticles = useCallback(async () => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const rect = container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const displayWidth = Math.max(rect.width || container.clientWidth || 400, 320);
    const displayHeight = Math.max(
      rect.height || container.clientHeight || 480,
      360
    );

    canvas.width = Math.floor(displayWidth * dpr);
    canvas.height = Math.floor(displayHeight * dpr);

    const isMobile = displayWidth < 768;

    try {
      // Preload image element for high-definition drawing
      if (!imgRef.current) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = imageSrc;
        await new Promise((resolve) => {
          img.onload = () => {
            imgRef.current = img;
            resolve(true);
          };
          img.onerror = () => resolve(false);
        });
      }

      const sampledData = await sampleHalftonePortrait(imageSrc, isMobile);
      pointsRef.current = sampledData.points;
      setIsLoaded(true);

      // Trigger animation or settled frame
      if (settledImmediately) {
        progressRef.current.value = 1;
        isSettledRef.current = true;
        renderFrame();
        if (onComplete) onComplete();
      } else if (autoStart) {
        startAssemblyTimeline();
      } else {
        // Render initial scattered state
        renderFrame();
      }
    } catch (err) {
      console.error('Halftone particle initialization error:', err);
      setLoadError(true);
    }
  }, [imageSrc, settledImmediately, autoStart, onComplete, renderFrame, startAssemblyTimeline]);

  // Initial mount trigger
  useEffect(() => {
    initParticles();
  }, [initParticles]);

  // React to autoStart becoming true
  useEffect(() => {
    if (autoStart && pointsRef.current.length > 0 && !isSettledRef.current) {
      startAssemblyTimeline();
    }
  }, [autoStart, startAssemblyTimeline]);

  // React to settledImmediately becoming true
  useEffect(() => {
    if (settledImmediately) {
      progressRef.current.value = 1;
      isSettledRef.current = true;
      if (pointsRef.current.length > 0 || imgRef.current) {
        renderFrame();
      }
    }
  }, [settledImmediately, renderFrame]);

  // Handle Resize via ResizeObserver
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let resizeTimer: number;

    const resizeObserver = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        initParticles();
      }, 120);
    });

    resizeObserver.observe(container);

    return () => {
      window.clearTimeout(resizeTimer);
      resizeObserver.disconnect();
    };
  }, [initParticles]);

  // Mouse Parallax listener
  useEffect(() => {
    if (!interactiveParallax) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseRef.current.targetX = (e.clientX / innerWidth - 0.5) * 2;
      mouseRef.current.targetY = (e.clientY / innerHeight - 0.5) * 2;

      // Resume animation frame if idle
      if (!animFrameRef.current && isSettledRef.current) {
        animFrameRef.current = requestAnimationFrame(renderFrame);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [interactiveParallax, renderFrame]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`halftone-particle-container ${className}`}
      aria-label="Portrait of Adit Jain dynamically generated with halftone particles"
    >
      <canvas ref={canvasRef} className="halftone-particle-canvas" />

      {/* Accessible fallback image if canvas or JS fails */}
      {loadError && (
        <img
          src={imageSrc}
          alt="Portrait of Adit Jain"
          className="halftone-fallback-image"
        />
      )}
    </div>
  );
};
