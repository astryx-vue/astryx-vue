/**
 * button（命令按钮）模式契约。对应上游 `internal/a11y-spec/src/patterns/button.ts`。
 *
 * 采纳的模式：https://www.w3.org/WAI/ARIA/apg/patterns/button/
 *
 * 契约负责所有按钮都一样的那部分：被报成按钮而不是链接、有名字、说明能送到、
 * 鼠标/Enter/Space 都能触发动作、按下滑开能反悔、Tab 能进能出、不可用时说清楚并且真的不响应。
 *
 * 有两类不归这里：带 aria-pressed 的切换按钮有自己的模式（toggle-button）；
 * 给了 href 的按钮渲染成链接，归 link 模式。
 */
import { definePattern } from '../contract'
import { apg, FAMILY_BUTTONS_FR2, FAMILY_BUTTONS_FR3, WCAG_1_3_1, WCAG_2_1_1, WCAG_2_1_2, WCAG_2_5_2, WCAG_2_5_3, WCAG_4_1_2 } from '../sources'
import { controlExemptions } from './exemptions'
import {
  ALWAYS,
  assertDescriptionExposed,
  assertDescriptionResolvable,
  assertNamed,
  assertNameMatchesVisibleLabel,
  assertReachableAndEscapable,
  assertRole,
  focusOrFail,
} from './shared'

const NOUN = '按钮'
const APG_ROLE = apg('button', 'The button has role of button.')
const APG_LABEL = apg('button', 'The button has an accessible label. By default, the accessible name is computed from any text content inside the button element. However, it can also be provided with aria-labelledby or aria-label.')
const APG_DESCRIBEDBY = apg('button', 'If a description of the button\'s function is present, the button element has aria-describedby set to the ID of the element containing the description.')
const APG_UNAVAILABLE = apg('button', 'When the action associated with a button is unavailable, the button has aria-disabled set to true.')
const APG_ENTER = apg('button', 'Enter: Activates the button.', 'keyboardinteraction')
const APG_SPACE = apg('button', 'Space: Activates the button.', 'keyboardinteraction')

export interface ButtonStateFacts {
  /** 按下去是否应该执行动作。 */
  readonly operable: boolean
  /** 是否应该在 Tab 顺序里。 */
  readonly focusable: boolean
  /** 动作是否应该被报成不可用。 */
  readonly unavailable: boolean
  /** 是否挂了说明文字。 */
  readonly described: boolean
}

export const BUTTON_PATTERN = definePattern<ButtonStateFacts>({
  pattern: 'button',
  url: 'https://www.w3.org/WAI/ARIA/apg/patterns/button/',
  scope: '一个命令控件：被报成按钮、有名字和说明，鼠标、Enter、Space 都能执行动作，或者明确说明自己不能执行。',
  expectations: [
    {
      id: 'button.role.exposed',
      outcome: '它被念成按钮，用户知道按下去是在这里做事，而不是跳到别处。',
      sources: [WCAG_4_1_2, APG_ROLE],
      covers: ['4.1.2-name-role-value', 'apg-interaction'],
      appliesWhen: ALWAYS,
      evidenceLayer: 'accessibility-tree',
      enforcement: 'required',
      run: async ({ subject }) => assertRole(subject, 'button', NOUN),
    },
    {
      id: 'button.name.exposed',
      outcome: '按钮有可访问名称，用户知道按下去会做什么。',
      sources: [WCAG_4_1_2, APG_LABEL],
      covers: ['4.1.2-name-role-value', '2.4.6-headings-and-labels'],
      appliesWhen: ALWAYS,
      evidenceLayer: 'accessibility-tree',
      enforcement: 'required',
      run: async ({ subject }) => assertNamed(subject, NOUN),
    },
    {
      id: 'button.name.matches-visible-label',
      outcome: '可访问名称包含看得见的标签，说话输入的用户念出看到的字就能按到它。',
      sources: [WCAG_2_5_3, APG_LABEL],
      covers: ['2.5.3-label-in-name'],
      appliesWhen: ALWAYS,
      evidenceLayer: 'accessibility-tree',
      alsoNeeds: ['real-browser'],
      enforcement: 'required',
      run: assertNameMatchesVisibleLabel,
    },
    {
      id: 'button.description.resolvable',
      outcome: '按钮指向的每段说明文字都存在。',
      sources: [WCAG_1_3_1, APG_DESCRIBEDBY],
      covers: ['1.3.1-info-and-relationships'],
      appliesWhen: { condition: '这个状态渲染了说明文字', test: facts => facts.described },
      evidenceLayer: 'dom',
      enforcement: 'required',
      run: async ({ subject }) => assertDescriptionResolvable(subject, NOUN),
    },
    {
      id: 'button.description.exposed',
      outcome: '说明文字作为控件的描述送到用户耳边。',
      sources: [WCAG_4_1_2, APG_DESCRIBEDBY],
      covers: ['4.1.2-name-role-value'],
      appliesWhen: { condition: '这个状态渲染了说明文字', test: facts => facts.described },
      evidenceLayer: 'accessibility-tree',
      enforcement: 'required',
      run: async ({ subject }) => assertDescriptionExposed(subject),
    },
    {
      id: 'button.unavailable.exposed',
      outcome: '动作不可用的按钮会说明这一点，而不是看着能用、按了没反应。',
      sources: [WCAG_4_1_2, APG_UNAVAILABLE],
      covers: ['4.1.2-name-role-value'],
      appliesWhen: { condition: '绑定声明这个状态不可用', test: facts => facts.unavailable },
      evidenceLayer: 'accessibility-tree',
      enforcement: 'required',
      run: async ({ subject }) => {
        if (!(await subject.computed()).disabled)
          throw new Error('这个状态声明不可用，按钮却被报成可用，用户会去按一个不会生效的按钮')
      },
    },
    {
      id: 'button.action.runs-on-pointer',
      outcome: '点击按钮会执行它的动作。',
      sources: [FAMILY_BUTTONS_FR2, APG_ROLE, WCAG_4_1_2],
      covers: ['apg-interaction'],
      appliesWhen: { condition: '按下这个状态应该执行动作', test: facts => facts.operable },
      evidenceLayer: 'real-browser',
      enforcement: 'required',
      run: async ({ harness, subject, activations }) => {
        const before = await activations()
        await harness.click(subject)
        if ((await activations()) === before)
          throw new Error('点击按钮什么也没执行，控件宣称的动作并不存在')
      },
    },
    {
      id: 'button.action.runs-on-enter',
      outcome: '焦点在按钮上时，Enter 会执行动作，键盘和鼠标能做到同样的事。',
      sources: [WCAG_2_1_1, APG_ENTER],
      covers: ['2.1.1-keyboard', 'apg-interaction'],
      appliesWhen: { condition: '按下应该执行动作，并且应该能聚焦', test: facts => facts.operable && facts.focusable },
      evidenceLayer: 'real-browser',
      enforcement: 'required',
      run: async ({ harness, subject, activations }) => {
        await focusOrFail(subject, '按钮拿不到焦点，Enter 永远按不到它')
        const before = await activations()
        await harness.press('Enter')
        if ((await activations()) === before)
          throw new Error('在按钮上按 Enter 什么也没执行，键盘用户用不了这个动作')
      },
    },
    {
      id: 'button.action.runs-on-space',
      outcome: '焦点在按钮上时，Space 也会执行动作。',
      sources: [WCAG_2_1_1, APG_SPACE],
      covers: ['2.1.1-keyboard', 'apg-interaction'],
      appliesWhen: { condition: '按下应该执行动作，并且应该能聚焦', test: facts => facts.operable && facts.focusable },
      evidenceLayer: 'real-browser',
      enforcement: 'required',
      run: async ({ harness, subject, activations }) => {
        await focusOrFail(subject, '按钮拿不到焦点，Space 永远按不到它')
        const before = await activations()
        await harness.press('Space')
        if ((await activations()) === before)
          throw new Error('在按钮上按 Space 什么也没执行；APG 要求 Enter 和 Space 都能用')
      },
    },
    {
      id: 'button.action.survives-an-aborted-press',
      outcome: '按下后滑开再松手不会执行动作，误触可以反悔。',
      sources: [WCAG_2_5_2],
      covers: ['2.5.2-pointer-cancellation'],
      appliesWhen: { condition: '按下这个状态应该执行动作', test: facts => facts.operable },
      evidenceLayer: 'real-browser',
      enforcement: 'required',
      run: async ({ harness, subject, activations }) => {
        const before = await activations()
        await harness.abortedPress(subject)
        if ((await activations()) !== before)
          throw new Error('在按钮上按下、滑开再松手，动作还是执行了：按下那一刻就触发，没法反悔')
      },
    },
    {
      id: 'button.focus.reachable-and-escapable',
      outcome: 'Tab 能到达按钮，再按 Tab 能离开。',
      sources: [WCAG_2_1_1, WCAG_2_1_2],
      covers: ['2.1.1-keyboard', '2.1.2-no-keyboard-trap'],
      appliesWhen: { condition: '这个状态应该在 Tab 顺序里', test: facts => facts.focusable },
      evidenceLayer: 'real-browser',
      enforcement: 'required',
      run: async ({ harness, subject }) => assertReachableAndEscapable(harness, subject, NOUN),
    },
    {
      id: 'button.unavailable.inert',
      outcome: '被报成不可用的按钮，点击不执行动作；仍能聚焦时，按 Enter 或 Space 也不执行。',
      sources: [FAMILY_BUTTONS_FR3, APG_UNAVAILABLE, WCAG_4_1_2],
      covers: ['apg-interaction'],
      appliesWhen: { condition: '绑定声明这个状态不可用', test: facts => facts.unavailable },
      evidenceLayer: 'real-browser',
      enforcement: 'required',
      run: async ({ harness, subject, facts, activations }) => {
        const before = await activations()
        await harness.click(subject, { ignoreAvailability: true })
        if ((await activations()) !== before)
          throw new Error('按钮被报成不可用，点击却还是执行了动作')
        if (!facts.focusable)
          return
        await focusOrFail(subject, '这个状态声明了仍可聚焦（好让不可用的原因能被读到），按钮却拿不到焦点，键盘用户既读不到原因也确认不了它不响应')
        for (const key of ['Enter', 'Space'] as const) {
          await harness.press(key)
          if ((await activations()) !== before)
            throw new Error(`按钮被报成不可用，按 ${key} 却还是执行了动作`)
        }
      },
    },
  ],
  exemptions: {
    ...controlExemptions(NOUN),
    '2.4.4-link-purpose': {
      owner: 'link 模式和调用方内容',
      verifiedBy: '评审调用方放在按钮旁边的链接；渲染成链接的按钮归 link 模式',
      reason: '契约只管命令按钮。给了 href 的按钮渲染成链接，APG 明确说两者功能不同。',
    },
    '2.4.6-headings-and-labels': {
      owner: '调用方内容和组件评审',
      verifiedBy: '评审标签文字是否说清了动作；button.name.exposed 只证明名字存在',
      reason: '标签是否说清用途是对措辞的判断，运行时看不出来。',
      coversRemainderOnly: true,
    },
    '3.2.2-on-input': {
      owner: '调用方自己的点击处理',
      verifiedBy: '集成和页面评审',
      reason: '3.2.2 管的是「改变控件的设置」，WCAG 原文说激活链接或按钮不算改设置。按钮没有设置可改。',
    },
    '3.3.2-labels-or-instructions': {
      owner: '组合它的表单和调用方内容',
      verifiedBy: '表单级别评审',
      reason: '3.3.2 管的是需要用户输入时的标签和说明，命令按钮不收集输入。',
    },
    '3.3.1-error-identification': {
      owner: '绑定的组件和组合它的表单',
      verifiedBy: '组件自己的状态消息测试和表单评审',
      reason: '命令按钮没有自己的校验状态，错误说明组合在按钮周围。',
    },
  },
})
