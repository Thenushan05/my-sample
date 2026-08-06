import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.glb'],
  base: '/',
  server: {
    watch: {
      // Exclude the public folder from the watcher — large/locked image files
      // (e.g. rembg output) were crashing the dev server with EBUSY errors.
      ignored: [path.resolve(__dirname, 'public/**')],
    },
  },
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
