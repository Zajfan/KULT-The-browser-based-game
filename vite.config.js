import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves from /KULT-The-browser-based-game/
  base: '/KULT-The-browser-based-game/',
  server: { port: 5173 },
  build: { outDir: 'dist', sourcemap: false }
})
