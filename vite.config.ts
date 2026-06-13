import { defineConfig } from 'vite';

// 静的ホスティング（GitHub Pages 等のサブパス）でも動くよう base を相対に。
export default defineConfig({
  base: './',
  server: {
    host: true,
    port: 5173,
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    sourcemap: true,
  },
});
