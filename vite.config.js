import { defineConfig } from 'vite';

export default defineConfig({
  // quinnbooth.github.io is a user site, so it's served from the domain root.
  base: '/',
  build: {
    // main.js uses top-level await.
    target: 'es2022',
    chunkSizeWarningLimit: 900,
  },
});
