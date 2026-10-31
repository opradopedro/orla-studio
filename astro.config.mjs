import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { site } from './src/config.ts';

export default defineConfig({
  site: site.dominio.toLowerCase(),
  integrations: [sitemap()],
});
