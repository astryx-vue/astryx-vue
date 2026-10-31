import type { EditorThemeClasses } from 'lexical'
import { CODE_SYNTAX_CLASS } from './plugins/codeHighlightRules.js'

/**
 * 把 Lexical 的主题槽位对应到普通 CSS 类名。样式在 `richtext.css` 里，用 core 的设计变量，
 * 放在 `astryx.components` 层，使用方的样式表可以直接覆盖。
 */
export function sharedEditorTheme(): EditorThemeClasses {
  return {
    paragraph: 'astryx-richtext__paragraph',
    markdownExtensionBlock: 'astryx-richtext__paragraph',
    heading: {
      h1: 'astryx-richtext__heading astryx-richtext__h1',
      h2: 'astryx-richtext__heading astryx-richtext__h2',
      h3: 'astryx-richtext__heading astryx-richtext__h3',
      h4: 'astryx-richtext__heading astryx-richtext__h4',
      h5: 'astryx-richtext__heading astryx-richtext__h5',
      h6: 'astryx-richtext__heading astryx-richtext__h6',
    },
    quote: 'astryx-richtext__quote',
    list: {
      ul: 'astryx-richtext__list',
      ol: 'astryx-richtext__list',
      listitem: 'astryx-richtext__list-item',
      nested: { listitem: 'astryx-richtext__list-item' },
      // Lexical 按嵌套深度 % 3 选类名：圆点、空心圆、方块；数字、小写字母、小写罗马数字。
      ulDepth: ['astryx-richtext__ul-0', 'astryx-richtext__ul-1', 'astryx-richtext__ul-2'],
      olDepth: ['astryx-richtext__ol-0', 'astryx-richtext__ol-1', 'astryx-richtext__ol-2'],
    },
    link: 'astryx-richtext__link',
    text: {
      bold: 'astryx-richtext__bold',
      italic: 'astryx-richtext__italic',
      underline: 'astryx-richtext__underline',
      strikethrough: 'astryx-richtext__strikethrough',
      code: 'astryx-richtext__inline-code',
    },
    // 带上 CODE_SYNTAX_CLASS，代码块的语法色规则才找得到它。
    code: `astryx-richtext__code ${CODE_SYNTAX_CLASS}`,
    hr: 'astryx-richtext__hr',
    hrSelected: 'astryx-richtext__selected',
    markdownExtensionSelected: 'astryx-richtext__selected',
    table: 'astryx-richtext__table',
    tableRow: 'astryx-richtext__table-row',
    tableCell: 'astryx-richtext__table-cell',
    tableCellHeader: 'astryx-richtext__table-cell-header',
    tableCellSelected: 'astryx-richtext__table-cell-selected',
    tableScrollableWrapper: 'astryx-richtext__table-wrap',
  }
}
