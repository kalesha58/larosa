// LaRosa Villas — Premium Forest Green & Soft Sage palette
// Dark: deep pine black with active forest green accents
// Light: sophisticated soft sage/gray off-white with deep forest green accents

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
  bg: '#0A110E',          // deep pine black
  surface: '#111C18',     // dark forest slate card
  surfaceElevated: '#172621', // elevated dark card
  surfaceHover: '#20332C',
  border: '#1C2E28',
  borderSoft: '#14221D',

  // Text
  text: '#E2ECE7',        // mint warm-white
  textSecondary: '#A0B2A9',
  textMuted: '#6A7C74',
  textInverse: '#0A110E',

  // Brand — Forest Green
  gold: '#235347',        // primary forest green
  goldSoft: '#38695E',    // muted sage
  goldDim: '#16372F',     // dark accent green
  goldGlow: 'rgba(35, 83, 71, 0.15)',

  // Accents
  rose: '#DCA5AD',        // light dusty rose
  roseSoft: 'rgba(220, 165, 173, 0.15)',

  // Status
  green: '#235347',
  greenSoft: 'rgba(35, 83, 71, 0.15)',
  amber: '#E0A84A',
  amberSoft: 'rgba(224, 168, 74, 0.15)',
  red: '#D4625A',
  redSoft: 'rgba(212, 98, 90, 0.15)',
  blue: '#5B8FC4',
  blueSoft: 'rgba(91, 143, 196, 0.15)',
  purple: '#8B7AB8',
  purpleSoft: 'rgba(139, 122, 184, 0.15)',

  // Channel colors
  website: '#5B8FC4',
  airbnb: '#D4625A',
  manual: '#8B7AB8',

  // Gradient
  gradientEnd: '#111C18',
};

export const lightTheme: ThemeTokens = {
  // Backgrounds
  bg: '#F4F6F5',          // sophisticated soft sage/gray off-white
  surface: '#FFFFFF',     // white card surface
  surfaceElevated: '#E6EDE9', // soft sage elevated/selected states
  surfaceHover: '#DCE5E0',
  border: '#E0E6E3',
  borderSoft: '#ECF0EE',

  // Text
  text: '#111C18',        // deep charcoal green
  textSecondary: '#4A5A53',
  textMuted: '#7E9088',
  textInverse: '#FFFFFF',

  // Brand — deep forest green
  gold: '#235347',        // Forest green primary brand accent
  goldSoft: '#38695E',    // sage green accents
  goldDim: '#16372F',     // dark forest green press/shadow states
  goldGlow: 'rgba(35, 83, 71, 0.08)', // very light tint for badges

  // Accents
  rose: '#C27D86',        // dusty rose
  roseSoft: '#F0E5E7',

  // Status
  green: '#235347',
  greenSoft: 'rgba(35, 83, 71, 0.08)',
  amber: '#C48A2A',
  amberSoft: 'rgba(196, 138, 42, 0.12)',
  red: '#C44A3E',
  redSoft: 'rgba(196, 74, 62, 0.12)',
  blue: '#3D6FA8',
  blueSoft: 'rgba(61, 111, 168, 0.12)',
  purple: '#7260A0',
  purpleSoft: 'rgba(114, 96, 160, 0.12)',

  // Channel colors
  website: '#3D6FA8',
  airbnb: '#C44A3E',
  manual: '#7260A0',

  // Gradient
  gradientEnd: '#E6EDE9',
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
