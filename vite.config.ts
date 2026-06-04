import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // ✅ PERF: Pre-bundle heavy deps for faster dev server cold starts
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['gsap', 'lenis', '@tanstack/react-query'],
  },

  build: {
    // ✅ PERF: Target modern browsers — produces leaner output (no polyfill bloat)
    target: 'es2020',

    // ✅ PERF: Raise chunk warning threshold (lib chunks are intentionally large)
    chunkSizeWarningLimit: 600,

    rollupOptions: {
      output: {
        // ✅ PERF: Manually split large vendors into separate cached chunks.
        // This means returning visitors only re-download changed code, not the whole bundle.
        manualChunks(id) {
          // GSAP + Lenis (animation runtime)
          if (id.includes('node_modules/gsap') || id.includes('node_modules/lenis')) {
            return 'vendor-animation';
          }
          // Framer Motion
          if (id.includes('node_modules/framer-motion')) {
            return 'vendor-framer';
          }
          // Three.js (only used by ParticleBackground if ever re-enabled)
          if (id.includes('node_modules/three') || id.includes('node_modules/@react-three')) {
            return 'vendor-three';
          }
          // Supabase
          if (id.includes('node_modules/@supabase')) {
            return 'vendor-supabase';
          }
          // React Query
          if (id.includes('node_modules/@tanstack')) {
            return 'vendor-query';
          }
          // React core
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor-react';
          }
        },
        // ✅ PERF: Content-hash chunk names for long-lived browser caching
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
});
