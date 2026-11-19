import { gsap } from './gsap';

export interface MorphCharSlot {
  cell: HTMLElement;
  inner?: HTMLElement;
}

export const CHAR_WIDTHS: Record<string, string> = {
  A: '0.65em',
  B: '0.62em',
  C: '0.62em',
  D: '0.68em',
  E: '0.55em',
  F: '0.55em',
  G: '0.68em',
  H: '0.68em',
  I: '0.28em',
  J: '0.52em',
  K: '0.62em',
  L: '0.52em',
  M: '0.78em',
  N: '0.68em',
  O: '0.68em',
  P: '0.62em',
  Q: '0.68em',
  R: '0.65em',
  S: '0.58em',
  T: '0.55em',
  U: '0.65em',
  V: '0.62em',
  W: '0.85em',
  X: '0.62em',
  Y: '0.58em',
  Z: '0.58em',
  ' ': '0.36em',
};

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export interface MorphOptions {
  slots: MorphCharSlot[];
  fromText: string;
  toText: string;
  duration?: number;
  delay?: number;
  stagger?: number;
  onComplete?: () => void;
}

/**
 * Buttery smooth, GPU-accelerated alphabetical morph without glow.
 * Constructs smooth continuous vertical strips that roll cleanly through the alphabet.
 */
export const runAlphabeticalMorph = ({
  slots,
  fromText,
  toText,
  duration = 1.15,
  delay = 0,
  stagger = 0.04,
  onComplete,
}: MorphOptions) => {
  const maxLen = Math.min(slots.length, Math.max(fromText.length, toText.length));

  slots.forEach((item, idx) => {
    if (idx >= maxLen || !item.cell) return;

    const startC = (fromText[idx] || ' ').toUpperCase();
    const endC = (toText[idx] || ' ').toUpperCase();

    // Build the alphabetical sequence of letters
    const chars: string[] = [startC];
    if (startC === ' ') {
      const endIdx = ALPHABET.indexOf(endC);
      const steps = Math.min(8, (endIdx >= 0 ? endIdx : 5) + 1);
      for (let s = 0; s < steps; s++) chars.push(ALPHABET[s % 26]);
      chars.push(endC);
    } else if (endC === ' ') {
      const startIdx = ALPHABET.indexOf(startC);
      for (let s = 1; s <= 6; s++) chars.push(ALPHABET[(startIdx + s) % 26]);
      chars.push(' ');
    } else {
      const startIdx = ALPHABET.indexOf(startC);
      const endIdx = ALPHABET.indexOf(endC);
      let diff = (endIdx - startIdx + 26) % 26;
      if (diff < 7) diff += 26; // at least 7-8 alphabetical steps for smooth momentum
      for (let s = 1; s <= diff; s++) {
        chars.push(ALPHABET[(startIdx + s) % 26]);
      }
    }

    // Build smooth vertical strip
    item.cell.innerHTML = '';
    const strip = document.createElement('div');
    strip.className = 'char-strip';

    chars.forEach((ch) => {
      const span = document.createElement('span');
      span.className = 'char-item';
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      strip.appendChild(span);
    });

    item.cell.appendChild(strip);

    const charDelay = delay + idx * stagger;
    const targetYPercent = -((chars.length - 1) / chars.length) * 100;

    // Smooth GPU transform for the strip
    gsap.fromTo(
      strip,
      { yPercent: 0 },
      {
        yPercent: targetYPercent,
        duration: duration,
        delay: charDelay,
        ease: 'power2.inOut',
      }
    );

    // Smooth slot width transition
    gsap.to(item.cell, {
      width: CHAR_WIDTHS[endC] || '0.6em',
      duration: duration * 0.85,
      delay: charDelay + 0.08,
      ease: 'power2.out',
    });
  });

  if (onComplete) {
    const totalTime = delay + maxLen * stagger + duration + 0.05;
    gsap.delayedCall(totalTime, onComplete);
  }
};
