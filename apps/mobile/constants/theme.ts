/** Design tokens — selaras dengan web (Material 3 / Tailwind Sura) */
export const Colors = {
  background: '#fbf8ff',
  surface: '#fbf8ff',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f4f2fc',
  surfaceContainer: '#eeedf7',
  surfaceContainerHigh: '#e8e7f1',
  surfaceContainerHighest: '#e3e1eb',
  onSurface: '#1a1b22',
  onSurfaceVariant: '#444653',
  primary: '#00288e',
  onPrimary: '#ffffff',
  primaryContainer: '#1e40af',
  onPrimaryContainer: '#a8b8ff',
  primaryFixed: '#dde1ff',
  secondary: '#505f76',
  onSecondary: '#ffffff',
  secondaryContainer: '#d0e1fb',
  onSecondaryContainer: '#54647a',
  tertiary: '#303539',
  error: '#ba1a1a',
  onError: '#ffffff',
  errorContainer: '#ffdad6',
  onErrorContainer: '#93000a',
  outline: '#757684',
  outlineVariant: '#c4c5d5',
  inversePrimary: '#b8c4ff',
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  gutter: 16,
} as const;

export const Typography = {
  h1: { fontSize: 28, fontWeight: '700' as const, lineHeight: 36 },
  h2: { fontSize: 22, fontWeight: '700' as const, lineHeight: 28 },
  h3: { fontSize: 18, fontWeight: '600' as const, lineHeight: 24 },
  bodyLg: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodyMd: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  bodySm: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
  labelBold: { fontSize: 11, fontWeight: '700' as const, letterSpacing: 0.5 },
  button: { fontSize: 14, fontWeight: '600' as const },
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
};
