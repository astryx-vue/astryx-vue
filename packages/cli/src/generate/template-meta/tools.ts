import type { TemplateMeta } from './types.ts'

/** Tool pages: editors, file explorer, IDE, and kanban board. */
export const TOOL_TEMPLATES: Record<string, TemplateMeta> = {
  'canvas-editor': {
    description: {
      en: 'A canvas editor with a toolbar, a layers tree, and a resizable artboard.',
      zh: '画布编辑器：工具栏、图层树和可调整大小的画板。',
    },
    keywords: {
      en: ['editor', 'canvas', 'design', 'toolbar', 'layers', 'artboard', 'draw'],
      zh: ['编辑器', '画布', '设计', '工具栏', '图层', '画板'],
    },
  },
  'file-explorer': {
    description: {
      en: 'A file explorer with a toolbar, a folder tree, and a file list.',
      zh: '文件浏览器：工具栏、文件夹树和文件列表。',
    },
    keywords: {
      en: ['file explorer', 'files', 'folders', 'directory', 'tree', 'browser', 'storage'],
      zh: ['文件浏览器', '文件', '文件夹', '目录', '树形', '浏览'],
    },
  },
  'ide': {
    description: {
      en: 'An IDE layout with a file tree, a single read-only code pane, a terminal drawer, and an inspector panel.',
      zh: 'IDE 布局：文件树、一块只读代码区、终端抽屉和检查器面板。',
    },
    keywords: {
      en: ['ide', 'code editor', 'developer', 'code', 'tabs', 'inspector', 'workspace'],
      zh: ['IDE', '代码编辑器', '开发者', '代码', '标签页', '检查器'],
    },
  },
  'kanban-board': {
    description: {
      en: 'A kanban board with columns of cards, per-column counts, and drag handles.',
      zh: '看板：多列卡片、每列计数和拖拽把手。',
    },
    keywords: {
      en: ['kanban', 'board', 'cards', 'columns', 'tasks', 'project', 'drag', 'sprint'],
      zh: ['任务看板', '看板', '卡片', '列', '任务', '项目', '拖拽', '迭代'],
    },
  },
  'editor': {
    description: {
      en: 'A page builder with a side panel of Blocks and Properties tabs beside a live canvas: add blocks, edit the selected one, and reorder with move up and move down.',
      zh: '页面搭建器：侧栏的「区块」和「属性」标签页加实时画布，添加区块、编辑选中项，用上移下移调整顺序。',
    },
    keywords: {
      en: ['editor', 'builder', 'page builder', 'blocks', 'properties', 'canvas', 'wysiwyg'],
      zh: ['编辑器', '页面搭建', '区块', '属性', '画布', '所见即所得'],
    },
  },

  'incident-console': {
    description: {
      en: 'An incident queue grouped by status, with a search bar, a status control, and a resizable detail inspector that opens as a bottom sheet on a phone.',
      zh: '事件控制台：按状态分组的队列、搜索栏、状态切换和可调整大小的详情面板，手机上详情以底部抽屉打开。',
    },
    keywords: {
      en: ['incident', 'alert', 'on-call', 'outage', 'ticket', 'triage console'],
      zh: ['事件', '告警', '值班', '故障', '工单', '控制台'],
    },
  },
}
