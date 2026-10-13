import { defineConfig, passthroughImageService } from 'astro/config'
import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://kinsluck.github.io',
  image: {
    service: passthroughImageService(),
  },
  integrations: [
    mdx({
      remarkPlugins: [],
      rehypePlugins: [],
    }),
    react(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
  output: 'static',
  vite: {
    css: {
      devSourcemap: false,
      preprocessorOptions: {
        scss: {},
      },
    },
  },
})
