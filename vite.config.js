import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/KULT-The-browser-based-game/',
  server: { port: 5173 },
  build: {
    outDir: 'docs',
    // emptyOutDir: true ensures a clean build. Static files (e.g. .nojekyll)
    // are placed in public/ so Vite copies them automatically on every build.
    emptyOutDir: true,
    sourcemap: false,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        manualChunks: () => 'index',
      }
    }
  }
})
