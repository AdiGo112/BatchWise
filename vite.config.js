import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/BatchWise/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    coverage: { provider: 'v8', include: ['src/**'], exclude: ['src/test/**'], reporter: ['text-summary', 'text'] },
  },
});
