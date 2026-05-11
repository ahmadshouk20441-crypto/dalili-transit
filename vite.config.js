import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('framer-motion')) return 'motion'
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) return 'vendor'
        },
      },
    },
  },
  server: {
    port: 3000,
  },
})
