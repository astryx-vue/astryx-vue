import type { PlaygroundLocale } from './protocol'

export interface PlaygroundCopy {
  title: string
  code: string
  theme: string
  templates: string
  neutral: string
  reload: string
  fullscreen: string
  exitFullscreen: string
  share: string
  exportTheme: string
  edit: string
  preview: string
  loading: string
  resize: string
  colors: string
  colorHint: string
  density: string
  fonts: string
  headingFont: string
  bodyFont: string
  customFont: string
  typeScale: string
  typeSize: string
  radius: string
  spacing: string
  elementSize: string
  duration: string
  darkMode: string
  loadTemplateTitle: string
  loadTemplateBody: string
  resetThemeTitle: string
  resetThemeBody: string
  cancel: string
  continue: string
  shareTitle: string
  copyUrl: string
  copied: string
  copyFailed: string
  close: string
  exportTitle: string
  downloadCss: string
  downloadJson: string
  note: string
  groups: Record<string, string>
  templateNames: Record<string, string>
}

const zh: PlaygroundCopy = {
  title: '演练场',
  code: '代码',
  theme: '主题',
  templates: '模板',
  neutral: 'Neutral',
  reload: '刷新预览',
  fullscreen: '全屏预览',
  exitFullscreen: '退出全屏',
  share: '分享',
  exportTheme: '导出',
  edit: '编辑',
  preview: '预览',
  loading: '正在准备预览',
  resize: '调整编辑器宽度',
  colors: '颜色',
  colorHint: '颜色改的是当前这一档。打开深色模式会换成另一档。',
  density: '密度',
  fonts: '字体',
  headingFont: '标题字体',
  bodyFont: '正文字体',
  customFont: '自定义字体',
  typeScale: '字号比例',
  typeSize: '字号',
  radius: '圆角',
  spacing: '间距',
  elementSize: '控件高度',
  duration: '时长',
  darkMode: '深色模式',
  loadTemplateTitle: '载入模板',
  loadTemplateBody: '载入这个模板会换掉代码编辑器里的内容。你改过的代码不会保留。',
  resetThemeTitle: '恢复 Neutral',
  resetThemeBody: '这会覆盖当前主题。主题编辑器里的修改不会保留。',
  cancel: '取消',
  continue: '继续',
  shareTitle: '分享',
  copyUrl: '复制链接',
  copied: '已复制',
  copyFailed: '请从输入框复制',
  close: '关闭',
  exportTitle: '导出主题',
  downloadCss: '下载 CSS',
  downloadJson: '下载 JSON',
  note: '预览在独立页面里重挂载。刷新预览会清掉当时的界面状态，编辑器里的代码和主题会保留。',
  groups: {
    chat: '对话',
    form: '表单',
    table: '表格',
    shell: '框架',
  },
  templateNames: {
    'chat': 'AI 对话',
    'form': '联系表单',
    'inbox': '收件箱',
    'side-nav': '侧边导航',
    'top-nav': '顶部导航',
  },
}

const en: PlaygroundCopy = {
  title: 'Playground',
  code: 'Code',
  theme: 'Theme',
  templates: 'Templates',
  neutral: 'Neutral',
  reload: 'Reload preview',
  fullscreen: 'Fullscreen preview',
  exitFullscreen: 'Exit fullscreen',
  share: 'Share',
  exportTheme: 'Export',
  edit: 'Edit',
  preview: 'Preview',
  loading: 'Preparing preview',
  resize: 'Resize editor',
  colors: 'Colors',
  colorHint: 'These colors edit the current mode. Dark mode switches to the other set.',
  density: 'Density',
  fonts: 'Fonts',
  headingFont: 'Heading font',
  bodyFont: 'Body font',
  customFont: 'Custom font',
  typeScale: 'Type scale',
  typeSize: 'Type size',
  radius: 'Corner radius',
  spacing: 'Spacing',
  elementSize: 'Element size',
  duration: 'Duration',
  darkMode: 'Dark mode',
  loadTemplateTitle: 'Load template',
  loadTemplateBody: 'Loading this template replaces the code in the editor. Changes you made there will be lost.',
  resetThemeTitle: 'Reset to Neutral',
  resetThemeBody: 'This overwrites the current theme. Changes in the theme editor will be lost.',
  cancel: 'Cancel',
  continue: 'Continue',
  shareTitle: 'Share',
  copyUrl: 'Copy URL',
  copied: 'Copied',
  copyFailed: 'Copy the URL from the field',
  close: 'Close',
  exportTitle: 'Export theme',
  downloadCss: 'Download CSS',
  downloadJson: 'Download JSON',
  note: 'The preview remounts in its own page. Reloading the preview clears that runtime state and keeps the editor code and theme.',
  groups: {
    chat: 'Chat',
    form: 'Form',
    table: 'Table',
    shell: 'Shell',
  },
  templateNames: {
    'chat': 'AI Chat',
    'form': 'Contact form',
    'inbox': 'Inbox',
    'side-nav': 'Side nav',
    'top-nav': 'Top nav',
  },
}

export function playgroundCopy(locale: PlaygroundLocale): PlaygroundCopy {
  return locale === 'zh' ? zh : en
}
