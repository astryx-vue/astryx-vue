/**
 * 完整性清单：每个交互契约都必须逐条回答的 29 个维度。
 *
 * 一个维度只有两种回答：
 * - 编码：契约里至少有一条期望在 `covers` 里点名它；
 * - 豁免：契约不负责它，写清楚谁负责、用什么方法验证、为什么。
 * 不回答、或者只写一句「不适用」都不算回答（上游 AST-020 FR5）。
 *
 * 行来自上游 `internal/a11y-spec/src/checklist.ts`：WCAG 2.2 A/AA 里和组件有关的条目，
 * 加上 APG 交互、强制配色、减少动态效果、给读屏软件看的文案翻译。
 */

/** 契约不负责某个维度时的回答。 */
export interface ChecklistExemption {
  /** 谁负责：组件、主题、页面或调用方。 */
  readonly owner: string
  /** 负责方实际怎么验证。写方法，不写承诺。 */
  readonly verifiedBy: string
  /** 为什么不归这个契约管。 */
  readonly reason: string
  /** 契约编码了这个维度的一部分，剩下的归 owner。 */
  readonly coversRemainderOnly?: boolean
}

export interface ChecklistDimension {
  readonly id: string
  readonly source: string
  readonly outcome: string
}

export const CHECKLIST_DIMENSIONS = [
  { id: '1.1.1-non-text-content', source: 'WCAG 2.2 1.1.1 Non-text Content (A)', outcome: '有意义的非文本内容有文字替代，装饰性内容被忽略。' },
  { id: '1.3.1-info-and-relationships', source: 'WCAG 2.2 1.3.1 Info and Relationships (A)', outcome: '视觉上的结构和关系在程序里也拿得到。' },
  { id: '1.3.2-meaningful-sequence', source: 'WCAG 2.2 1.3.2 Meaningful Sequence (A)', outcome: '程序里的阅读顺序不改变含义。' },
  { id: '1.3.5-identify-input-purpose', source: 'WCAG 2.2 1.3.5 Identify Input Purpose (AA)', outcome: '收集用户信息的输入框声明了用途。' },
  { id: '1.4.1-use-of-color', source: 'WCAG 2.2 1.4.1 Use of Color (A)', outcome: '颜色不是传达信息或状态的唯一方式。' },
  { id: '1.4.3-contrast-minimum', source: 'WCAG 2.2 1.4.3 Contrast (Minimum) (AA)', outcome: '文字对比度达标。' },
  { id: '1.4.11-non-text-contrast', source: 'WCAG 2.2 1.4.11 Non-text Contrast (AA)', outcome: '控件、状态和有意义图形的对比度达标。' },
  { id: '2.1.1-keyboard', source: 'WCAG 2.2 2.1.1 Keyboard (A)', outcome: '组件自己的功能都能用键盘操作。' },
  { id: '2.1.2-no-keyboard-trap', source: 'WCAG 2.2 2.1.2 No Keyboard Trap (A)', outcome: '键盘焦点能离开组件。' },
  { id: '2.4.2-page-titled', source: 'WCAG 2.2 2.4.2 Page Titled (A)', outcome: '页面有描述性的标题。' },
  { id: '2.4.3-focus-order', source: 'WCAG 2.2 2.4.3 Focus Order (A)', outcome: '顺序移动焦点时含义和操作不乱。' },
  { id: '2.4.4-link-purpose', source: 'WCAG 2.2 2.4.4 Link Purpose (In Context) (A)', outcome: '链接的目的能看明白。' },
  { id: '2.4.6-headings-and-labels', source: 'WCAG 2.2 2.4.6 Headings and Labels (AA)', outcome: '标题和标签说清楚了主题或用途。' },
  { id: '2.4.7-focus-visible', source: 'WCAG 2.2 2.4.7 Focus Visible (AA)', outcome: '键盘焦点看得见。' },
  { id: '2.4.11-focus-not-obscured', source: 'WCAG 2.2 2.4.11 Focus Not Obscured (Minimum) (AA)', outcome: '获得焦点的内容没有被完全挡住。' },
  { id: '2.5.2-pointer-cancellation', source: 'WCAG 2.2 2.5.2 Pointer Cancellation (A)', outcome: '按下去还没松手时可以反悔。' },
  { id: '2.5.3-label-in-name', source: 'WCAG 2.2 2.5.3 Label in Name (A)', outcome: '可访问名称里包含看得见的标签文字。' },
  { id: '2.5.8-target-size', source: 'WCAG 2.2 2.5.8 Target Size (Minimum) (AA)', outcome: '指针目标够大，或者符合例外。' },
  { id: '3.1.1-language-of-page', source: 'WCAG 2.2 3.1.1 Language of Page (A)', outcome: '页面语言在程序里拿得到。' },
  { id: '3.2.2-on-input', source: 'WCAG 2.2 3.2.2 On Input (A)', outcome: '改控件的值不会自动切换上下文。' },
  { id: '3.2.4-consistent-identification', source: 'WCAG 2.2 3.2.4 Consistent Identification (AA)', outcome: '重复出现的功能标识一致。' },
  { id: '3.3.1-error-identification', source: 'WCAG 2.2 3.3.1 Error Identification (A)', outcome: '输入错误用文字说明。' },
  { id: '3.3.2-labels-or-instructions', source: 'WCAG 2.2 3.3.2 Labels or Instructions (A)', outcome: '输入控件有持续可见的标签或说明。' },
  { id: '4.1.2-name-role-value', source: 'WCAG 2.2 4.1.2 Name, Role, Value (A)', outcome: '名称、角色、状态、值以及它们的变化都能被程序拿到。' },
  { id: '4.1.3-status-messages', source: 'WCAG 2.2 4.1.3 Status Messages (AA)', outcome: '状态变化不移动焦点也能被播报。' },
  { id: 'apg-interaction', source: '采纳的 WAI-ARIA APG 模式', outcome: '模式规定的角色、状态、属性和键盘交互都实现了。' },
  { id: 'forced-colors', source: 'Astryx 可访问性清单：强制配色', outcome: '`forced-colors: active` 下状态仍然画得出来。' },
  { id: 'reduced-motion', source: 'Astryx 可访问性清单：减少动态效果', outcome: '进出场动画受 `prefers-reduced-motion` 控制。' },
  { id: 'at-facing-strings', source: 'Astryx 可访问性清单：国际化', outcome: '给读屏软件看的文字和可见文字一样会被翻译。' },
] as const satisfies readonly ChecklistDimension[]

export type ChecklistDimensionId = (typeof CHECKLIST_DIMENSIONS)[number]['id']
