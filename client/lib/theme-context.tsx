import React, { createContext, useState, useContext, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { Colors, ThemeTokens } from '../constants/colors';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeTokens;
  mode: ThemeMode;
  toggle: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>(systemScheme === 'dark' ? 'dark' : 'light');

  const toggle = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const isDark = mode === 'dark';
  const theme = Colors[mode];

  return (
    <ThemeContext.Provider value={{ theme, mode, toggle, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
