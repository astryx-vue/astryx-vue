import type { DocsLocale } from './docs-i18n'

/**
 * Component groups, in display order.
 *
 * Names and order match the category list in upstream
 * `apps/docsite/src/app/(docs)/components/page.tsx` (`CATEGORIES`).
 * Each component declares one of these strings in `demos/<slug>/meta.ts`.
 * English sidebar and catalog titles are these strings. Chinese titles are
 * `GROUP_TITLES.zh`.
 */
export const COMPONENT_GROUPS = [
  'Action',
  'Chat',
  'Container',
  'Content',
  'Data Visualization',
  'Feedback & Status',
  'Form Controls',
  'Layout',
  'Navigation',
  'Overlay',
  'Table & List',
  'Utility',
] as const

export type ComponentGroup = (typeof COMPONENT_GROUPS)[number]

const ENGLISH_TITLES = Object.fromEntries(
  COMPONENT_GROUPS.map(group => [group, group]),
) as Record<ComponentGroup, string>

export const GROUP_TITLES: Record<DocsLocale, Record<ComponentGroup, string>> = {
  en: ENGLISH_TITLES,
  zh: {
    'Action': '操作',
    'Chat': '对话',
    'Container': '容器',
    'Content': '内容',
    'Data Visualization': '数据可视化',
    'Feedback & Status': '反馈与状态',
    'Form Controls': '表单控件',
    'Layout': '布局',
    'Navigation': '导航',
    'Overlay': '浮层',
    'Table & List': '表格与列表',
    'Utility': '工具',
  },
}
