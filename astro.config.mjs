import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://perko-marketing.vercel.app',
  devToolbar: { enabled: false },
  build: { inlineStylesheets: 'auto' },
});
