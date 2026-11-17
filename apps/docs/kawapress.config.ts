import { fileURLToPath } from 'node:url'
import { astryxIcons } from '@astryx-vue/core/icons'
import { shikiPlugin } from '@kawapress/plugin-shiki'
import { nagi } from 'kawapress/nagi'
import UnoCSS from 'unocss/vite'
import { demoSourcePlugin } from './site/demoSourcePlugin.ts'
import { llmsPlugin } from './site/llmsPlugin.ts'
import { guideSidebar, labSidebar, themeSidebar } from './site/sidebar.ts'
import { vueLanguage } from './site/vueLanguage.ts'
import unoConfig from './uno.config.ts'

function docsIconPlugin(): ReturnType<typeof astryxIcons> {
  const plugin = astryxIcons()
  const scan = plugin.transform
  plugin.transform = (code, id) => id.includes('/Icon/semantic.') ? undefined : scan(code, id)
  return plugin
}

function navigation(english: boolean) {
  const prefix = english ? '/en' : ''
  return [
    { text: english ? 'Docs' : '文档', link: `${prefix}/guide/why`, activeMatch: `${prefix}/guide` },
    { text: english ? 'Components' : '组件', link: `${prefix}/components/`, activeMatch: `${prefix}/components` },
    { text: english ? 'Playground' : '演练场', link: `${prefix}/playground/`, activeMatch: `${prefix}/playground` },
    { text: english ? 'Themes' : '主题', link: `${prefix}/themes/`, activeMatch: `${prefix}/themes` },
  ]
}

export default nagi({
  title: 'astryx-vue',
  description: '面向 Vue 3 的 Astryx 设计系统社区实现。',
  head: [['link', { rel: 'icon', href: '/favicon.svg' }]],
  srcDir: 'docs',
  publicDir: '../public',
  // 内置 llms 换成 astryx 自己的：组件页三个分页合成一篇，附演示源码。
  llms: false,
  plugins: [
    llmsPlugin(),
    // 同名替换 nagi 内置的代码高亮，加上修过的 Vue grammar。
    shikiPlugin({ languages: vueLanguage }),
  ],
  runtimePlugin: './kawapress.runtime.ts',
  vite: {
    resolve: { conditions: ['source', 'module', 'browser', 'development|production'] },
    // 顶层的 resolve.conditions 只管客户端。服务端也要读包的 `source` 入口，
    // 否则 SSR 渲染的是预构建的 dist，客户端是源码，两边对不上就会 hydration 失败。
    // 其余条件沿用 KawaPress 给 SSR 的默认值。
    ssr: { resolve: { conditions: ['source'] } },
    plugins: [docsIconPlugin(), demoSourcePlugin(), UnoCSS(unoConfig)],
    server: { fs: { allow: [fileURLToPath(new URL('../..', import.meta.url))] } },
  },
  rewrites: {
    'zh/components/:slug/index.md': 'components/:slug.md',
    'en/components/:slug/index.md': 'en/components/:slug.md',
    'zh/lab/:slug/index.md': 'lab/:slug.md',
    'en/lab/:slug/index.md': 'en/lab/:slug.md',
    'zh/:rest*': ':rest*',
  },
  locales: {
    root: { label: '简体中文', lang: 'zh-CN', themeConfig: { nav: navigation(false), sidebar: { '/guide/': guideSidebar(false), '/lab/': labSidebar(false), '/themes/': themeSidebar(false) } } },
    en: { label: 'English', lang: 'en', description: 'A community Vue 3 implementation of the Astryx design system.', themeConfig: { nav: navigation(true), sidebar: { '/en/guide/': guideSidebar(true), '/en/lab/': labSidebar(true), '/en/themes/': themeSidebar(true) } } },
  },
  themeConfig: { logo: '/icon-logo.svg', appearance: 'dark', footer: false },
})
