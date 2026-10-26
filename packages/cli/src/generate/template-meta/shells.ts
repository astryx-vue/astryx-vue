import type { TemplateMeta } from './types.ts'

/** App shell pages: a blank start and the navigation layouts. */
export const SHELL_TEMPLATES: Record<string, TemplateMeta> = {
  'blank': {
    description: {
      en: 'An empty page with a shell and a single line of text, for starting from nothing.',
      zh: '空白页：只有框架和一行字，从零开始用。',
    },
    keywords: {
      en: ['blank', 'empty', 'starter', 'scaffold', 'bare', 'minimal'],
      zh: ['空白', '空页', '起点', '脚手架', '极简'],
    },
  },
  'shell-nav': {
    description: {
      en: 'An app shell with a top nav, a side nav tree, and a command palette.',
      zh: '应用框架：顶部导航、侧边导航树和命令面板。',
    },
    keywords: {
      en: ['shell', 'app shell', 'navigation', 'nav', 'sidebar', 'topbar', 'layout', 'app'],
      zh: ['框架', '应用框架', '导航', '侧边栏', '顶栏', '布局'],
    },
  },
  'shell-side-nav': {
    description: {
      en: 'An app shell whose navigation is a side tree with sections and icons.',
      zh: '应用框架：导航放在左侧，带分组和图标。',
    },
    keywords: {
      en: ['shell', 'side nav', 'sidebar', 'navigation', 'layout', 'app', 'tree'],
      zh: ['框架', '侧边导航', '侧边栏', '导航', '布局'],
    },
  },
  'shell-top-nav': {
    description: {
      en: 'An app shell with a top nav and drop-down mega menus.',
      zh: '应用框架：顶部导航加下拉大菜单。',
    },
    keywords: {
      en: ['shell', 'top nav', 'navbar', 'menu', 'mega menu', 'layout', 'app'],
      zh: ['框架', '顶部导航', '导航栏', '菜单', '布局'],
    },
  },

  'messaging-shell': {
    description: {
      en: 'A four-column messaging frame: workspace rail, channel list, message stream, and a thread panel.',
      zh: '消息框架：工作区导航、频道列表、消息流和会话线程四栏。',
    },
    keywords: {
      en: ['team messaging', 'chat', 'channels', 'threads', 'inbox', 'direct message', 'conversation workspace'],
      zh: ['消息', '聊天', '频道', '会话', '私信', '团队沟通'],
    },
    upstreamNotReady: true,
  },
}
