import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  ssr: { noExternal: ['react-helmet-async'] },
  server: { proxy: { '/api': 'http://localhost:3000', '/media': 'http://localhost:3000' } },
  preview: { port: 4173 }
});
