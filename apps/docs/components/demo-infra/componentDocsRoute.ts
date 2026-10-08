import type { DocsLocale } from './docs-i18n'

export const COMPONENT_SLUGS = [
  'button',
  'button-group',
  'icon-button',
  'text-input',
  'text-area',
  'checkbox-input',
  'checkbox-indicator',
  'progress-bar',
  'radio',
  'radio-group',
  'radio-list',
  'switch',
  'field',
  'slider',
  'banner',
  'stack',
  'divider',
  'blockquote',
  'badge',
  'skeleton',
  'spinner',
  'tooltip',
  'popover',
  'visually-hidden',
] as const

export type ComponentSlug = (typeof COMPONENT_SLUGS)[number]

export type ComponentDocsRoute
  = | {
    kind: 'catalog'
    locale: DocsLocale
  }
  | {
    kind: 'detail'
    locale: DocsLocale
    name: string
    slug: ComponentSlug
    tab: 'overview' | 'props'
  }

export const componentDocsCopy = {
  en: {
    action: 'Action',
    badge: 'Badge',
    blockquote: 'Blockquote',
    button: 'Button',
    divider: 'Divider',
    buttonGroup: 'Button Group',
    catalogTitle: 'Components',
    content: 'Content',
    documentation: 'documentation',
    feedback: 'Feedback & Status',
    form: 'Form controls',
    textArea: 'Text Area',
    textInput: 'Text Input',
    checkboxInput: 'Checkbox Input',
    checkboxIndicator: 'Checkbox Indicator',
    progressBar: 'Progress Bar',
    radio: 'Radio',
    radioGroup: 'Radio Group',
    radioList: 'Radio List',
    switch: 'Switch',
    field: 'Field',
    slider: 'Slider',
    banner: 'Banner',
    iconButton: 'Icon Button',
    layout: 'Layout',
    navigation: 'Component navigation',
    overview: 'Overview',
    props: 'Props',
    skeleton: 'Skeleton',
    spinner: 'Spinner',
    stack: 'Stack',
    overlays: 'Overlays',
    popover: 'Popover',
    tooltip: 'Tooltip',
    utilities: 'Utilities',
    visuallyHidden: 'Visually Hidden',
  },
  zh: {
    action: '操作',
    badge: '标签',
    blockquote: '引用',
    button: '按钮',
    divider: '分隔线',
    buttonGroup: '按钮组',
    catalogTitle: '组件',
    content: '内容',
    documentation: '文档',
    feedback: '反馈与状态',
    form: '表单',
    textArea: '文本域',
    textInput: '文本输入框',
    checkboxInput: '复选框',
    checkboxIndicator: '复选指示器',
    progressBar: '进度条',
    radio: '单选按钮',
    radioGroup: '单选组',
    radioList: '单选列表',
    switch: '开关',
    field: '表单字段',
    slider: '滑块',
    banner: '提示条',
    iconButton: '纯图标按钮',
    layout: '布局',
    navigation: '组件导航',
    overview: '总览',
    props: '属性',
    skeleton: '骨架屏',
    spinner: '旋转器',
    stack: '堆叠布局',
    overlays: '浮层',
    popover: '弹出层',
    tooltip: '提示框',
    utilities: '工具',
    visuallyHidden: '视觉隐藏',
  },
} as const

const componentNames: Record<DocsLocale, Record<ComponentSlug, string>> = {
  en: {
    'badge': componentDocsCopy.en.badge,
    'blockquote': componentDocsCopy.en.blockquote,
    'button': componentDocsCopy.en.button,
    'button-group': componentDocsCopy.en.buttonGroup,
    'icon-button': componentDocsCopy.en.iconButton,
    'text-input': componentDocsCopy.en.textInput,
    'text-area': componentDocsCopy.en.textArea,
    'checkbox-input': componentDocsCopy.en.checkboxInput,
    'checkbox-indicator': componentDocsCopy.en.checkboxIndicator,
    'progress-bar': componentDocsCopy.en.progressBar,
    'radio': componentDocsCopy.en.radio,
    'radio-group': componentDocsCopy.en.radioGroup,
    'radio-list': componentDocsCopy.en.radioList,
    'switch': componentDocsCopy.en.switch,
    'field': componentDocsCopy.en.field,
    'slider': componentDocsCopy.en.slider,
    'banner': componentDocsCopy.en.banner,
    'divider': componentDocsCopy.en.divider,
    'skeleton': componentDocsCopy.en.skeleton,
    'spinner': componentDocsCopy.en.spinner,
    'stack': componentDocsCopy.en.stack,
    'popover': componentDocsCopy.en.popover,
    'tooltip': componentDocsCopy.en.tooltip,
    'visually-hidden': componentDocsCopy.en.visuallyHidden,
  },
  zh: {
    'badge': componentDocsCopy.zh.badge,
    'blockquote': componentDocsCopy.zh.blockquote,
    'button': componentDocsCopy.zh.button,
    'button-group': componentDocsCopy.zh.buttonGroup,
    'icon-button': componentDocsCopy.zh.iconButton,
    'text-input': componentDocsCopy.zh.textInput,
    'text-area': componentDocsCopy.zh.textArea,
    'checkbox-input': componentDocsCopy.zh.checkboxInput,
    'checkbox-indicator': componentDocsCopy.zh.checkboxIndicator,
    'progress-bar': componentDocsCopy.zh.progressBar,
    'radio': componentDocsCopy.zh.radio,
    'radio-group': componentDocsCopy.zh.radioGroup,
    'radio-list': componentDocsCopy.zh.radioList,
    'switch': componentDocsCopy.zh.switch,
    'field': componentDocsCopy.zh.field,
    'slider': componentDocsCopy.zh.slider,
    'banner': componentDocsCopy.zh.banner,
    'divider': componentDocsCopy.zh.divider,
    'skeleton': componentDocsCopy.zh.skeleton,
    'spinner': componentDocsCopy.zh.spinner,
    'stack': componentDocsCopy.zh.stack,
    'popover': componentDocsCopy.zh.popover,
    'tooltip': componentDocsCopy.zh.tooltip,
    'visually-hidden': componentDocsCopy.zh.visuallyHidden,
  },
}

function isComponentSlug(value: string): value is ComponentSlug {
  return (COMPONENT_SLUGS as readonly string[]).includes(value)
}

function normalizeDocsPathname(pathname: string): string {
  const withoutHtml = pathname.replace(/\.html$/i, '')
  const withoutIndex = withoutHtml.replace(/\/index$/i, '')
  return withoutIndex.replace(/\/+$/, '') || '/'
}

export function parseComponentDocsRoute(pathname: string): ComponentDocsRoute | null {
  const trimmed = normalizeDocsPathname(pathname)

  let locale: DocsLocale = 'zh'
  let path = trimmed
  if (path === '/en' || path.startsWith('/en/')) {
    locale = 'en'
    path = path.slice('/en'.length) || '/'
  }

  if (path === '/components') {
    return { kind: 'catalog', locale }
  }

  const segments = path.split('/').filter(Boolean)
  if (segments[0] !== 'components' || segments.length < 2 || segments.length > 3) {
    return null
  }

  const slug = segments[1]
  if (!isComponentSlug(slug)) {
    return null
  }

  if (segments.length === 3 && segments[2] !== 'props') {
    return null
  }

  return {
    kind: 'detail',
    locale,
    name: componentNames[locale][slug],
    slug,
    tab: segments.length === 3 ? 'props' : 'overview',
  }
}
