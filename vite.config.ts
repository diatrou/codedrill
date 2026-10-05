import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Ρυθμίσεις Vite για build και deployment στο GitHub Pages
// Vite configuration for build and deployment on GitHub Pages
export default defineConfig({
  plugins: [react()],
  base: '/codedrill/', // Βάλτε το όνομα του repository ανάμεσα σε slashes
});