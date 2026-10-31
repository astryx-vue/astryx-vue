import type { TranslatorValues } from '@astryx-vue/core'
import { useLocale, useTranslator } from '@astryx-vue/core'

/**
 * 编辑器和工具栏里的文案。
 *
 * 原版把这些文案放在 core 的 `locales/*.json` 里，用 `@astryx.richTextEditor.*` 取。
 * 我们 core 的文案目录还没收录这一组键（在 `upstreamMap` 里没有对应项），所以这里
 * 先自带中英文兜底：core 认得出这个键就用 core 的译文，认不出就用兜底。
 * 以后 core 把键补上，兜底自动失效，不用改这里。
 */
const FALLBACKS = {
  'tabEscapeHint': {
    'en': 'Press Escape then Tab to move focus out of the editor.',
    'zh-CN': '按 Esc 再按 Tab，可以把焦点移出编辑器。',
  },
  'toolbar.label': {
    'en': 'Text formatting',
    'zh-CN': '文字格式',
  },
  'toolbar.actions': {
    'en': 'Formatting actions',
    'zh-CN': '格式操作',
  },
  'toolbar.undo': {
    'en': 'Undo',
    'zh-CN': '撤销',
  },
  'toolbar.redo': {
    'en': 'Redo',
    'zh-CN': '重做',
  },
  'toolbar.historyDivider': {
    'en': 'History and block formats',
    'zh-CN': '历史记录与块格式',
  },
  'toolbar.blockFormat': {
    'en': 'Block format',
    'zh-CN': '块格式',
  },
  'toolbar.formatDivider': {
    'en': 'Block and inline formats',
    'zh-CN': '块格式与行内格式',
  },
  'toolbar.paragraph': {
    'en': 'Paragraph',
    'zh-CN': '正文',
  },
  'toolbar.heading1': {
    'en': 'Heading 1',
    'zh-CN': '一级标题',
  },
  'toolbar.heading2': {
    'en': 'Heading 2',
    'zh-CN': '二级标题',
  },
  'toolbar.heading3': {
    'en': 'Heading 3',
    'zh-CN': '三级标题',
  },
  'toolbar.bulletedList': {
    'en': 'Bulleted list',
    'zh-CN': '无序列表',
  },
  'toolbar.numberedList': {
    'en': 'Numbered list',
    'zh-CN': '有序列表',
  },
  'toolbar.blockQuote': {
    'en': 'Block quote',
    'zh-CN': '引用',
  },
  'toolbar.bold': {
    'en': 'Bold',
    'zh-CN': '加粗',
  },
  'toolbar.italic': {
    'en': 'Italic',
    'zh-CN': '斜体',
  },
  'toolbar.underline': {
    'en': 'Underline',
    'zh-CN': '下划线',
  },
  'toolbar.strikethrough': {
    'en': 'Strikethrough',
    'zh-CN': '删除线',
  },
  'toolbar.inlineCode': {
    'en': 'Inline code',
    'zh-CN': '行内代码',
  },
  'toolbar.link': {
    'en': 'Link',
    'zh-CN': '链接',
  },
  'link.insertTitle': {
    'en': 'Insert link',
    'zh-CN': '插入链接',
  },
  'link.editTitle': {
    'en': 'Edit link',
    'zh-CN': '编辑链接',
  },
  'link.url': {
    'en': 'URL',
    'zh-CN': '网址',
  },
  'link.invalidUrl': {
    'en': 'Enter a valid http, https, mailto, or tel URL.',
    'zh-CN': '请输入有效的 http、https、mailto 或 tel 网址。',
  },
  'link.remove': {
    'en': 'Remove link',
    'zh-CN': '移除链接',
  },
  'link.cancel': {
    'en': 'Cancel',
    'zh-CN': '取消',
  },
  'link.add': {
    'en': 'Add link',
    'zh-CN': '添加链接',
  },
  'link.update': {
    'en': 'Update link',
    'zh-CN': '更新链接',
  },
} as const

export type RichTextMessageKey = keyof typeof FALLBACKS

/** 把 `{name}` 占位符换成实际值，认不出的占位符原样留着。 */
function fillPlaceholders(template: string, values?: TranslatorValues): string {
  return template.replace(/\{(\w+)\}/g, (whole, name: string) => {
    const value = values?.[name]
    return value === undefined ? whole : String(value)
  })
}

export type RichTextTranslator = (key: RichTextMessageKey, values?: TranslatorValues) => string

/** 取文案的翻译函数，优先用 core 的译文，没有就用包内的兜底。 */
export function useRichTextMessages(): RichTextTranslator {
  const { t } = useTranslator()
  const { locale } = useLocale()

  return (key, values) => {
    const coreKey = `@astryx.richTextEditor.${key}`
    const translated = t(coreKey, values)
    if (translated !== coreKey)
      return translated
    return fillPlaceholders(FALLBACKS[key][locale.value === 'zh-CN' ? 'zh-CN' : 'en'], values)
  }
}
