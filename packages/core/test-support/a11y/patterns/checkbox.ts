/**
 * checkbox（复选框）模式契约。对应上游 `internal/a11y-spec/src/patterns/checkbox.ts`。
 *
 * 采纳的模式：https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/
 *
 * 契约负责所有复选框都一样的那部分：角色（checkbox 或菜单里的 menuitemcheckbox）、名字、
 * 未勾选/已勾选/部分勾选状态和画面一致、可用/只读/必填/无效这些状态不多报也不漏报、
 * 鼠标能来回改、直接的复选框还能用 Space 改且不困住焦点、不能改时真的改不了。
 * 菜单里的方向键导航归菜单契约；回调、表单和样式归组件自己。
 */
import type { TriState } from '../harness'
import { definePattern } from '../contract'
import { apg, AST_021_PRESERVE_BEHAVIOR, WCAG_1_3_1, WCAG_2_1_1, WCAG_2_1_2, WCAG_2_5_2, WCAG_2_5_3, WCAG_3_2_2, WCAG_3_3_2, WCAG_4_1_2 } from '../sources'
import { controlExemptions } from './exemptions'
import {
  ALWAYS,
  assertDescriptionExposed,
  assertDescriptionResolvable,
  assertInoperable,
  assertKeepsFocusOnChange,
  assertNamed,
  assertNameMatchesVisibleLabel,
  assertReachableAndEscapable,
  assertRequiredDeclared,
  assertRole,
  assertSurvivesAbortedPress,
  focusOrFail,
  READS_THE_TREE,
  roundTrip,
} from './shared'

const NOUN = '复选框'
const APG_ROLE = apg('checkbox', 'The checkbox has role checkbox.')
const APG_MENUITEM_CHECKBOX_ROLE = apg('menubar', 'Focusable elements, which may have role menuitem, menuitemradio, or menuitemcheckbox, are referred to as items.', 'keyboardinteraction')
const APG_LABEL = apg('checkbox', 'The checkbox has an accessible label provided by visible text content, aria-labelledby, or aria-label.')
const APG_STATE = apg('checkbox', 'When checked, the checkbox element has state aria-checked set to true. When not checked, it has state aria-checked set to false. When partially checked, it has state aria-checked set to mixed.')
const APG_DESCRIBEDBY = apg('checkbox', 'If the presentation includes additional descriptive static text relevant to a checkbox or to a group of checkboxes, the checkbox or checkbox group has aria-describedby set to the id of the element containing the description.')
const APG_SPACE = apg('checkbox', 'When the checkbox has focus, pressing the Space key changes the state of the checkbox.', 'keyboardinteraction')

export interface CheckboxStateFacts {
  /** 这个状态采用哪个带勾选的角色。 */
  readonly role: 'checkbox' | 'menuitemcheckbox'
  readonly checked: boolean | 'mixed'
  readonly operable: boolean
  /** 是否应该在页面的 Tab 顺序里。菜单项由菜单管理焦点，所以是 false。 */
  readonly focusable: boolean
  readonly disabled: boolean
  /** 应该作为描述暴露的说明文字。 */
  readonly description: string | null
  readonly readOnly: boolean
  readonly required: boolean
  readonly invalid: boolean
}

export function checkedWord(state: TriState | null): string {
  return state === 'true' ? '已勾选' : state === 'false' ? '未勾选' : state === 'mixed' ? '部分勾选' : '无勾选状态'
}

function isDirect(facts: CheckboxStateFacts): boolean {
  return facts.role === 'checkbox'
}

export const CHECKBOX_PATTERN = definePattern<CheckboxStateFacts>({
  pattern: 'checkbox',
  url: 'https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/',
  scope: '一个带勾选的控件：暴露角色、名字、勾选状态和可用性；鼠标能来回改，直接的复选框还支持 Space 和普通的 Tab 导航。',
  expectations: [
    {
      id: 'checkbox.role.exposed',
      outcome: '控件暴露它采用的勾选类角色，用户知道这是一个可以选的值。',
      sources: [WCAG_4_1_2, APG_ROLE, APG_MENUITEM_CHECKBOX_ROLE],
      covers: ['4.1.2-name-role-value', 'apg-interaction'],
      appliesWhen: ALWAYS,
      evidenceLayer: 'accessibility-tree',
      enforcement: 'required',
      run: async ({ subject, facts }) => assertRole(subject, facts.role, NOUN),
    },
    {
      id: 'checkbox.name.exposed',
      outcome: '复选框有可访问名称，用户知道自己在选什么。',
      sources: [WCAG_4_1_2, WCAG_3_3_2, APG_LABEL],
      covers: ['4.1.2-name-role-value', '3.3.2-labels-or-instructions'],
      appliesWhen: ALWAYS,
      evidenceLayer: 'accessibility-tree',
      enforcement: 'required',
      run: async ({ subject }) => assertNamed(subject, NOUN),
    },
    {
      id: 'checkbox.name.matches-visible-label',
      outcome: '可访问名称包含看得见的标签，说话输入的用户念出看到的字就能找到它。',
      sources: [WCAG_2_5_3, APG_LABEL],
      covers: ['2.5.3-label-in-name'],
      appliesWhen: ALWAYS,
      evidenceLayer: 'accessibility-tree',
      alsoNeeds: ['real-browser'],
      enforcement: 'required',
      run: assertNameMatchesVisibleLabel,
    },
    {
      id: 'checkbox.state.exposed',
      outcome: '暴露出来的未勾选、已勾选或部分勾选，和画面上的一致。',
      sources: [WCAG_4_1_2, APG_STATE],
      covers: ['4.1.2-name-role-value', 'apg-interaction'],
      appliesWhen: ALWAYS,
      evidenceLayer: 'accessibility-tree',
      enforcement: 'required',
      run: async ({ subject, facts }) => {
        const { checked } = await subject.computed()
        if (checked == null)
          throw new Error('这个复选框没有暴露勾选状态')
        const expected: TriState = facts.checked === 'mixed' ? 'mixed' : facts.checked ? 'true' : 'false'
        if (checked !== expected)
          throw new Error(`这个状态画的是${checkedWord(expected)}，暴露出来的却是${checkedWord(checked)}`)
      },
    },
    {
      id: 'checkbox.description.resolvable',
      outcome: '复选框指向的说明文字都存在，并且正是这个状态要说的那句话。',
      sources: [WCAG_1_3_1, APG_DESCRIBEDBY],
      covers: ['1.3.1-info-and-relationships'],
      appliesWhen: { condition: '这个状态渲染了说明文字', test: facts => facts.description != null },
      evidenceLayer: 'dom',
      enforcement: 'required',
      run: async ({ subject, facts }) => assertDescriptionResolvable(subject, NOUN, facts.description ?? undefined),
    },
    {
      id: 'checkbox.description.exposed',
      outcome: '算出来的可访问描述正是这个状态的说明文字。',
      sources: [WCAG_4_1_2, APG_DESCRIBEDBY],
      covers: ['4.1.2-name-role-value'],
      appliesWhen: { condition: '这个状态渲染了说明文字', test: facts => facts.description != null },
      evidenceLayer: 'accessibility-tree',
      enforcement: 'required',
      run: async ({ subject, facts }) => assertDescriptionExposed(subject, facts.description ?? undefined),
    },
    {
      id: 'checkbox.disabled.exposed',
      outcome: '标成不可用的复选框会被报成不可用。',
      sources: [WCAG_4_1_2],
      covers: ['4.1.2-name-role-value'],
      appliesWhen: { condition: '绑定声明这个状态不可用', test: facts => facts.disabled },
      evidenceLayer: 'accessibility-tree',
      enforcement: 'required',
      run: async ({ subject }) => {
        if (!(await subject.computed()).disabled)
          throw new Error('绑定声明这个状态不可用，复选框却被报成可用，用户会去改一个改不了的东西')
      },
    },
    {
      id: 'checkbox.disabled.not-exposed',
      outcome: '可用的复选框不会被误报成不可用。',
      sources: [WCAG_4_1_2],
      covers: ['4.1.2-name-role-value'],
      appliesWhen: { condition: '这个状态可用', test: facts => !facts.disabled },
      evidenceLayer: 'accessibility-tree',
      enforcement: 'required',
      run: async ({ subject }) => {
        if ((await subject.computed()).disabled)
          throw new Error('这个状态可用，复选框却被报成不可用')
      },
    },
    {
      id: 'checkbox.readonly.declared',
      outcome: '只读的复选框声明自己的值改不了。',
      sources: [WCAG_4_1_2],
      covers: ['4.1.2-name-role-value'],
      appliesWhen: { condition: '这个状态只读', test: facts => facts.readOnly },
      evidenceLayer: 'dom',
      enforcement: 'required',
      run: async ({ subject }) => {
        if ((await subject.attribute('aria-readonly')) !== 'true')
          throw new Error('这个状态只读，复选框却没有声明 aria-readonly="true"')
      },
    },
    {
      id: 'checkbox.readonly.not-declared',
      outcome: '能改的复选框不会被误报成只读。',
      sources: [WCAG_4_1_2],
      covers: ['4.1.2-name-role-value'],
      appliesWhen: { condition: '这个状态不是只读', test: facts => !facts.readOnly },
      evidenceLayer: 'dom',
      enforcement: 'required',
      run: async ({ subject }) => {
        if ((await subject.attribute('aria-readonly')) === 'true')
          throw new Error('这个状态能改，复选框却声明了 aria-readonly="true"')
      },
    },
    {
      id: 'checkbox.required.declared',
      outcome: '必须勾选的复选框在标记里声明了必填。',
      sources: [WCAG_4_1_2],
      covers: ['4.1.2-name-role-value'],
      appliesWhen: { condition: '这个状态是必填的', test: facts => facts.required },
      evidenceLayer: 'dom',
      enforcement: 'required',
      run: async ({ subject }) => assertRequiredDeclared(subject, NOUN),
    },
    {
      id: 'checkbox.required.not-declared',
      outcome: '不是必填的复选框不会被误报成必填。',
      sources: [WCAG_4_1_2],
      covers: ['4.1.2-name-role-value'],
      appliesWhen: { condition: '这个状态不是必填的', test: facts => !facts.required },
      evidenceLayer: 'dom',
      enforcement: 'required',
      run: async ({ subject }) => {
        const native = await subject.attribute('required')
        const aria = await subject.attribute('aria-required')
        if (native != null || aria === 'true')
          throw new Error('这个状态不是必填的，复选框却声明了必填')
      },
    },
    {
      id: 'checkbox.invalid.exposed',
      outcome: '出错的复选框会被报成出错。',
      sources: [WCAG_4_1_2],
      covers: ['4.1.2-name-role-value'],
      appliesWhen: { condition: '这个状态有错误', test: facts => facts.invalid },
      evidenceLayer: 'accessibility-tree',
      enforcement: 'required',
      run: async ({ subject }) => {
        if (!(await subject.computed()).invalid)
          throw new Error('这个状态有错误，复选框却没被报成无效，只有看得见错误提示的人才知道')
      },
    },
    {
      id: 'checkbox.invalid.not-exposed',
      outcome: '没出错的复选框不会被误报成无效。',
      sources: [WCAG_4_1_2],
      covers: ['4.1.2-name-role-value'],
      appliesWhen: { condition: '这个状态没有错误', test: facts => !facts.invalid },
      evidenceLayer: 'accessibility-tree',
      enforcement: 'required',
      run: async ({ subject }) => {
        if ((await subject.computed()).invalid)
          throw new Error('这个状态没有错误，复选框却被报成无效')
      },
    },
    {
      id: 'checkbox.state.pointer-round-trip',
      outcome: '鼠标能改复选框，也能改回来，暴露的状态每次都跟着变。',
      sources: [APG_STATE, WCAG_4_1_2],
      wcagOutcome: '4.1.2 暴露的勾选状态和用户改动后的状态保持同步。',
      covers: ['4.1.2-name-role-value', 'apg-interaction'],
      appliesWhen: { condition: '用户应该能改这个状态', test: facts => facts.operable },
      evidenceLayer: 'real-browser',
      alsoNeeds: READS_THE_TREE,
      enforcement: 'advisory',
      advisoryBecause: 'APG 规定了键盘改变状态，但没有单独要求指针激活，也没有 Astryx 复选框记录把它定为门槛。',
      run: async ({ harness, subject, facts }) =>
        roundTrip(facts.checked, () => harness.click(subject), async () => (await subject.computed()).checked, '点击复选框', checkedWord),
    },
    {
      id: 'checkbox.state.space-round-trip',
      outcome: '焦点在复选框上时，Space 能改它，也能改回来。',
      sources: [WCAG_2_1_1, APG_SPACE],
      covers: ['2.1.1-keyboard', 'apg-interaction'],
      appliesWhen: { condition: '用户应该能改这个直接的复选框', test: facts => facts.operable && isDirect(facts) },
      evidenceLayer: 'real-browser',
      alsoNeeds: READS_THE_TREE,
      enforcement: 'required',
      run: async ({ harness, subject, facts }) => {
        await focusOrFail(subject, '复选框拿不到焦点，Space 永远按不到它')
        await roundTrip(facts.checked, () => harness.press('Space'), async () => (await subject.computed()).checked, '在复选框上按 Space', checkedWord)
      },
    },
    {
      id: 'checkbox.state.survives-an-aborted-press',
      outcome: '按下后滑开再松手，复选框不变，误触可以反悔。',
      sources: [WCAG_2_5_2],
      covers: ['2.5.2-pointer-cancellation'],
      appliesWhen: { condition: '用户应该能改这个状态', test: facts => facts.operable },
      evidenceLayer: 'real-browser',
      alsoNeeds: READS_THE_TREE,
      enforcement: 'required',
      run: async ({ harness, subject }) => assertSurvivesAbortedPress(harness, subject, NOUN, checkedWord),
    },
    {
      id: 'checkbox.state.keeps-focus-on-change',
      outcome: '勾选后焦点还在复选框上，键盘用户不会被甩到别处。',
      sources: [WCAG_3_2_2],
      covers: ['3.2.2-on-input'],
      appliesWhen: { condition: '用户应该能改这个直接的复选框', test: facts => facts.operable && isDirect(facts) },
      evidenceLayer: 'real-browser',
      alsoNeeds: READS_THE_TREE,
      enforcement: 'required',
      run: async ({ harness, subject }) => assertKeepsFocusOnChange(harness, subject, NOUN, checkedWord),
    },
    {
      id: 'checkbox.focus.reachable-and-escapable',
      outcome: 'Tab 能到达能改的复选框，再按 Tab 能离开。',
      sources: [WCAG_2_1_1, WCAG_2_1_2],
      covers: ['2.1.1-keyboard', '2.1.2-no-keyboard-trap'],
      appliesWhen: { condition: '这个直接的复选框能改', test: facts => isDirect(facts) && facts.operable },
      evidenceLayer: 'real-browser',
      enforcement: 'required',
      run: async ({ harness, subject }) => assertReachableAndEscapable(harness, subject, NOUN),
    },
    {
      id: 'checkbox.focus.declared-inoperable-reachable',
      outcome: '绑定承诺「改不了但仍能聚焦」的复选框，Tab 能到也能离开。',
      sources: [AST_021_PRESERVE_BEHAVIOR],
      covers: ['2.1.1-keyboard', '2.1.2-no-keyboard-trap'],
      appliesWhen: { condition: '这个直接的复选框改不了，但绑定承诺它留在 Tab 顺序里', test: facts => isDirect(facts) && !facts.operable && facts.focusable },
      evidenceLayer: 'real-browser',
      enforcement: 'advisory',
      advisoryBecause: 'AST-021 要求迁移时保留并记录现有行为，但没有记录把「每个改不了的复选框都可聚焦」定为通用门槛。',
      run: async ({ harness, subject }) => assertReachableAndEscapable(harness, subject, NOUN),
    },
    {
      id: 'checkbox.state.inoperable',
      outcome: '用户不该能改的复选框，点击或按 Space 都不会变。',
      sources: [APG_STATE, WCAG_4_1_2],
      wcagOutcome: '4.1.2 暴露的勾选状态不会声称一个不可用控件接受了改动。',
      covers: ['4.1.2-name-role-value'],
      appliesWhen: { condition: '用户不应该能改这个状态', test: facts => !facts.operable },
      evidenceLayer: 'real-browser',
      alsoNeeds: READS_THE_TREE,
      enforcement: 'advisory',
      advisoryBecause: '标准要求暴露的状态准确，但没有 Astryx 复选框记录把「所有不可用或等待中的状态都不响应」单独定为门槛。',
      run: async ({ harness, subject, facts }) =>
        assertInoperable(harness, subject, NOUN, facts.focusable && isDirect(facts) ? 'optional' : 'none', checkedWord),
    },
  ],
  exemptions: {
    ...controlExemptions(NOUN),
    'apg-interaction': {
      owner: '复选框组的组合和绑定组件',
      verifiedBy: '组级别的 DOM 和可访问性树测试（组角色、组名、组说明）',
      reason: '契约只管一个复选框。APG 里给复选框组命名和加说明的部分，只能在组装出组的地方验证。',
      coversRemainderOnly: true,
    },
    '2.4.4-link-purpose': { owner: '调用方内容', verifiedBy: '评审调用方放在复选框旁边的链接', reason: '复选框模式没有链接部分。' },
    '2.4.6-headings-and-labels': { owner: '调用方内容和组件评审', verifiedBy: '评审标签文字是否说清了选项', reason: '措辞好不好是人的判断。' },
    '3.2.2-on-input': {
      owner: '调用方自己的 change 处理',
      verifiedBy: '集成和页面评审',
      reason: '复选框只负责「勾选时焦点不动」这一半；调用方在 change 里跳转或重写页面，是调用方的上下文变化。',
      coversRemainderOnly: true,
    },
    '3.3.2-labels-or-instructions': {
      owner: '绑定的组件和调用方内容',
      verifiedBy: '组件测试和内容评审：可见标签是否一直在、需不需要额外说明',
      reason: '契约证明复选框有名字、必填声明准确；标签是否持续可见、是否需要说明，属于呈现和内容。',
      coversRemainderOnly: true,
    },
    '3.3.1-error-identification': {
      owner: '绑定的组件',
      verifiedBy: '组件自己的状态消息测试',
      reason: '3.3.1 要求用文字说明错误，文字组合在复选框旁边；checkbox.invalid.exposed 属于 4.1.2，不算这一条。',
    },
  },
})
