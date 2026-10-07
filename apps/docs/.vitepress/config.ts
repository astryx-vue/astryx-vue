import { fileURLToPath } from 'node:url'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vitepress'
import unoConfig from '../uno.config.ts'
import { demoSourcePlugin } from './demoSourcePlugin.ts'

function navigation(english: boolean): { text: string, link: string }[] {
  const prefix = english ? '/en' : ''
  return [
    { text: english ? 'Docs' : '文档', link: `${prefix}/guide/getting-started` },
    { text: english ? 'Components' : '组件', link: `${prefix}/components/` },
    { text: english ? 'Playground' : '演练场', link: `${prefix}/playground/` },
    { text: english ? 'Themes' : '主题', link: `${prefix}/themes/` },
  ]
}

export default defineConfig({
  title: 'astryx-vue',
  description: '面向 Vue 3 的 Astryx 设计系统社区实现。',
  srcDir: 'docs',
  cleanUrls: true,
  rewrites: {
    'zh/components/:slug/index.md': 'components/:slug.md',
    'en/components/:slug/index.md': 'en/components/:slug.md',
    'zh/:rest*': ':rest*',
  },
  head: [['link', { rel: 'icon', href: '/favicon.svg' }]],
  appearance: 'dark',
  locales: {
    root: { label: '简体中文', lang: 'zh-CN', themeConfig: { nav: navigation(false) } },
    en: {
      label: 'English',
      lang: 'en',
      description: 'A community Vue 3 implementation of the Astryx design system.',
      themeConfig: { nav: navigation(true) },
    },
  },
  themeConfig: {
    logo: '/icon-logo.svg',
    search: { provider: 'local' },
  },
  vite: {
    publicDir: fileURLToPath(new URL('../public', import.meta.url)),
    resolve: { conditions: ['source', 'module', 'browser', 'development|production'] },
    plugins: [demoSourcePlugin(), UnoCSS(unoConfig)],
  },
})
