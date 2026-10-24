// Switch 绑定 switch 契约（happy-dom 快速通道）。状态清单照上游 Switch.a11y.states.ts。
// 回调、表单、提示框和样式不在这里，留在 Switch.test.ts。
import type { BindingState, SwitchStateFacts } from '../../test-support/a11y'
import { controlled, describeBinding, SWITCH_PATTERN, updatedAfterMount } from '../../test-support/a11y'
import { A11Y_KNOWN_FAILURES } from '../../test-support/a11y/known-failures'
import Switch from './Switch.vue'

const BASE: SwitchStateFacts = { checked: false, operable: true, focusable: true, disabled: false, described: false, required: false, invalid: false }

function facts(overrides: Partial<SwitchStateFacts> = {}): SwitchStateFacts {
  return { ...BASE, ...overrides }
}

function state(id: string, summary: string, stateFacts: SwitchStateFacts, props: Record<string, unknown>): BindingState<SwitchStateFacts> {
  const { modelValue = false, ...rest } = props
  return { id, summary, facts: stateFacts, render: () => controlled(Switch, 'modelValue', modelValue, rest) }
}

const STATES: readonly BindingState<SwitchStateFacts>[] = [
  state('off', '默认：有标签、关着、能打开', facts(), { label: 'Enable notifications' }),
  state('on', '受控值已经是开', facts({ checked: true }), { label: 'Notifications enabled', modelValue: true }),
  state('described', '标签下有说明文字', facts({ described: true }), { label: 'Dark mode', description: 'Switch to a darker color scheme for reduced eye strain.' }),
  state('label-hidden', '标签只给读屏软件，画面上不显示', facts(), { label: 'Toggle row', isLabelHidden: true }),
  state('disabled', '原生禁用，不在 Tab 顺序里', facts({ operable: false, focusable: false, disabled: true, described: true }), { label: 'Premium feature', description: 'Upgrade to enable this option', isDisabled: true }),
  state('focusable-disabled', '带原因的禁用：仍可聚焦，原因能被读到，但不能改', facts({ operable: false, disabled: true, described: true }), { label: 'Enable notifications', isDisabled: true, disabledMessage: 'Notifications are turned off org-wide' }),
  state('required', '必须打开才能提交', facts({ required: true }), { label: 'Accept terms and conditions', isRequired: true }),
  state('invalid', '必填并报告了错误，错误信息挂在控件上', facts({ described: true, required: true, invalid: true }), { label: 'Accept terms and conditions', isRequired: true, status: { type: 'error', message: 'You must accept the terms to continue' } }),
  state('loading', '等待自己发起的改动：可聚焦、忙碌、暂时不能改', facts({ operable: false }), { label: 'Sync photos', isLoading: true }),
  {
    id: 'on-after-controlled-update',
    summary: '使用者通过另一个控件把它打开，没有人碰过开关',
    facts: facts({ checked: true }),
    render: () => updatedAfterMount(Switch, 'modelValue', false, true, { label: 'Sync photos' }),
  },
]

describeBinding({ spec: SWITCH_PATTERN, binding: 'Switch', role: 'switch', states: STATES, knownFailures: A11Y_KNOWN_FAILURES })
