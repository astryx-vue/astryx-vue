import type { AstryxLocale } from '../types.js'

/** 富文本编辑器和它的工具栏。文案由 `@astryx-vue/richtext` 取，core 只负责保存。 */
export interface RichTextEditorMessages {
  /** 屏幕阅读器专用的提示：Tab 在编辑器里用来缩进，所以要先按 Escape 再按 Tab 才能离开。 */
  tabEscapeHint: string
  toolbar: {
    label: string
    actions: string
    undo: string
    redo: string
    historyDivider: string
    blockFormat: string
    formatDivider: string
    paragraph: string
    heading1: string
    heading2: string
    heading3: string
    bulletedList: string
    numberedList: string
    blockQuote: string
    bold: string
    italic: string
    underline: string
    strikethrough: string
    inlineCode: string
    link: string
  }
  link: {
    insertTitle: string
    editTitle: string
    url: string
    invalidUrl: string
    remove: string
    cancel: string
    add: string
    update: string
  }
}

export const richTextEditorMessages: Record<AstryxLocale, RichTextEditorMessages> = {
  'en': {
    tabEscapeHint: 'Press Escape then Tab to move focus out of the editor.',
    toolbar: {
      label: 'Text formatting',
      actions: 'Formatting actions',
      undo: 'Undo',
      redo: 'Redo',
      historyDivider: 'History and block formats',
      blockFormat: 'Block format',
      formatDivider: 'Block and inline formats',
      paragraph: 'Paragraph',
      heading1: 'Heading 1',
      heading2: 'Heading 2',
      heading3: 'Heading 3',
      bulletedList: 'Bulleted list',
      numberedList: 'Numbered list',
      blockQuote: 'Block quote',
      bold: 'Bold',
      italic: 'Italic',
      underline: 'Underline',
      strikethrough: 'Strikethrough',
      inlineCode: 'Inline code',
      link: 'Link',
    },
    link: {
      insertTitle: 'Insert link',
      editTitle: 'Edit link',
      url: 'URL',
      invalidUrl: 'Enter a valid http, https, mailto, or tel URL.',
      remove: 'Remove link',
      cancel: 'Cancel',
      add: 'Add link',
      update: 'Update link',
    },
  },
  'zh-CN': {
    tabEscapeHint: '按 Esc 再按 Tab，可以把焦点移出编辑器。',
    toolbar: {
      label: '文字格式',
      actions: '格式操作',
      undo: '撤销',
      redo: '重做',
      historyDivider: '历史记录与块格式',
      blockFormat: '块格式',
      formatDivider: '块格式与行内格式',
      paragraph: '正文',
      heading1: '一级标题',
      heading2: '二级标题',
      heading3: '三级标题',
      bulletedList: '无序列表',
      numberedList: '有序列表',
      blockQuote: '引用',
      bold: '加粗',
      italic: '斜体',
      underline: '下划线',
      strikethrough: '删除线',
      inlineCode: '行内代码',
      link: '链接',
    },
    link: {
      insertTitle: '插入链接',
      editTitle: '编辑链接',
      url: '网址',
      invalidUrl: '请输入有效的 http、https、mailto 或 tel 网址。',
      remove: '移除链接',
      cancel: '取消',
      add: '添加链接',
      update: '更新链接',
    },
  },
}
