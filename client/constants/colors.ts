// LaRosa Villas — Luxury admin palette
// Dark: warm charcoal with champagne gold accents
// Light: warm ivory with deep bronze gold accents

export type ThemeMode = 'dark' | 'light';

export interface ThemeTokens {
  // Backgrounds
  bg: string;
  surface: string;
  surfaceElevated: string;
  surfaceHover: string;
  border: string;
  borderSoft: string;

  // Text
  text: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;

  // Brand — champagne gold
  gold: string;
  goldSoft: string;
  goldDim: string;
  goldGlow: string;

  // Accents
  rose: string;
  roseSoft: string;

  // Status
  green: string;
  greenSoft: string;
  amber: string;
  amberSoft: string;
  red: string;
  redSoft: string;
  blue: string;
  blueSoft: string;
  purple: string;
  purpleSoft: string;

  // Channel colors
  website: string;
  airbnb: string;
  manual: string;

  // Gradient endpoints for login / hero backgrounds
  gradientEnd: string;
}

export const darkTheme: ThemeTokens = {
  // Backgrounds
  bg: '#0E0B07',          // deep warm charcoal
  surface: '#17130D',     // card surface
  surfaceElevated: '#1F1A12', // elevated card
  surfaceHover: '#271F15',
  border: '#2A2118',
  borderSoft: '#1E1810',

  // Text
  text: '#F5EFE6',        // primary warm white
  textSecondary: '#A89B8A',
  textMuted: '#6B6358',
  textInverse: '#14110D',

  // Brand — champagne gold
  gold: '#C9A961',
  goldSoft: '#D4B978',
  goldDim: '#8A7440',
  goldGlow: 'rgba(201,169,97,0.15)',

  // Accents
  rose: '#B04868',        // LaRosa rose
  roseSoft: '#C46B85',

  // Status
  green: '#5BAE7A',
  greenSoft: 'rgba(91,174,122,0.15)',
  amber: '#E0A84A',
  amberSoft: 'rgba(224,168,74,0.15)',
  red: '#D4625A',
  redSoft: 'rgba(212,98,90,0.15)',
  blue: '#5B8FC4',
  blueSoft: 'rgba(91,143,196,0.15)',
  purple: '#8B7AB8',
  purpleSoft: 'rgba(139,122,184,0.15)',

  // Channel colors
  website: '#5B8FC4',
  airbnb: '#D4625A',
  manual: '#8B7AB8',

  // Gradient
  gradientEnd: '#15110A',
};

export const lightTheme: ThemeTokens = {
  // Backgrounds
  bg: '#FAF6F0',          // warm ivory
  surface: '#FFFFFF',     // white card surface
  surfaceElevated: '#F3EDE3', // warm cream elevated
  surfaceHover: '#EBE3D5',
  border: '#E2D9C8',
  borderSoft: '#EDE6D8',

  // Text
  text: '#2A2118',        // deep warm brown
  textSecondary: '#6B5D4A',
  textMuted: '#A89B8A',
  textInverse: '#FFFFFF',

  // Brand — deep bronze gold (darker for contrast on light)
  gold: '#A88840',
  goldSoft: '#C9A961',
  goldDim: '#7A6630',
  goldGlow: 'rgba(168,136,64,0.12)',

  // Accents
  rose: '#9E3D5C',
  roseSoft: '#B8657A',

  // Status — slightly deeper for light bg legibility
  green: '#3D8C5A',
  greenSoft: 'rgba(61,140,90,0.12)',
  amber: '#C48A2A',
  amberSoft: 'rgba(196,138,42,0.12)',
  red: '#C44A3E',
  redSoft: 'rgba(196,74,62,0.12)',
  blue: '#3D6FA8',
  blueSoft: 'rgba(61,111,168,0.12)',
  purple: '#7260A0',
  purpleSoft: 'rgba(114,96,160,0.12)',

  // Channel colors
  website: '#3D6FA8',
  airbnb: '#C44A3E',
  manual: '#7260A0',

  // Gradient
  gradientEnd: '#F3EDE3',
};

// Keep backwards-compatible static export (dark theme)
export const theme: ThemeTokens = darkTheme;

export const Colors: {
  light: ThemeTokens;
  dark: ThemeTokens;
} = {
  light: lightTheme,
  dark: darkTheme,
};
export type ThemeColor = keyof ThemeTokens;
