import type { DocsLocale } from './docs-i18n'

export type ComponentGroup
  = | 'action'
    | 'content'
    | 'feedback'
    | 'form'
    | 'layout'
    | 'navigation'
    | 'overlays'
    | 'utilities'

/**
 * The order groups appear in, both in the component sidebar and on the catalog
 * page.
 */
export const COMPONENT_GROUPS: readonly ComponentGroup[] = [
  'action',
  'form',
  'layout',
  'content',
  'navigation',
  'feedback',
  'overlays',
  'utilities',
]

export const GROUP_TITLES: Record<DocsLocale, Record<ComponentGroup, string>> = {
  en: {
    action: 'Action',
    form: 'Form controls',
    layout: 'Layout',
    content: 'Content',
    navigation: 'Component navigation',
    feedback: 'Feedback & Status',
    overlays: 'Overlays',
    utilities: 'Utilities',
  },
  zh: {
    action: '操作',
    form: '表单',
    layout: '布局',
    content: '内容',
    navigation: '组件导航',
    feedback: '反馈与状态',
    overlays: '浮层',
    utilities: '工具',
  },
}

export interface CatalogEntry {
  /** The URL segment, and the folder name under `docs/<locale>/components`. */
  slug: string
  /** The group the component is listed under. */
  group: ComponentGroup
  en: string
  zh: string
}

/**
 * Every documented component. This is the single source of truth for the
 * sidebar, the catalog page, and the route parser, so a new component only has
 * to be added here once.
 */
export const COMPONENT_CATALOG = [
  { slug: 'button', group: 'action', en: 'Button', zh: '按钮' },
  { slug: 'button-group', group: 'action', en: 'Button Group', zh: '按钮组' },
  { slug: 'icon-button', group: 'action', en: 'Icon Button', zh: '纯图标按钮' },
  { slug: 'dropdown-menu', group: 'action', en: 'Dropdown Menu', zh: '下拉菜单' },
  { slug: 'context-menu', group: 'action', en: 'Context Menu', zh: '上下文菜单' },
  { slug: 'more-menu', group: 'action', en: 'More Menu', zh: '更多菜单' },
  { slug: 'toggle-button', group: 'action', en: 'Toggle Button', zh: '切换按钮' },

  { slug: 'text-input', group: 'form', en: 'Text Input', zh: '文本输入框' },
  { slug: 'text-area', group: 'form', en: 'Text Area', zh: '文本域' },
  { slug: 'checkbox-input', group: 'form', en: 'Checkbox Input', zh: '复选框' },
  { slug: 'checkbox-indicator', group: 'form', en: 'Checkbox Indicator', zh: '复选指示器' },
  { slug: 'progress-bar', group: 'form', en: 'Progress Bar', zh: '进度条' },
  { slug: 'radio', group: 'form', en: 'Radio', zh: '单选按钮' },
  { slug: 'radio-group', group: 'form', en: 'Radio Group', zh: '单选组' },
  { slug: 'radio-list', group: 'form', en: 'Radio List', zh: '单选列表' },
  { slug: 'switch', group: 'form', en: 'Switch', zh: '开关' },
  { slug: 'slider', group: 'form', en: 'Slider', zh: '滑块' },
  { slug: 'field', group: 'form', en: 'Field', zh: '表单字段' },
  { slug: 'number-input', group: 'form', en: 'Number Input', zh: '数字输入框' },
  { slug: 'input-group', group: 'form', en: 'Input Group', zh: '输入框组' },
  { slug: 'selector', group: 'form', en: 'Selector', zh: '选择器' },
  { slug: 'date-input', group: 'form', en: 'Date Input', zh: '日期输入框' },
  { slug: 'calendar', group: 'form', en: 'Calendar', zh: '日历' },
  { slug: 'segmented-control', group: 'form', en: 'Segmented Control', zh: '分段控件' },

  { slug: 'stack', group: 'layout', en: 'Stack', zh: '堆叠布局' },
  { slug: 'divider', group: 'layout', en: 'Divider', zh: '分隔线' },
  { slug: 'center', group: 'layout', en: 'Center', zh: '居中容器' },
  { slug: 'grid', group: 'layout', en: 'Grid', zh: '网格布局' },
  { slug: 'card', group: 'layout', en: 'Card', zh: '卡片' },
  { slug: 'overlay', group: 'layout', en: 'Overlay', zh: '覆盖层' },

  { slug: 'avatar', group: 'content', en: 'Avatar', zh: '头像' },
  { slug: 'avatar-group', group: 'content', en: 'Avatar Group', zh: '头像组' },
  { slug: 'blockquote', group: 'content', en: 'Blockquote', zh: '引用' },
  { slug: 'heading', group: 'content', en: 'Heading', zh: '标题' },
  { slug: 'text', group: 'content', en: 'Text', zh: '文本' },
  { slug: 'kbd', group: 'content', en: 'Kbd', zh: '快捷键' },
  { slug: 'list', group: 'content', en: 'List', zh: '列表' },
  { slug: 'code', group: 'content', en: 'Code', zh: '代码' },
  { slug: 'collapsible', group: 'content', en: 'Collapsible', zh: '折叠面板' },

  { slug: 'link', group: 'navigation', en: 'Link', zh: '链接' },
  { slug: 'breadcrumbs', group: 'navigation', en: 'Breadcrumbs', zh: '面包屑' },
  { slug: 'tab-list', group: 'navigation', en: 'Tab List', zh: '标签列表' },
  { slug: 'pagination', group: 'navigation', en: 'Pagination', zh: '分页' },

  { slug: 'banner', group: 'feedback', en: 'Banner', zh: '提示条' },
  { slug: 'badge', group: 'feedback', en: 'Badge', zh: '标签' },
  { slug: 'skeleton', group: 'feedback', en: 'Skeleton', zh: '骨架屏' },
  { slug: 'spinner', group: 'feedback', en: 'Spinner', zh: '加载态' },
  { slug: 'status-dot', group: 'feedback', en: 'Status Dot', zh: '状态点' },
  { slug: 'empty-state', group: 'feedback', en: 'Empty State', zh: '空状态' },

  { slug: 'tooltip', group: 'overlays', en: 'Tooltip', zh: '提示框' },
  { slug: 'popover', group: 'overlays', en: 'Popover', zh: '弹出层' },
  { slug: 'dialog', group: 'overlays', en: 'Dialog', zh: '对话框' },
  { slug: 'toast', group: 'overlays', en: 'Toast', zh: '轻提示' },
  { slug: 'hover-card', group: 'overlays', en: 'Hover Card', zh: '悬浮卡片' },
  { slug: 'alert-dialog', group: 'overlays', en: 'Alert Dialog', zh: '警告对话框' },
  { slug: 'bottom-sheet', group: 'overlays', en: 'Bottom Sheet', zh: '底部弹窗' },

  { slug: 'visually-hidden', group: 'utilities', en: 'Visually Hidden', zh: '视觉隐藏' },
] as const satisfies readonly CatalogEntry[]

export type ComponentSlug = (typeof COMPONENT_CATALOG)[number]['slug']

/** A catalog entry with its `slug` narrowed to a known slug. */
export type ComponentCatalogEntry = (typeof COMPONENT_CATALOG)[number]

export const COMPONENT_SLUGS: readonly ComponentSlug[] = COMPONENT_CATALOG.map(entry => entry.slug)

export function isComponentSlug(value: string): value is ComponentSlug {
  return (COMPONENT_SLUGS as readonly string[]).includes(value)
}

export function componentName(locale: DocsLocale, slug: ComponentSlug): string {
  const entry = COMPONENT_CATALOG.find(item => item.slug === slug)
  return entry === undefined ? slug : entry[locale]
}

export interface CatalogGroup {
  title: string
  entries: readonly ComponentCatalogEntry[]
}

/**
 * The catalog split into the groups it displays, in display order. Empty groups
 * are dropped.
 */
export function catalogGroups(locale: DocsLocale): CatalogGroup[] {
  return COMPONENT_GROUPS
    .map(group => ({
      title: GROUP_TITLES[locale][group],
      entries: COMPONENT_CATALOG.filter(entry => entry.group === group),
    }))
    .filter(group => group.entries.length > 0)
}
