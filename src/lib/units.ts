/**
 * Dimension units. The store works in **inches** as the primary unit (what the
 * admin enters and what customers see first); centimetres are derived
 * automatically for a secondary display. Values are persisted in cm on the API,
 * so inches ⇄ cm conversion happens at the UI boundary.
 */

const CM_PER_INCH = 2.54;

export function inchesToCm(inches: number): number {
  return inches * CM_PER_INCH;
}

export function cmToInches(cm: number): number {
  return cm / CM_PER_INCH;
}

/** Rounds to at most 2 decimals and drops trailing zeros (8.00 → "8", 8.5 → "8.5"). */
export function trimNumber(value: number): string {
  return Number(value.toFixed(2)).toString();
}

/** Inches value (from stored cm) as a clean string, e.g. 20.32cm → "8". */
export function cmToInchesLabel(cm: number): string {
  return trimNumber(cmToInches(cm));
}

/**
 * Human-readable dimensions, inches-first with cm in parentheses:
 * (20.32, 25.4) → "8 × 10 in (20 × 25 cm)".
 */
export function formatDimensions(widthCm: number, heightCm: number): string {
  const wIn = cmToInchesLabel(widthCm);
  const hIn = cmToInchesLabel(heightCm);
  const wCm = Math.round(widthCm);
  const hCm = Math.round(heightCm);
  return `${wIn} × ${hIn} in (${wCm} × ${hCm} cm)`;
}
