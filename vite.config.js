import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  // Relative base path for GitHub Pages compatibility
  base: './',

  server: {
    port: 5173,
    open: true,
  },

  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 600,

    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes('node_modules/react') ||
            id.includes('node_modules/react-dom') ||
            id.includes('node_modules/react-router')
          ) {
            return 'vendor-react';
          }

          if (
            id.includes('node_modules/@reduxjs') ||
            id.includes('node_modules/react-redux') ||
            id.includes('node_modules/redux')
          ) {
            return 'vendor-redux';
          }

          if (id.includes('node_modules/react-icons')) {
            return 'vendor-icons';
          }
        },
      },
    },
  },
});