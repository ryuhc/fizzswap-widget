import path from 'path'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    },
    environment: 'jsdom',
    setupFiles: ['./vitest-setup.ts']
  },
})