import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.glb'],
  base: '/',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('gsap')) return 'gsap';
            if (id.includes('framer-motion')) return 'framer';
            if (id.includes('@splinetool')) return 'spline';
            return 'vendor';
          }
        },
      },
    },
  },
  optimizeDeps: {
    include: ['gsap', 'framer-motion', '@splinetool/react-spline'],
  },
})
