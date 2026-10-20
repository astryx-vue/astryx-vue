import type { DefaultTheme } from 'vitepress'
import { fileURLToPath } from 'node:url'
import { astryxIcons } from '@astryx-vue/core/icons'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vitepress'
import unoConfig from '../uno.config.ts'
import { demoSourcePlugin } from './demoSourcePlugin.ts'
import { llmsAlternateLinks, writeLlmsArtifacts } from './llms.ts'
import { guideSidebar, themeSidebar } from './sidebar.ts'

function navigation(english: boolean): DefaultTheme.NavItem[] {
  const prefix = english ? '/en' : ''
  return [
    { text: english ? 'Docs' : '文档', link: `${prefix}/guide/why`, activeMatch: `^${prefix}/guide/` },
    { text: english ? 'Components' : '组件', link: `${prefix}/components/`, activeMatch: `^${prefix}/components/` },
    { text: english ? 'Playground' : '演练场', link: `${prefix}/playground/`, activeMatch: `^${prefix}/playground` },
    { text: english ? 'Themes' : '主题', link: `${prefix}/themes/`, activeMatch: `^${prefix}/themes/` },
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
  transformHead: llmsAlternateLinks,
  buildEnd: writeLlmsArtifacts,
  appearance: 'dark',
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      themeConfig: {
        nav: navigation(false),
        sidebar: {
          '/guide/': guideSidebar(false),
          '/themes/': themeSidebar(false),
        },
      },
    },
    en: {
      label: 'English',
      lang: 'en',
      description: 'A community Vue 3 implementation of the Astryx design system.',
      themeConfig: {
        nav: navigation(true),
        sidebar: {
          '/en/guide/': guideSidebar(true),
          '/en/themes/': themeSidebar(true),
        },
      },
    },
  },
  themeConfig: {
    logo: '/icon-logo.svg',
    search: { provider: 'local' },
  },
  vite: {
    publicDir: fileURLToPath(new URL('../public', import.meta.url)),
    resolve: { conditions: ['source', 'module', 'browser', 'development|production'] },
    plugins: [astryxIcons(), demoSourcePlugin(), UnoCSS(unoConfig)],
    server: {
      fs: {
        allow: [fileURLToPath(new URL('../../..', import.meta.url))],
      },
    },
  },
})
