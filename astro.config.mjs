import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://perko.co.il',
  devToolbar: { enabled: false },
  build: { inlineStylesheets: 'auto' },
});
