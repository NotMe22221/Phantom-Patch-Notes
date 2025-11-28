import { defineConfig } from 'vite';

export default defineConfig({
  root: './src/frontend',
  build: {
    outDir: '../../dist/frontend'
  },
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:3001'
    }
  },
  test: {
    globals: true,
    root: './',
    environment: 'jsdom'
  }
});
