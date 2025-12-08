import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    dedupe: ['rxjs'],
  },
  optimizeDeps: {
    include: ['rxjs', '@apollo/client'],
    exclude: [],
  },
  server: {
    port: 3000,
    host: true,
    strictPort: false,
  },
  preview: {
    port: 3000,
    host: true,
    strictPort: false,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    commonjsOptions: {
      include: [/rxjs/, /node_modules/],
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          apollo: ['@apollo/client'],
        },
      },
    },
  },
  define: {
    'process.env': {},
  },
});
