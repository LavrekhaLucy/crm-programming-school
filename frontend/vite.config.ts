import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  build: {
    outDir: "../client",
    emptyOutDir: true,
  },
  plugins: [react(), tailwindcss(), ],
})


