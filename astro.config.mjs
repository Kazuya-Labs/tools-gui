// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [react(), sitemap({
    filter: (page) => !page.endsWith('/404/'),
    i18n: {
      defaultLocale: 'id',
      locales: {
        id: 'id-ID',
        en: 'en-US',
        ru: 'ru-RU',
        'zh-CN': 'zh-CN',
        ms: 'ms-MY',
        tl: 'tl-PH',
        ja: 'ja-JP',
        'pt-BR': 'pt-BR',
        hi: 'hi-IN',
      },
    },
  }), icon({
    include: {
      mdi: [
        'shield-lock', 'content-copy', 'link', 'phone', 'swap-horizontal',
        'calculator', 'format-letter-case', 'code-braces', 'file-document',
        'key', 'file-account', 'alert', 'home', 'refresh', 'download',
        'chart-bar', 'magnify', 'play', 'unfold-less-horizontal', 'auto-fix',
        'gift', 'open-in-new', 'information', 'account-group', 'check',
        'close', 'alert-circle', 'plus', 'account', 'briefcase', 'school',
        'toolbox', 'note', 'dots-horizontal', 'view-list', 'table-row',
        'translate'
      ],
      carbon: ['language']
    }
  })],
  site: "https://tools.kazuyatech.id",
  output: "static",
  redirects: {
    '/tools/daget-hunter': '/id/tools/daget-hunter/',
    '/tools/repeater-text': '/id/tools/repeater-text/',
    '/tools/extract-url': '/id/tools/extract-url/',
    '/tools/extract-phone': '/id/tools/extract-phone/',
    '/tools/replace-text': '/id/tools/replace-text/',
    '/tools/word-counter': '/id/tools/word-counter/',
    '/tools/case-converter': '/id/tools/case-converter/',
    '/tools/base64-codec': '/id/tools/base64-codec/',
    '/tools/json-formatter': '/id/tools/json-formatter/',
    '/tools/lorem-ipsum': '/id/tools/lorem-ipsum/',
    '/tools/password-generator': '/id/tools/password-generator/',
    '/tools/cv-builder': '/id/tools/cv-builder/',
  },
  i18n: {
    defaultLocale: "id",
    locales: ["id", "en", "ru", "zh-CN", "ms", "tl", "ja", "pt-BR", "hi"],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: true
    }
  },
  server: {
    host: "0.0.0.0",
	port:20004,
    allowedHosts: ["colmex.web.id", "tools.kazuyatech.id"]
  },

  vite: {
    plugins: [tailwindcss()],
    build: {
      chunkSizeWarningLimit: 1100
    }
  }
});
