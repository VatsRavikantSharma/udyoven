// Theme tokens for the FactoryOps ERP app.
// Industrial palette: deep blue, steel gray, white, graphite, muted teal,
// subtle orange for alerts.

export const colors = {
  // Brand
  primary: '#1E3A8A',        // deep blue
  primaryDark: '#152B66',
  primaryLight: '#3B5BDB',
  accent: '#0D9488',         // muted teal
  accentSoft: '#CCFBF1',

  // Neutrals
  bg: '#F4F6FA',
  surface: '#FFFFFF',
  surfaceAlt: '#F8FAFC',
  border: '#E5E9F2',
  divider: '#EEF1F6',

  // Text
  text: '#0F172A',           // graphite
  textMuted: '#64748B',
  textSubtle: '#94A3B8',
  textSecondary: '#64748B',  // alias for textMuted
  textInverse: '#FFFFFF',

  // Steel gray
  steel: '#475569',
  steelLight: '#94A3B8',

  // Status
  success: '#16A34A',
  successBg: '#DCFCE7',
  warning: '#F59E0B',
  warningBg: '#FEF3C7',
  danger: '#DC2626',
  dangerBg: '#FEE2E2',
  info: '#2563EB',
  infoBg: '#DBEAFE',
  alertOrange: '#F97316',
  alertOrangeBg: '#FFEDD5',

  // Chart palette
  chart: ['#1E3A8A', '#0D9488', '#F97316', '#7C3AED', '#DC2626', '#0EA5E9'],

  // Glass / overlay
  overlay: 'rgba(15,23,42,0.55)',
  glass: 'rgba(255,255,255,0.7)',
};

export const radius = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  pill: 999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
};

export const typography = {
  display: { fontSize: 26, fontWeight: '800' as const, color: colors.text, letterSpacing: -0.5 },
  h1: { fontSize: 22, fontWeight: '800' as const, color: colors.text, letterSpacing: -0.3 },
  h2: { fontSize: 18, fontWeight: '700' as const, color: colors.text },
  h3: { fontSize: 16, fontWeight: '700' as const, color: colors.text },
  body: { fontSize: 14, fontWeight: '500' as const, color: colors.text },
  bodyMuted: { fontSize: 14, fontWeight: '500' as const, color: colors.textMuted },
  small: { fontSize: 12, fontWeight: '600' as const, color: colors.textMuted },
  micro: { fontSize: 10, fontWeight: '700' as const, color: colors.textMuted, letterSpacing: 0.4 },
};

export const shadow = {
  card: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
  },
  soft: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  raised: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 22,
    elevation: 6,
  },
};

