/**
 * Brand palette for the BeOnEdge app.
 *
 * Mirrors the dark "fintech" look of the web frontend (deep navy backgrounds
 * with indigo / pink / emerald accents) so both clients feel consistent.
 */
export const palette = {
  bg: '#020617',
  bgElevated: '#030a1a',
  surface: '#0b1220',
  surfaceAlt: '#0f172a',
  border: '#1e293b',

  textPrimary: '#f1f5f9',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',

  indigo: '#6366f1',
  indigoDark: '#4f46e5',
  pink: '#ec4899',
  pinkDark: '#db2777',
  emerald: '#34d399',
  emeraldText: '#6ee7b7',
  yellow: '#facc15',
  red: '#f87171',
  redBg: 'rgba(248,113,113,0.12)',
  greenBg: 'rgba(52,211,153,0.12)',

  white: '#ffffff',
  black: '#000000',
  overlay: 'rgba(0,0,0,0.7)',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
} as const;
