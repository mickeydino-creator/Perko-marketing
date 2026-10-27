import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.getperko.com',
  devToolbar: { enabled: false },
  build: { inlineStylesheets: 'auto' },
});
