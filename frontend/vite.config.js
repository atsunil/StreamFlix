import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname, '.'),
  server: {
    port: 3000,
    strictPort: false,
    open: true,
    middlewareMode: false
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})
