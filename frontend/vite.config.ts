import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/',
  build: {
    outDir: "../client",
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000,
  },
  plugins: [react(), tailwindcss(), ],
})


