import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
 const env = loadEnv(mode, process.cwd(), 'VITE_');
 const siteUrl = process.env.VITE_SITE_URL || env.VITE_SITE_URL;
 const base = siteUrl ? `${new URL(siteUrl).pathname.replace(/\/$/, '')}/` : '/';
 return {
  base,
  plugins: [react()],
  ssr: { noExternal: ['react-helmet-async'] },
  server: { proxy: { '/api': 'http://localhost:3000', '/media': 'http://localhost:3000' } },
  preview: { port: 4173 }
 };
});
