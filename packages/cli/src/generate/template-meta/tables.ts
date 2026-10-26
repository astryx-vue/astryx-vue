import type { TemplateMeta } from './types.ts'

/** Table pages. */
export const TABLE_TEMPLATES: Record<string, TemplateMeta> = {
  'table': {
    description: {
      en: 'A plain table of rows with a status badge, an updated date, and a per-row action.',
      zh: '基础表格：状态徽章、更新时间和行操作。',
    },
    keywords: {
      en: ['table', 'list', 'rows', 'records', 'grid', 'spreadsheet', 'roster'],
      zh: ['表格', '列表', '行', '记录', '表格页'],
    },
  },
  'table-collapsible': {
    description: {
      en: 'A table whose row groups fold open and closed.',
      zh: '表格：行分组可以展开和折叠。',
    },
    keywords: {
      en: ['table', 'collapsible', 'expandable', 'rows', 'groups', 'data', 'accordion'],
      zh: ['表格', '折叠', '展开', '行', '分组', '数据'],
    },
  },
  'table-comparison': {
    description: {
      en: 'A comparison table with plan columns, switches, and per-row pricing.',
      zh: '对比表格：套餐列、开关和逐行价格。',
    },
    keywords: {
      en: ['table', 'comparison', 'compare', 'plans', 'pricing', 'features', 'matrix'],
      zh: ['表格', '对比', '比较', '套餐', '定价', '功能'],
    },
  },
  'table-filter': {
    description: {
      en: 'A filterable table with a filter bar, a selected row, and a detail panel.',
      zh: '可筛选表格：筛选栏、选中行和详情面板。',
    },
    keywords: {
      en: ['table', 'filter', 'filters', 'search', 'detail panel', 'list', 'records'],
      zh: ['表格', '筛选', '过滤', '搜索', '详情面板', '列表'],
    },
  },
  'table-grouped': {
    description: {
      en: 'A grouped table with a sort control and a group picker.',
      zh: '分组表格：排序控件和分组选择器。',
    },
    keywords: {
      en: ['table', 'grouped', 'group by', 'sort', 'rows', 'data'],
      zh: ['表格', '分组', '排序', '行', '数据'],
    },
  },
  'table-inbox': {
    description: {
      en: 'An inbox table with tabs and a reading pane for the selected message.',
      zh: '收件箱表格：标签页，选中一行在侧边阅读。',
    },
    keywords: {
      en: ['inbox', 'table', 'email', 'mail', 'messages', 'list', 'reading pane'],
      zh: ['收件箱', '表格', '邮件', '消息', '列表', '阅读面板'],
    },
  },
  'table-page': {
    description: {
      en: 'A data table page with search, an empty state, and pagination.',
      zh: '数据表格页：搜索、空状态和分页。',
    },
    keywords: {
      en: ['table', 'data table', 'list', 'search', 'pagination', 'records', 'crud', 'admin'],
      zh: ['表格', '数据表', '列表', '搜索', '分页', '记录', '后台'],
    },
  },
  'table-tree': {
    description: {
      en: 'A tree table with breadcrumbs, nested rows, and a detail panel.',
      zh: '树形表格：面包屑、嵌套行和详情面板。',
    },
    keywords: {
      en: ['table', 'tree', 'tree table', 'nested', 'hierarchy', 'folders', 'groups'],
      zh: ['表格', '树形', '树表', '嵌套', '层级', '文件夹'],
    },
  },
}
