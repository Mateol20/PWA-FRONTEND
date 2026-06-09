import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    // Habilita las APIs globales de Vitest (como Jest)
    globals: true,
    // Configura jsdom como entorno de testing
    environment: 'jsdom',
    // Indica el archivo de configuración inicial
    setupFiles: './src/setupTests.js',
  },
});