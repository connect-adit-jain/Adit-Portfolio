/**
 * Halftone Portrait Sampler Utility
 * Loads adit-halftone-hero.png and extracts normalized coordinates of visible Sand pixels.
 * Caches sample results to prevent redundant processing.
 */

export interface SampledPoint {
  nx: number; // Normalized X (0 to 1)
  ny: number; // Normalized Y (0 to 1)
  brightness: number; // Normalized brightness (0 to 1)
}

interface CacheEntry {
  points: SampledPoint[];
  aspectRatio: number;
}

let cachedDesktopData: CacheEntry | null = null;
let cachedMobileData: CacheEntry | null = null;

export async function sampleHalftonePortrait(
  imageSrc: string,
  isMobileDevice: boolean = false
): Promise<CacheEntry> {
  // Check memory cache first
  if (isMobileDevice && cachedMobileData) {
    return cachedMobileData;
  }
  if (!isMobileDevice && cachedDesktopData) {
    return cachedDesktopData;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;

    img.onload = () => {
      try {
        const width = img.naturalWidth || img.width;
        const height = img.naturalHeight || img.height;
        const aspectRatio = width / height;

        // Offscreen sampling canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        if (!ctx) {
          reject(new Error('Failed to create offscreen 2D context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data;

        // Adaptive stride based on device constraints:
        // Desktop: step 3 (~6,500 - 8,000 particles)
        // Mobile: step 4-5 (~2,200 - 3,200 particles)
        const step = isMobileDevice ? 5 : 3;
        const threshold = isMobileDevice ? 45 : 48; // Minimum brightness to register as portrait highlight

        const points: SampledPoint[] = [];

        for (let y = 0; y < height; y += step) {
          for (let x = 0; x < width; x += step) {
            const idx = (y * width + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];

            // Perceptual luminance calculation
            const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

            if (luminance >= threshold) {
              points.push({
                nx: x / width,
                ny: y / height,
                brightness: Math.min(1, luminance / 255),
              });
            }
          }
        }

        const result: CacheEntry = {
          points,
          aspectRatio,
        };

        if (isMobileDevice) {
          cachedMobileData = result;
        } else {
          cachedDesktopData = result;
        }

        resolve(result);
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = (err) => {
      reject(new Error(`Failed to load portrait image at ${imageSrc}: ${err}`));
    };
  });
}
