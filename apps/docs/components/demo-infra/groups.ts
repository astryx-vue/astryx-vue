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
