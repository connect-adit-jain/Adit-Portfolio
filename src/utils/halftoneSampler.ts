/**
 * Halftone Portrait Sampler Utility
 * Loads adit-halftone-hero.png and extracts normalized coordinates of visible Sand pixels.
 * Uses adaptive sampling: prioritizes facial and glasses density for maximum detail,
 * adhering to the 4,000–8,000 particle budget on desktop and 2,000–3,500 on mobile.
 */

export interface SampledPoint {
  nx: number; // Normalized X (0 to 1)
  ny: number; // Normalized Y (0 to 1)
  brightness: number; // Normalized brightness (0 to 1)
  isFace?: boolean; // Face priority point
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

        // Facial bounding region in 1024x682:
        // Y: 50 to 400 (hairline, eyes, spectacles, smile, chin)
        // X: 330 to 660 (ear to ear)
        const faceYMin = 50;
        const faceYMax = 400;
        const faceXMin = 330;
        const faceXMax = 660;

        // Desktop Budget Target: ~7,000 particles (4,000–8,000 budget)
        // Face step 3 (thresh 40) -> ~5,300 pts
        // Body step 4 (thresh 48) -> ~1,750 pts
        // Total: ~7,043 pts
        //
        // Mobile Budget Target: ~2,360 particles (2,000–3,500 budget)
        // Face step 5 (thresh 48) -> ~1,800 pts
        // Body step 7 (thresh 52) -> ~560 pts
        // Total: ~2,360 pts
        const faceStep = isMobileDevice ? 5 : 3;
        const faceThresh = isMobileDevice ? 48 : 40;

        const bodyStep = isMobileDevice ? 7 : 4;
        const bodyThresh = isMobileDevice ? 52 : 48;

        const points: SampledPoint[] = [];

        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const inFace = y >= faceYMin && y <= faceYMax && x >= faceXMin && x <= faceXMax;
            const currentStep = inFace ? faceStep : bodyStep;

            if (y % currentStep !== 0 || x % currentStep !== 0) {
              continue;
            }

            const idx = (y * width + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];

            // Perceptual luminance calculation
            const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
            const requiredThresh = inFace ? faceThresh : bodyThresh;

            if (luminance >= requiredThresh) {
              points.push({
                nx: x / width,
                ny: y / height,
                brightness: Math.min(1, luminance / 255),
                isFace: inFace,
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
