/**
 * Convert OKLCH string to Hex
 * @param {string} oklchString - OKLCH color string (e.g., "oklch(70% 0.15 30)" or "oklch(0.7 0.15 30deg)")
 * @returns {string} Hex color string (e.g., "#ff5733")
 */
export function oklchToHex(oklchString: string): string {
  if (oklchString.startsWith('#')) {
    return oklchString;
  }
  // Parse OKLCH string
  const match = oklchString.match(
    /oklch\s*\(\s*([0-9.]+)%?\s+([0-9.]+)\s+([0-9.]+)(?:deg)?\s*\)/i
  );

  if (!match) {
    throw new Error('Invalid OKLCH string format');
  }

  let l = parseFloat(match[1]);
  const c = parseFloat(match[2]);
  const h = parseFloat(match[3]);

  // Convert percentage lightness to 0-1 range
  if (oklchString.includes('%')) {
    l = l / 100;
  }

  // Convert OKLCH to OKLAB
  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);

  // Convert OKLAB to linear LMS
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.291485548 * b;

  const l3 = l_ * l_ * l_;
  const m3 = m_ * m_ * m_;
  const s3 = s_ * s_ * s_;

  // Convert linear LMS to linear RGB
  let r = 4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  let g = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
  let b_rgb = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3;

  // Convert linear RGB to sRGB
  r = linearToSrgb(r);
  g = linearToSrgb(g);
  b_rgb = linearToSrgb(b_rgb);

  // Clamp and convert to 8-bit
  r = Math.max(0, Math.min(255, Math.round(r * 255)));
  g = Math.max(0, Math.min(255, Math.round(g * 255)));
  b_rgb = Math.max(0, Math.min(255, Math.round(b_rgb * 255)));

  // Convert to hex
  return (
    '#' + [r, g, b_rgb].map((x) => x.toString(16).padStart(2, '0')).join('')
  );
}

function linearToSrgb(val: number) {
  // Clamp to valid range first
  val = Math.max(0, Math.min(1, val));

  if (val <= 0.0031308) {
    return 12.92 * val;
  }
  return 1.055 * Math.pow(val, 1 / 2.4) - 0.055;
}
