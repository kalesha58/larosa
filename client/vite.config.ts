import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Force every react-native import onto RN-web so Platform.OS === 'web' in prod
      'react-native': 'react-native-web',
    },
    dedupe: ['react', 'react-dom', 'react-native-web'],
    extensions: [
      '.web.tsx',
      '.web.ts',
      '.web.jsx',
      '.web.js',
      '.tsx',
      '.ts',
      '.jsx',
      '.js',
      '.json',
    ],
    conditions: ['browser', 'module', 'import', 'default'],
  },
  define: {
    global: 'window',
    __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
  },
  optimizeDeps: {
    esbuildOptions: {
      mainFields: ['browser', 'module', 'main'],
      resolveExtensions: [
        '.web.tsx',
        '.web.ts',
        '.web.jsx',
        '.web.js',
        '.tsx',
        '.ts',
        '.jsx',
        '.js',
      ],
    },
    include: [
      'react-native-web',
      'react-native-svg',
      'react-native-gesture-handler',
      'react-native-safe-area-context',
      '@react-navigation/native',
      '@react-navigation/stack',
      '@react-navigation/bottom-tabs',
    ],
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});
