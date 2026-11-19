import { gsap } from './gsap';

export interface MorphCharSlot {
  cell: HTMLElement;
  inner: HTMLElement;
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
 * Alphabetically morphs a set of character slots from one word to another.
 * Each character dynamically cycles through alphabetical letters towards its target.
 */
export const runAlphabeticalMorph = ({
  slots,
  fromText,
  toText,
  duration = 1.25,
  delay = 0,
  stagger = 0.035,
  onComplete,
}: MorphOptions) => {
  const maxLen = Math.min(slots.length, Math.max(fromText.length, toText.length));

  slots.forEach((item, idx) => {
    if (idx >= maxLen) return;

    const startC = (fromText[idx] || ' ').toUpperCase();
    const endC = (toText[idx] || ' ').toUpperCase();

    // Compute sequence of alphabetical steps
    const sequence: string[] = [];
    if (startC === ' ') {
      const endIdx = ALPHABET.indexOf(endC);
      const stepsCount = Math.min(8, (endIdx >= 0 ? endIdx : 5) + 1);
      for (let s = 0; s < stepsCount; s++) {
        sequence.push(ALPHABET[s % 26]);
      }
      sequence.push(endC);
    } else if (endC === ' ') {
      const startIdx = ALPHABET.indexOf(startC);
      for (let s = 1; s <= 6; s++) {
        sequence.push(ALPHABET[(startIdx + s) % 26]);
      }
      sequence.push(' ');
    } else {
      const startIdx = ALPHABET.indexOf(startC);
      const endIdx = ALPHABET.indexOf(endC);
      let diff = (endIdx - startIdx + 26) % 26;
      if (diff < 7) diff += 26; // at least 7-8 steps for a rich alphabetical progression
      for (let s = 1; s <= diff; s++) {
        sequence.push(ALPHABET[(startIdx + s) % 26]);
      }
    }

    const charDelay = delay + idx * stagger;
    const charDuration = Math.max(0.4, duration - maxLen * stagger);
    const stepTime = charDuration / sequence.length;

    item.cell.classList.remove('settled');
    item.cell.classList.add('cycling');

    // Smoothly adapt slot width to target letter
    gsap.to(item.cell, {
      width: CHAR_WIDTHS[endC] || '0.6em',
      duration: charDuration * 0.85,
      delay: charDelay,
      ease: 'power2.out',
    });

    // Step through the letters of the alphabet
    sequence.forEach((ch, sIdx) => {
      gsap.delayedCall(charDelay + sIdx * stepTime, () => {
        item.inner.textContent = ch === ' ' ? '\u00A0' : ch;

        // Subtle micro-motion on each alphabetical tick
        gsap.fromTo(
          item.inner,
          { yPercent: -14, opacity: 0.85 },
          { yPercent: 0, opacity: 1, duration: stepTime * 0.85, ease: 'none' }
        );

        if (sIdx === sequence.length - 1) {
          item.cell.classList.remove('cycling');
          item.cell.classList.add('settled');
        }
      });
    });
  });

  if (onComplete) {
    gsap.delayedCall(delay + duration + 0.08, onComplete);
  }
};
