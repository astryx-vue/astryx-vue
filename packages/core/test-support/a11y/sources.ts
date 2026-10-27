/**
 * 各个模式共用的规范出处。WCAG 条款只写一次，模式文件按需引用。
 * APG 的原文引用各模式不同，用 `apg()` 现场构造。
 */
import type { ApgRequirement, AstryxRecord, WcagCriterion } from './contract'

const UNDERSTANDING = 'https://www.w3.org/WAI/WCAG22/Understanding'

function wcag(id: string, name: string, slug: string, level: 'A' | 'AA' = 'A'): WcagCriterion {
  return { standard: 'wcag', id, name, level, url: `${UNDERSTANDING}/${slug}.html` }
}

export const WCAG_1_3_1 = wcag('1.3.1', 'Info and Relationships', 'info-and-relationships')
export const WCAG_2_1_1 = wcag('2.1.1', 'Keyboard', 'keyboard')
export const WCAG_2_1_2 = wcag('2.1.2', 'No Keyboard Trap', 'no-keyboard-trap')
export const WCAG_2_5_2 = wcag('2.5.2', 'Pointer Cancellation', 'pointer-cancellation')
export const WCAG_2_5_3 = wcag('2.5.3', 'Label in Name', 'label-in-name')
export const WCAG_3_2_2 = wcag('3.2.2', 'On Input', 'on-input')
export const WCAG_3_3_2 = wcag('3.3.2', 'Labels or Instructions', 'labels-or-instructions')
export const WCAG_4_1_2 = wcag('4.1.2', 'Name, Role, Value', 'name-role-value')

/** APG 模式页里的一句原文。`anchor` 是页面上的小节锚点。 */
export function apg(pattern: string, requirement: string, anchor = 'wai-ariaroles,states,andproperties'): ApgRequirement {
  return { standard: 'apg', pattern, requirement, url: `https://www.w3.org/WAI/ARIA/apg/patterns/${pattern}/#${anchor}` }
}

const FAMILY_BUTTONS = 'https://github.com/facebook/astryx/blob/cb13c1eaa89065cf7656a0d647be428447040d71/docs/families/buttons.md'

/** 上游 buttons 家族记录 FR2：按钮可操作、能用键盘激活。 */
export const FAMILY_BUTTONS_FR2: AstryxRecord = {
  standard: 'astryx',
  id: 'family:buttons',
  clause: 'FR2',
  requirement: 'A momentary or persistent action renders an operable button with keyboard activation, focus-visible feedback, and `type="button"` unless the component\'s documented form mode says otherwise.',
  url: `${FAMILY_BUTTONS}#L108-L111`,
}

/** 上游 buttons 家族记录 FR3：禁用的按钮不能触发回调。 */
export const FAMILY_BUTTONS_FR3: AstryxRecord = {
  standard: 'astryx',
  id: 'family:buttons',
  clause: 'FR3',
  requirement: 'A disabled member MUST NOT invoke its callback or Action.',
  url: `${FAMILY_BUTTONS}#L113-L114`,
}

/** 上游 AST-021 FR7：迁移要保留现有行为。 */
export const AST_021_PRESERVE_BEHAVIOR: AstryxRecord = {
  standard: 'astryx',
  id: 'spec:AST-021',
  clause: 'FR7',
  requirement: 'Existing behavior is preserved unless a separate change authorizes it.',
  url: 'https://github.com/facebook/astryx/blob/9fdb3819f91b3642b46319f21f4d99f95bc14f16/docs/specs/AST-021/spec.md#L85-L89',
}
