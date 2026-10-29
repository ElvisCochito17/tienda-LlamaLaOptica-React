import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      // Medimos los componentes y la lógica (services) que tienen pruebas
      include: ['src/componentes/**/*.{js,jsx}', 'src/services/**/*.js'],
      exclude: ['node_modules/', 'src/main.jsx', 'src/test/**', '**/*.test.{js,jsx}'],
    },
  },
})
