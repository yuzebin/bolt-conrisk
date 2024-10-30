import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Needed for Docker
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://107.173.168.46:3000',
        changeOrigin: true,
        secure: false
      }
    }
  }
});