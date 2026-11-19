import React, { useEffect, useRef, useCallback, useState } from 'react';
import { gsap, ScrollTrigger } from '../../animations/gsap';
import type { SampledPoint } from '../../utils/halftoneSampler';
import { sampleHalftonePortrait } from '../../utils/halftoneSampler';

interface HeroParticlePortraitProps {
  imageSrc?: string;
  className?: string;
  onAssemblyComplete?: () => void;
  startAssembly?: boolean;
}

/* Deterministic pseudo-random (Mulberry32) */
function mulberry32(seed: number): number {
  let t = (seed += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

export const HeroParticlePortrait: React.FC<HeroParticlePortraitProps> = ({
  imageSrc = '/assets/profile/adit-halftone-hero.png',
  className = '',
  onAssemblyComplete,
  startAssembly = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [loadError, setLoadError] = useState(false);

  // Animation refs
  const assemblyRef = useRef<{ value: number }>({ value: 0 });
  const dissolveRef = useRef<{ value: number }>({ value: 0 });
  const animFrameRef = useRef<number | null>(null);
  const pointsRef = useRef<SampledPoint[]>([]);
  const scatterRef = useRef<Array<{ dx: number; dy: number; angle: number; dist: number }>>([]);
  const startXRef = useRef<Float32Array | null>(null);
  const startYRef = useRef<Float32Array | null>(null);
  const assemblyTlRef = useRef<gsap.core.Tween | null>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const isAssembledRef = useRef(false);
  const needsRenderRef = useRef(true);
  const reducedMotionRef = useRef(false);

  /* ───── RENDER LOOP ───── */
  const renderFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const assembly = assemblyRef.current.value;
    const dissolve = dissolveRef.current.value;

    // Clear to black
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, w, h);

    // Subject bounding box in original 1024×682 image
    const subjectW = 751;
    const subjectH = 630;
    const subjectBottomY = 681;

    let scale = Math.min((w * 0.92) / subjectW, (h * 0.92) / subjectH);
    const destW = 1024 * scale;
    const destH = 682 * scale;
    const offsetX = (w - destW) / 2;
    const offsetY = h - subjectBottomY * scale;

    const points = pointsRef.current;
    const scatter = scatterRef.current;
    const totalPoints = points.length;
    if (totalPoints === 0) return;

    const startXArr = startXRef.current;
    const startYArr = startYRef.current;
    if (!startXArr || !startYArr) return;

    // Cross-fade the full-definition image behind particles in the final assembled+undissolved state
    if (assembly > 0.85 && dissolve < 0.3 && imgRef.current) {
      const imgAlpha = Math.min(1, (assembly - 0.85) / 0.15) * Math.max(0, 1 - dissolve / 0.3);
      ctx.globalAlpha = imgAlpha * 0.6; // subtle behind particles
      ctx.drawImage(imgRef.current, offsetX, offsetY, destW, destH);
      ctx.globalAlpha = 1;
    }

    // Particle rendering (White dots)
    const sandR = 255, sandG = 255, sandB = 255;
    const isMob = w < 768 * 2; // canvas width is DPR-scaled
    const baseRadius = isMob ? 1.2 : 1.6;

    for (let i = 0; i < totalPoints; i++) {
      const pt = points[i];

      // Target coordinate
      const targetX = offsetX + pt.nx * destW;
      const targetY = offsetY + pt.ny * destH;

      // Start coordinate (for assembly)
      const sx = startXArr[i];
      const sy = startYArr[i];

      // Assembled coordinate (lerp from start to target based on assembly progress)
      let ax: number, ay: number;
      if (assembly >= 1) {
        ax = targetX;
        ay = targetY;
      } else {
        // Stagger: face particles converge earlier
        const stagger = pt.isFace ? 0 : 0.15;
        const localP = Math.max(0, Math.min(1, (assembly - stagger) / (1 - stagger)));
        const eased = 1 - Math.pow(1 - localP, 3); // ease-out cubic
        ax = sx + (targetX - sx) * eased;
        ay = sy + (targetY - sy) * eased;
      }

      // Dissolution offset (scatter outward from target)
      let fx = ax, fy = ay;
      if (dissolve > 0 && scatter[i]) {
        const s = scatter[i];
        const easedDissolve = dissolve * dissolve; // ease-in quad
        fx = ax + s.dx * s.dist * easedDissolve;
        fy = ay + s.dy * s.dist * easedDissolve;
      }

      // Opacity: fade in during assembly, fade out during dissolution
      let alpha = pt.brightness;
      if (assembly < 1) {
        alpha *= Math.min(1, assembly * 2.5);
      }
      if (dissolve > 0) {
        alpha *= Math.max(0, 1 - dissolve * 1.3);
      }

      if (alpha < 0.02) continue;

      const radius = baseRadius * (0.5 + pt.brightness * 0.6) * (pt.isFace ? 1.1 : 1);

      ctx.beginPath();
      ctx.arc(fx, fy, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${sandR},${sandG},${sandB},${alpha})`;
      ctx.fill();
    }

    // Schedule next frame if animation is in progress
    if (assembly < 1 || (dissolve > 0 && dissolve < 1) || needsRenderRef.current) {
      needsRenderRef.current = false;
      animFrameRef.current = requestAnimationFrame(renderFrame);
    }
  }, []);

  /* ───── ASSEMBLY TRIGGER ───── */
  const triggerAssembly = useCallback(() => {
    if (isAssembledRef.current || assemblyTlRef.current) return;
    if (reducedMotionRef.current) {
      assemblyRef.current.value = 1;
      isAssembledRef.current = true;
      renderFrame();
      if (onAssemblyComplete) onAssemblyComplete();
      return;
    }

    assemblyTlRef.current = gsap.to(assemblyRef.current, {
      value: 1,
      duration: 2.0,
      ease: 'power2.out',
      onUpdate: () => {
        needsRenderRef.current = true;
        if (animFrameRef.current === null) {
          animFrameRef.current = requestAnimationFrame(renderFrame);
        }
      },
      onComplete: () => {
        isAssembledRef.current = true;
        renderFrame(); // Final stable frame
        if (onAssemblyComplete) onAssemblyComplete();
      },
    });
  }, [renderFrame, onAssemblyComplete]);

  useEffect(() => {
    if (startAssembly && pointsRef.current.length > 0) {
      triggerAssembly();
    }
  }, [startAssembly, triggerAssembly]);

  /* ───── SCROLL HANDLER (called by ScrollTrigger) ───── */
  const onScrollUpdate = useCallback(
    (progress: number) => {
      dissolveRef.current.value = progress;
      needsRenderRef.current = true;
      if (animFrameRef.current === null) {
        animFrameRef.current = requestAnimationFrame(renderFrame);
      }
    },
    [renderFrame]
  );

  /* ───── INITIALIZATION ───── */
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // Reduced-motion check
    const prefersRM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    reducedMotionRef.current = prefersRM;

    const rect = container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const displayW = Math.max(rect.width || container.clientWidth || 800, 320);
    const displayH = Math.max(rect.height || container.clientHeight || 600, 400);

    canvas.width = Math.floor(displayW * dpr);
    canvas.height = Math.floor(displayH * dpr);
    canvas.style.width = `${displayW}px`;
    canvas.style.height = `${displayH}px`;

    const isMobile = displayW < 768;

    let mounted = true;

    (async () => {
      try {
        // Load image
        if (!imgRef.current) {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.src = imageSrc;
          await new Promise<void>((resolve, reject) => {
            img.onload = () => {
              imgRef.current = img;
              resolve();
            };
            img.onerror = () => reject(new Error('Image load failed'));
          });
        }

        if (!mounted) return;

        // Sample particles
        const sampledData = await sampleHalftonePortrait(imageSrc, isMobile);
        pointsRef.current = sampledData.points;
        const totalPoints = sampledData.points.length;

        // Compute start positions (scattered within portrait area)
        const startX = new Float32Array(totalPoints);
        const startY = new Float32Array(totalPoints);
        const scatterData: Array<{ dx: number; dy: number; angle: number; dist: number }> = [];

        const subjectW = 751;
        const subjectBottomY = 681;
        const scale = Math.min(
          (canvas.width * 0.92) / subjectW,
          (canvas.height * 0.92) / 630
        );
        const destW = 1024 * scale;
        const destH = 682 * scale;
        const offsetX = (canvas.width - destW) / 2;
        const offsetY = canvas.height - subjectBottomY * scale;
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        for (let i = 0; i < totalPoints; i++) {
          const pt = sampledData.points[i];
          const targetX = offsetX + pt.nx * destW;
          const targetY = offsetY + pt.ny * destH;

          // Initial scattered position: offset from target by a random amount within portrait area
          const seed = i * 7 + 13;
          const r1 = mulberry32(seed);
          const r2 = mulberry32(seed + 1);
          const r3 = mulberry32(seed + 2);
          const r4 = mulberry32(seed + 3);

          // Scatter start: within ±25% of canvas dimensions from center
          const spreadX = canvas.width * 0.3;
          const spreadY = canvas.height * 0.3;
          startX[i] = targetX + (r1 - 0.5) * spreadX;
          startY[i] = targetY + (r2 - 0.5) * spreadY;

          // Dissolution scatter direction (outward from portrait center)
          const angle = Math.atan2(targetY - cy, targetX - cx) + (r3 - 0.5) * 0.8;
          const dist = 150 + r4 * 350;
          scatterData.push({
            dx: Math.cos(angle),
            dy: Math.sin(angle),
            angle,
            dist: dist * dpr,
          });
        }

        startXRef.current = startX;
        startYRef.current = startY;
        scatterRef.current = scatterData;

        if (!mounted) return;

        if (prefersRM) {
          // Show completed portrait immediately
          assemblyRef.current.value = 1;
          isAssembledRef.current = true;
          renderFrame();
          if (onAssemblyComplete) onAssemblyComplete();
        } else {
          assemblyRef.current.value = 0;
          renderFrame();

          if (startAssembly) {
            triggerAssembly();
          }
        }

        // Set up ScrollTrigger for dissolution
        scrollTriggerRef.current = ScrollTrigger.create({
          trigger: container,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5,
          onUpdate: (self) => {
            onScrollUpdate(self.progress);
          },
        });
      } catch (err) {
        console.error('HeroParticlePortrait init error:', err);
        if (mounted) setLoadError(true);
      }
    })();

    // Handle resize
    let resizeTimer: number;
    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (!container || !canvas) return;
        const r = container.getBoundingClientRect();
        const w = Math.max(r.width || container.clientWidth || 800, 320);
        const h = Math.max(r.height || container.clientHeight || 600, 400);
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;

        // Recompute scatter distances for new canvas size
        const pts = pointsRef.current;
        const sc = scatterRef.current;
        const subW = 751;
        const subBY = 681;
        const sc2 = Math.min((canvas.width * 0.92) / subW, (canvas.height * 0.92) / 630);
        const dW = 1024 * sc2;
        const dH = 682 * sc2;
        const oX = (canvas.width - dW) / 2;
        const oY = canvas.height - subBY * sc2;
        const ncx = canvas.width / 2;
        const ncy = canvas.height / 2;

        for (let i = 0; i < pts.length && i < sc.length; i++) {
          const pt = pts[i];
          const tX = oX + pt.nx * dW;
          const tY = oY + pt.ny * dH;
          const angle = Math.atan2(tY - ncy, tX - ncx) + (mulberry32(i * 7 + 15) - 0.5) * 0.8;
          const dist = (150 + mulberry32(i * 7 + 16) * 350) * dpr;
          sc[i].dx = Math.cos(angle);
          sc[i].dy = Math.sin(angle);
          sc[i].angle = angle;
          sc[i].dist = dist;
        }

        // Also recompute start positions
        const sX = startXRef.current;
        const sY = startYRef.current;
        if (sX && sY) {
          const spreadX2 = canvas.width * 0.3;
          const spreadY2 = canvas.height * 0.3;
          for (let i = 0; i < pts.length; i++) {
            const pt = pts[i];
            const tX = oX + pt.nx * dW;
            const tY = oY + pt.ny * dH;
            const r1 = mulberry32(i * 7 + 13);
            const r2 = mulberry32(i * 7 + 14);
            sX[i] = tX + (r1 - 0.5) * spreadX2;
            sY[i] = tY + (r2 - 0.5) * spreadY2;
          }
        }

        needsRenderRef.current = true;
        renderFrame();
        ScrollTrigger.refresh();
      }, 100);
    });
    resizeObserver.observe(container);

    return () => {
      mounted = false;
      resizeObserver.disconnect();
      clearTimeout(resizeTimer);
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      if (assemblyTlRef.current) {
        assemblyTlRef.current.kill();
      }
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
      }
    };
  }, [imageSrc, renderFrame, onAssemblyComplete, onScrollUpdate]);

  if (loadError) {
    return (
      <div ref={containerRef} className={`hero-particle-container ${className}`}>
        <img
          src={imageSrc}
          alt="Adit Jain portrait"
          className="hero-particle-fallback"
        />
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`hero-particle-container ${className}`}>
      <canvas ref={canvasRef} className="hero-particle-canvas" aria-hidden="true" />
      <noscript>
        <img src={imageSrc} alt="Adit Jain portrait" style={{ maxWidth: '100%' }} />
      </noscript>
    </div>
  );
};
