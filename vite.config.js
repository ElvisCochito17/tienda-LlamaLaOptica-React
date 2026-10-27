import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
// Habilita variables globales como 'describe', 'test', 'expect' 
// sin necesida de importarlas
globals: true,
// Simula el entorno del navegador en Node.js
environment: 'jsdom',
// Archivo que se ejecutará antes de cada test para preparar el entorno
setupFiles: './src/setupTests.js',
}, 
})
