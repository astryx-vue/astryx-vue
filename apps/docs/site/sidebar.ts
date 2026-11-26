interface Item { text: string, link?: string, items?: Item[] }

type Sidebar = Item[]

function item(text: string, link: string): Item {
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
    ...themeGuideSidebar(english),
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

/**
 * 主题相关的文档组。原版的「主题」导航只有画廊页，主题怎么用、各套主题和 Foundations
 * 都在文档侧栏里，所以这几组并进 guideSidebar；llms.txt 仍单独列成 Themes 一节。
 */
export function themeGuideSidebar(english: boolean): Sidebar {
  const prefix = english ? '/en' : ''
  return [
    {
      text: english ? 'Themes' : '主题',
      items: [
        item(english ? 'Theming' : '主题用法', `${prefix}/guide/theming`),
        item(english ? 'Extend a theme' : '扩展主题', `${prefix}/guide/extending-themes`),
        item('Neutral', `${prefix}/guide/themes/neutral`),
        item('Butter', `${prefix}/guide/themes/butter`),
        item('Chocolate', `${prefix}/guide/themes/chocolate`),
        item('Gothic', `${prefix}/guide/themes/gothic`),
        item('Matcha', `${prefix}/guide/themes/matcha`),
        item('Stone', `${prefix}/guide/themes/stone`),
        item('Y2K', `${prefix}/guide/themes/y2k`),
      ],
    },
    {
      text: english ? 'Foundations' : '基础',
      items: [
        item(english ? 'Design tokens' : 'Design token', `${prefix}/guide/tokens`),
        item(english ? 'CSS variables' : 'CSS 变量', `${prefix}/guide/css-variables`),
        item(english ? 'Color' : '颜色', `${prefix}/guide/color`),
        item(english ? 'Typography' : '排版与字体', `${prefix}/guide/typography`),
        item(english ? 'Motion' : '动画', `${prefix}/guide/motion`),
        item(english ? 'Space, radius, shadow' : '间距、圆角与阴影', `${prefix}/guide/scale`),
      ],
    },
  ]
}

export function labSidebar(english: boolean): Sidebar {
  const prefix = english ? '/en' : ''
  return [
    {
      text: english ? 'Canary components' : 'Canary 组件',
      items: [
        item(english ? 'Overview' : '概览', `${prefix}/lab/`),
        item('ListInput', `${prefix}/lab/list-input`),
        item('MobileTokenizer', `${prefix}/lab/mobile-tokenizer`),
        item('TransferList', `${prefix}/lab/transfer-list`),
        item('Tour', `${prefix}/lab/tour`),
        item('CodeEditor', `${prefix}/lab/code-editor`),
        item('CommentComposer', `${prefix}/lab/comment-composer`),
        item('CommentThread', `${prefix}/lab/comment-thread`),
        item('Comments', `${prefix}/lab/comments`),
        item('CommentPin', `${prefix}/lab/comment-pin`),
        item('CircularProgress', `${prefix}/lab/circular-progress`),
        item('CircleCheckIndicator', `${prefix}/lab/circle-check-indicator`),
        item('DialogHeroHeader', `${prefix}/lab/dialog-hero-header`),
        item('DiffViewer', `${prefix}/lab/diff-viewer`),
        item('InfoTip', `${prefix}/lab/info-tip`),
        item('LineClamp', `${prefix}/lab/line-clamp`),
        item('LogStream', `${prefix}/lab/log-stream`),
        item('Stat', `${prefix}/lab/stat`),
        item('SVGIcon', `${prefix}/lab/svg-icon`),
        item('EmojiPicker', `${prefix}/lab/emoji-picker`),
        item('ChatEmojiPicker', `${prefix}/lab/chat-emoji-picker`),
        item('ChatReactionBar', `${prefix}/lab/chat-reaction-bar`),
        item('Schedule', `${prefix}/lab/schedule`),
      ],
    },
  ]
}
