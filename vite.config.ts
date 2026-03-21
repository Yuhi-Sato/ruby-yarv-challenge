import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import wasm from 'vite-plugin-wasm'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    wasm(),
tailwindcss(),
  ],
  optimizeDeps: {
    exclude: ['@ruby/4.0-wasm-wasi', '@ruby/wasm-wasi'],
  },
  base: '/ruby-yarv-challenge/',
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
  },
})
