import type { DocsLocale } from './docs-i18n'

/**
 * Sidebar families: a parent component with its sub-components and hooks
 * nested under it. Names match the docs sidebar of the original library.
 * A component joins a family through `family` in its `demos/<slug>/meta.ts`;
 * a component without `family` is a plain link.
 */
export const COMPONENT_FAMILIES = {
  'App Shell': { en: 'App Shell', zh: '应用外壳' },
  'Avatar': { en: 'Avatar', zh: '头像' },
  'Bottom Sheet': { en: 'Bottom Sheet', zh: '底部弹窗' },
  'Breadcrumbs': { en: 'Breadcrumbs', zh: '面包屑' },
  'Button': { en: 'Button', zh: '按钮' },
  'Card': { en: 'Card', zh: '卡片' },
  'Chat': { en: 'Chat', zh: '对话' },
  'Checkbox': { en: 'Checkbox', zh: '复选框' },
  'Collapsible': { en: 'Collapsible', zh: '折叠面板' },
  'Command Palette': { en: 'Command Palette', zh: '命令面板' },
  'Context Menu': { en: 'Context Menu', zh: '上下文菜单' },
  'Date Input': { en: 'Date Input', zh: '日期输入框' },
  'Dialog': { en: 'Dialog', zh: '对话框' },
  'Dropdown Menu': { en: 'Dropdown Menu', zh: '下拉菜单' },
  'Field': { en: 'Field', zh: '表单字段' },
  'Hover Card': { en: 'Hover Card', zh: '悬浮卡片' },
  'Indicator': { en: 'Indicator', zh: '指示器' },
  'Layout': { en: 'Layout', zh: '布局' },
  'List': { en: 'List', zh: '列表' },
  'Metadata List': { en: 'Metadata List', zh: '元数据列表' },
  'Navigation': { en: 'Navigation', zh: '导航' },
  'Popover': { en: 'Popover', zh: '弹出层' },
  'Radio': { en: 'Radio', zh: '单选' },
  'Resizable': { en: 'Resizable', zh: '可调整大小' },
  'Segmented Control': { en: 'Segmented Control', zh: '分段控件' },
  'Selector': { en: 'Selector', zh: '选择器' },
  'Stepper': { en: 'Stepper', zh: '步骤条' },
  'Table': { en: 'Table', zh: '表格' },
  'Tabs': { en: 'Tabs', zh: '标签页' },
  'Toast': { en: 'Toast', zh: '轻提示' },
  'Tooltip': { en: 'Tooltip', zh: '提示框' },
  'Typeahead': { en: 'Typeahead', zh: '自动补全' },
  'Utilities': { en: 'Utilities', zh: '工具' },
} as const satisfies Record<string, Record<DocsLocale, string>>

export type ComponentFamily = keyof typeof COMPONENT_FAMILIES

/** Pinned after every other sidebar entry. */
export const LAST_FAMILY: ComponentFamily = 'Utilities'
