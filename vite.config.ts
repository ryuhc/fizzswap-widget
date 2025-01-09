// vite.config.ts
import fs from 'node:fs'
import { resolve } from 'node:path'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { libInjectCss } from 'vite-plugin-lib-inject-css'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, process.env.NODE_ENV === 'production' ? 'src/index.tsx' : 'src/index.dev.tsx'),
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
    },
    cssCodeSplit: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: process.env.NODE_ENV === 'production' ? {} : {
    https: {
      key: fs.readFileSync(resolve(__dirname, 'certificates/localhost-key.pem')),
      cert: fs.readFileSync(resolve(__dirname, 'certificates/localhost.pem')),
    },
    // Make sure the server is accessible over the local network
    host: '0.0.0.0',
  },
  plugins: [
    nodePolyfills(),
    react(),
    // parse tsconfig paths
    tsconfigPaths(),
    // declaration type concerned plugin
    dts({
      copyDtsFiles: true,
      tsconfigPath: './tsconfig.json',
      exclude: [
        'dist',
        'node_modules',
        'src/__mock__',
        'src/i18n.ts',
        'src/vite-env.d.ts',
        '**/*.test.ts*',
        'vite.config.ts',
        'vitest*.ts',
      ],
    }),
    libInjectCss(),
  ],
})