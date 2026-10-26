import type { DefaultTheme } from 'vitepress'

type Sidebar = DefaultTheme.SidebarItem[]

function item(text: string, link: string): DefaultTheme.SidebarItem {
  return { text, link }
}

export function guideSidebar(english: boolean): Sidebar {
  const prefix = english ? '/en' : ''
  return [
    {
      text: english ? 'Start' : '开始',
      items: [
        item(english ? 'Introduction' : '介绍', `${prefix}/guide/why`),
        item(english ? 'Principles' : '设计原则', `${prefix}/guide/principles`),
        item(english ? 'Quick start' : '快速开始', `${prefix}/guide/getting-started`),
        item(english ? 'Installation' : '安装', `${prefix}/guide/installation`),
        item(english ? 'CLI' : '命令行', `${prefix}/guide/cli`),
        item(english ? 'Working with AI' : '配合 AI 写代码', `${prefix}/guide/working-with-ai`),
      ],
    },
    {
      text: english ? 'Use it' : '接入',
      items: [
        item(english ? 'Theme and styles' : '主题与样式', `${prefix}/guide/styling`),
        item(english ? 'Icons' : '图标', `${prefix}/guide/icons`),
        item(english ? 'Composables' : '组合式函数', `${prefix}/guide/composables`),
        item(english ? 'Patterns' : '应用模式', `${prefix}/guide/patterns`),
        item(english ? 'Templates' : '模板', `${prefix}/guide/templates`),
        item(english ? 'Links and routers' : '链接与路由', `${prefix}/guide/links`),
        item(english ? 'Page layout' : '页面布局', `${prefix}/guide/layout`),
        item(english ? 'Responsive layout' : '响应式布局', `${prefix}/guide/responsive`),
      ],
    },
    {
      text: english ? 'Behavior' : '行为',
      items: [
        item(english ? 'Accessibility' : '无障碍', `${prefix}/guide/accessibility`),
        item(english ? 'Dark mode' : '深色模式', `${prefix}/guide/dark-mode`),
        item(english ? 'Internationalization' : '国际化', `${prefix}/guide/i18n`),
        item(english ? 'Browser support' : '浏览器支持', `${prefix}/guide/browser-support`),
      ],
    },
    {
      text: english ? 'Project' : '项目',
      items: [
        item(english ? 'Changelog' : '更新日志', `${prefix}/guide/changelog`),
        item(english ? 'Upgrade guide' : '升级指南', `${prefix}/guide/migration`),
        item(english ? 'Contributing' : '贡献指南', `${prefix}/guide/contributing`),
      ],
    },
  ]
}

export function themeSidebar(english: boolean): Sidebar {
  const prefix = english ? '/en' : ''
  return [
    {
      text: english ? 'Choose' : '选用',
      items: [
        item(english ? 'Overview' : '概览', `${prefix}/themes/`),
        item('Neutral', `${prefix}/themes/neutral`),
        item('Butter', `${prefix}/themes/butter`),
        item('Chocolate', `${prefix}/themes/chocolate`),
        item('Gothic', `${prefix}/themes/gothic`),
        item('Matcha', `${prefix}/themes/matcha`),
        item('Stone', `${prefix}/themes/stone`),
        item('Y2K', `${prefix}/themes/y2k`),
        item(english ? 'Extend a theme' : '扩展主题', `${prefix}/themes/extending`),
      ],
    },
    {
      text: english ? 'Foundations' : '基础',
      items: [
        item(english ? 'Design tokens' : 'Design token', `${prefix}/themes/tokens`),
        item(english ? 'CSS variables' : 'CSS 变量', `${prefix}/themes/css-variables`),
        item(english ? 'Color' : '颜色', `${prefix}/themes/color`),
        item(english ? 'Typography' : '排版与字体', `${prefix}/themes/typography`),
        item(english ? 'Motion' : '动画', `${prefix}/themes/motion`),
        item(english ? 'Space, radius, shadow' : '间距、圆角与阴影', `${prefix}/themes/scale`),
      ],
    },
  ]
}
