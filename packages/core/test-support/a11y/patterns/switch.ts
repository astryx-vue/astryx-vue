/**
 * switch（开关）模式契约。对应上游 `internal/a11y-spec/src/patterns/switch.ts`。
 *
 * 采纳的模式：https://www.w3.org/WAI/ARIA/apg/patterns/switch/
 *
 * 契约负责所有开关都一样的那部分：被报成 switch、有名字、开关状态对外暴露且和画面一致、
 * 鼠标和键盘都能来回切换、按下滑开能反悔、切换时焦点不乱跳、不能改时真的改不了。
 * 回调、表单、提示框和样式归组件自己的测试。
 */
import type { TriState } from '../harness'
import { definePattern } from '../contract'
import { apg, WCAG_1_3_1, WCAG_2_1_1, WCAG_2_1_2, WCAG_2_5_2, WCAG_2_5_3, WCAG_3_2_2, WCAG_3_3_2, WCAG_4_1_2 } from '../sources'
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

const NOUN = '开关'
const APG_ROLE = apg('switch', 'The switch has role switch.')
const APG_LABEL = apg('switch', 'The switch has an accessible label provided by visible text content, aria-labelledby, or aria-label.')
const APG_STATE = apg('switch', 'When on, the switch has state aria-checked set to true; when off, false. An HTML input[type="checkbox"] uses the HTML checked attribute instead.')
const APG_DESCRIBEDBY = apg('switch', 'If the presentation includes additional descriptive static text relevant to a switch, the switch has aria-describedby set to the id of the element containing the description.')
const APG_STABLE_LABEL = apg('switch', 'It is critical the label on a switch does not change when its state changes.', 'aboutthispattern')
const APG_SPACE = apg('switch', 'Space: when focus is on the switch, changes its state.', 'keyboardinteraction')

/** 绑定声明某个状态「应该是」什么样。契约拿它和实际暴露的结果对比，所以绑定没法靠一贯地错来通过。 */
export interface SwitchStateFacts {
  readonly checked: boolean
  /** 用户是否应该能改。 */
  readonly operable: boolean
  /** 是否应该在 Tab 顺序里。 */
  readonly focusable: boolean
  /** 是否应该被报成不可用。 */
  readonly disabled: boolean
  /** 是否挂了说明文字。 */
  readonly described: boolean
  readonly required: boolean
  readonly invalid: boolean
}

export function onOff(state: TriState | null): string {
  return state === 'true' ? '开' : state === 'false' ? '关' : state === 'mixed' ? '半开' : '无状态'
}

export const SWITCH_PATTERN = definePattern<SwitchStateFacts>({
  pattern: 'switch',
  url: 'https://www.w3.org/WAI/ARIA/apg/patterns/switch/',
  scope: '一个被报成 switch、有名字、状态对外暴露、鼠标和键盘都能来回切换的二元控件。',
  expectations: [
    {
      id: 'switch.role.exposed',
      outcome: '读屏软件把它报成开关，用户听到的是「开/关」，而不是「已勾选」或什么都没有。',
      sources: [WCAG_4_1_2, APG_ROLE],
      covers: ['4.1.2-name-role-value', 'apg-interaction'],
      appliesWhen: ALWAYS,
      evidenceLayer: 'accessibility-tree',
      enforcement: 'required',
      run: async ({ subject }) => assertRole(subject, 'switch', NOUN),
    },
    {
      id: 'switch.name.exposed',
      outcome: '开关有可访问名称，用户知道自己在开关哪个设置。',
      sources: [WCAG_4_1_2, WCAG_3_3_2, APG_LABEL],
      covers: ['4.1.2-name-role-value', '3.3.2-labels-or-instructions'],
      appliesWhen: ALWAYS,
      evidenceLayer: 'accessibility-tree',
      enforcement: 'required',
      run: async ({ subject }) => assertNamed(subject, NOUN),
    },
    {
      id: 'switch.name.matches-visible-label',
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
      id: 'switch.state.exposed',
      outcome: '开关状态对外暴露，并且和画面一致：听到的就是看到的。',
      sources: [WCAG_4_1_2, APG_STATE],
      covers: ['4.1.2-name-role-value', 'apg-interaction'],
      appliesWhen: ALWAYS,
      evidenceLayer: 'accessibility-tree',
      enforcement: 'required',
      run: async ({ subject, facts }) => {
        const { checked } = await subject.computed()
        if (checked == null)
          throw new Error('这个开关没有暴露开/关状态，读屏软件说不出它开着没有')
        const expected = facts.checked ? 'true' : 'false'
        if (checked !== expected)
          throw new Error(`这个状态画的是${onOff(expected)}，暴露出来的却是${onOff(checked)}`)
      },
    },
    {
      id: 'switch.description.resolvable',
      outcome: '开关指向的每段说明文字都存在，说明不会悄悄丢掉。',
      sources: [WCAG_1_3_1, APG_DESCRIBEDBY],
      covers: ['1.3.1-info-and-relationships'],
      appliesWhen: { condition: '这个状态渲染了说明文字', test: facts => facts.described },
      evidenceLayer: 'dom',
      enforcement: 'required',
      run: async ({ subject }) => assertDescriptionResolvable(subject, NOUN),
    },
    {
      id: 'switch.description.exposed',
      outcome: '说明文字作为控件的描述送到用户耳边，而不只是挨在旁边的标记。',
      sources: [WCAG_4_1_2, APG_DESCRIBEDBY],
      covers: ['4.1.2-name-role-value'],
      appliesWhen: { condition: '这个状态渲染了说明文字', test: facts => facts.described },
      evidenceLayer: 'accessibility-tree',
      enforcement: 'required',
      run: async ({ subject }) => assertDescriptionExposed(subject),
    },
    {
      id: 'switch.disabled.exposed',
      outcome: '标成不可用的开关会被报成不可用，而不是看着能用、按了没反应。',
      sources: [WCAG_4_1_2],
      covers: ['4.1.2-name-role-value'],
      appliesWhen: { condition: '绑定声明这个状态不可用', test: facts => facts.disabled },
      evidenceLayer: 'accessibility-tree',
      enforcement: 'required',
      run: async ({ subject }) => {
        if (!(await subject.computed()).disabled)
          throw new Error('绑定声明这个状态不可用，开关却被报成可用，用户会去改一个改不了的东西')
      },
    },
    {
      id: 'switch.required.declared',
      outcome: '必须打开的开关会声明这一点，提交前用户就能知道。',
      sources: [WCAG_3_3_2, WCAG_4_1_2],
      covers: ['3.3.2-labels-or-instructions'],
      appliesWhen: { condition: '这个状态是必填的', test: facts => facts.required },
      evidenceLayer: 'dom',
      enforcement: 'required',
      run: async ({ subject }) => assertRequiredDeclared(subject, NOUN),
    },
    {
      id: 'switch.invalid.exposed',
      outcome: '出错的开关会被报成出错，用户能找到哪里要改。',
      sources: [WCAG_4_1_2],
      covers: ['4.1.2-name-role-value'],
      appliesWhen: { condition: '这个状态有错误', test: facts => facts.invalid },
      evidenceLayer: 'accessibility-tree',
      enforcement: 'required',
      run: async ({ subject }) => {
        if (!(await subject.computed()).invalid)
          throw new Error('这个状态有错误，开关却没被报成无效，只有看得见错误提示的人才知道')
      },
    },
    {
      id: 'switch.state.pointer-round-trip',
      outcome: '鼠标能把开关打开再关上，暴露的状态两次都跟着变。',
      sources: [WCAG_4_1_2, APG_STATE],
      covers: ['4.1.2-name-role-value', 'apg-interaction'],
      appliesWhen: { condition: '用户应该能改这个状态', test: facts => facts.operable },
      evidenceLayer: 'real-browser',
      alsoNeeds: READS_THE_TREE,
      enforcement: 'required',
      run: async ({ harness, subject, facts }) =>
        roundTrip(facts.checked, () => harness.click(subject), async () => (await subject.computed()).checked, '点击开关', onOff),
    },
    {
      id: 'switch.state.space-round-trip',
      outcome: '焦点在开关上时，Space 能把它打开再关上，键盘和鼠标能做到同样的事。',
      sources: [WCAG_2_1_1, APG_SPACE],
      covers: ['2.1.1-keyboard', 'apg-interaction'],
      appliesWhen: { condition: '用户应该能改这个状态，并且能聚焦到它', test: facts => facts.operable && facts.focusable },
      evidenceLayer: 'real-browser',
      alsoNeeds: READS_THE_TREE,
      enforcement: 'required',
      run: async ({ harness, subject, facts }) => {
        await focusOrFail(subject, '开关拿不到焦点，Space 永远按不到它')
        await roundTrip(facts.checked, () => harness.press('Space'), async () => (await subject.computed()).checked, '在开关上按 Space', onOff)
      },
    },
    {
      id: 'switch.name.stable-across-change',
      outcome: '开关打开或关上时名字不变，名字一直说的是哪个设置，而不是下一步动作。',
      sources: [APG_STABLE_LABEL, WCAG_4_1_2],
      wcagOutcome: '4.1.2 里的名称标识的是哪个设置；名字跟着状态变就成了动作描述，读屏用户会听到新名字和它矛盾的状态一起被念出来。',
      covers: ['apg-interaction'],
      appliesWhen: { condition: '用户应该能改这个状态', test: facts => facts.operable },
      evidenceLayer: 'accessibility-tree',
      alsoNeeds: ['real-browser'],
      enforcement: 'advisory',
      advisoryBecause: '这是 APG 独有的要求，没有 WCAG 2.2 A/AA 条款支撑，也没有 Astryx 记录采纳它，所以只报告不拦截。',
      run: async ({ harness, subject }) => {
        const before = (await subject.computed()).name
        await harness.click(subject)
        const changed = (await subject.computed()).name
        if (!sameName(changed, before))
          throw new Error(`打开开关后名字从「${before}」变成了「${changed}」，名字描述的是动作而不是设置`)
        await harness.click(subject)
        const back = (await subject.computed()).name
        if (!sameName(back, before))
          throw new Error(`关上开关后名字从「${before}」变成了「${back}」`)
      },
    },
    {
      id: 'switch.state.survives-an-aborted-press',
      outcome: '按下后滑开再松手，开关不变，误触可以反悔。',
      sources: [WCAG_2_5_2],
      covers: ['2.5.2-pointer-cancellation'],
      appliesWhen: { condition: '用户应该能改这个状态', test: facts => facts.operable },
      evidenceLayer: 'real-browser',
      alsoNeeds: READS_THE_TREE,
      enforcement: 'required',
      run: async ({ harness, subject }) => assertSurvivesAbortedPress(harness, subject, NOUN, onOff),
    },
    {
      id: 'switch.state.keeps-focus-on-change',
      outcome: '打开开关后焦点还在开关上，键盘用户不会被甩到别处。',
      sources: [WCAG_3_2_2],
      covers: ['3.2.2-on-input'],
      appliesWhen: { condition: '用户应该能改这个状态，并且能聚焦到它', test: facts => facts.operable && facts.focusable },
      evidenceLayer: 'real-browser',
      alsoNeeds: READS_THE_TREE,
      enforcement: 'required',
      run: async ({ harness, subject }) => assertKeepsFocusOnChange(harness, subject, NOUN, onOff),
    },
    {
      id: 'switch.focus.reachable-and-escapable',
      outcome: 'Tab 能到达开关，再按 Tab 能离开，键盘用户能找到这个设置也能继续往下走。',
      sources: [WCAG_2_1_1, WCAG_2_1_2],
      covers: ['2.1.1-keyboard', '2.1.2-no-keyboard-trap'],
      appliesWhen: { condition: '这个状态应该在 Tab 顺序里', test: facts => facts.focusable },
      evidenceLayer: 'real-browser',
      enforcement: 'required',
      run: async ({ harness, subject }) => assertReachableAndEscapable(harness, subject, NOUN),
    },
    {
      id: 'switch.state.inoperable',
      outcome: '用户不该能改的开关，点击或按 Space 都不会变。',
      sources: [WCAG_4_1_2, APG_STATE],
      covers: ['4.1.2-name-role-value'],
      appliesWhen: { condition: '用户不应该能改这个状态', test: facts => !facts.operable },
      evidenceLayer: 'real-browser',
      alsoNeeds: READS_THE_TREE,
      enforcement: 'required',
      run: async ({ harness, subject, facts }) => assertInoperable(harness, subject, NOUN, facts.focusable ? 'required' : 'none', onOff),
    },
  ],
  exemptions: {
    ...controlExemptions(NOUN),
    '2.4.4-link-purpose': { owner: '调用方内容', verifiedBy: '评审调用方放在开关旁边的链接', reason: '开关模式没有链接部分。' },
    '2.4.6-headings-and-labels': { owner: '调用方内容和组件评审', verifiedBy: '评审标签文字是否说清了它控制的设置', reason: '契约只证明名字存在且和可见标签一致，措辞好不好是人的判断。' },
    '3.2.2-on-input': {
      owner: '调用方自己的 change 处理',
      verifiedBy: '集成和页面评审',
      reason: '开关只负责「切换时焦点不动」这一半；调用方在 change 里跳转或重写页面，是调用方的上下文变化。',
      coversRemainderOnly: true,
    },
    '3.3.1-error-identification': {
      owner: '绑定的组件',
      verifiedBy: '组件自己的状态消息测试',
      reason: '3.3.1 要求用文字说明错误，文字组合在开关旁边；switch.invalid.exposed 属于 4.1.2，不算这一条。',
    },
  },
})

function sameName(a: string, b: string): boolean {
  return a.toLowerCase().replace(/\s+/g, ' ').trim() === b.toLowerCase().replace(/\s+/g, ' ').trim()
}
