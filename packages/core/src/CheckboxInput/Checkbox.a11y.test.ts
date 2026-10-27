// 复选框类组件绑定 checkbox 契约（happy-dom 快速通道）。
// 状态清单照上游 CheckboxInput/__tests__/Checkbox.a11y.states.ts，覆盖四个采用者：
// CheckboxInput、CheckboxListItem、DropdownMenuCheckboxItem、SelectableCard。
import type { BindingState, CheckboxStateFacts } from '../../test-support/a11y'
import { h } from 'vue'
import { CHECKBOX_PATTERN, controlled, describeBinding } from '../../test-support/a11y'
import { A11Y_KNOWN_FAILURES } from '../../test-support/a11y/known-failures'
import CheckboxList from '../CheckboxList/CheckboxList.vue'
import CheckboxListItem from '../CheckboxList/CheckboxListItem.vue'
import DropdownMenu from '../DropdownMenu/DropdownMenu.vue'
import DropdownMenuCheckboxItem from '../DropdownMenu/DropdownMenuCheckboxItem.vue'
import FormLayout from '../FormLayout/FormLayout.vue'
import List from '../List/List.vue'
import SelectableCard from '../SelectableCard/SelectableCard.vue'
import CheckboxInput from './CheckboxInput.vue'

const BASE: CheckboxStateFacts = { role: 'checkbox', checked: false, operable: true, focusable: true, disabled: false, description: null, readOnly: false, required: false, invalid: false }

function facts(overrides: Partial<CheckboxStateFacts> = {}): CheckboxStateFacts {
  return { ...BASE, ...overrides }
}

function menuFacts(overrides: Partial<CheckboxStateFacts> = {}): CheckboxStateFacts {
  return facts({ role: 'menuitemcheckbox', focusable: false, ...overrides })
}

type State = BindingState<CheckboxStateFacts>

function input(id: string, summary: string, stateFacts: CheckboxStateFacts, props: Record<string, unknown>): State {
  const { modelValue = false, ...rest } = props
  return { id, summary, facts: stateFacts, render: () => controlled(CheckboxInput, 'modelValue', modelValue, rest) }
}

function listItem(id: string, summary: string, stateFacts: CheckboxStateFacts, props: Record<string, unknown>): State {
  const { isChecked = false, ...rest } = props
  return { id, summary, facts: stateFacts, render: () => h(List, null, () => controlled(CheckboxListItem, 'isChecked', isChecked, rest, { event: 'check' })) }
}

function inList(id: string, summary: string, stateFacts: CheckboxStateFacts, listProps: Record<string, unknown>): State {
  const { modelValue = [], ...rest } = listProps
  return {
    id,
    summary,
    facts: stateFacts,
    render: () => controlled(CheckboxList, 'modelValue', modelValue, { label: 'Notification methods', ...rest }, { slots: { default: () => h(CheckboxListItem, { label: 'Email', value: 'email' }) } }),
  }
}

function menuItem(id: string, summary: string, stateFacts: CheckboxStateFacts, props: Record<string, unknown>): State {
  const { modelValue = false, ...rest } = props
  return {
    id,
    summary,
    facts: stateFacts,
    render: () => h(DropdownMenu, { button: { label: 'View options' }, isMenuOpen: true }, () => controlled(DropdownMenuCheckboxItem, 'modelValue', modelValue, { label: 'Show archived', ...rest })),
  }
}

function card(id: string, summary: string, stateFacts: CheckboxStateFacts, props: Record<string, unknown>): State {
  const { isSelected = false, ...rest } = props
  return { id, summary, facts: stateFacts, render: () => controlled(SelectableCard, 'isSelected', isSelected, { label: 'Analytics', ...rest }, { slots: { default: () => h('span', 'Analytics') } }) }
}

const STATES: readonly State[] = [
  input('input-unchecked', '默认：有可见标签、未勾选', facts(), { label: 'Email notifications' }),
  input('input-checked', '同一个复选框，已勾选', facts({ checked: true }), { label: 'Email notifications', modelValue: true }),
  input('input-mixed', '「全选」处于部分勾选', facts({ checked: 'mixed' }), { label: 'Select all notifications', modelValue: 'indeterminate' }),
  input('input-described', '挂了说明文字', facts({ description: 'Help improve the product' }), { label: 'Share usage data', description: 'Help improve the product' }),
  input('input-hidden-label', '标签只给读屏软件', facts(), { label: 'Select row', isLabelHidden: true }),
  input('input-disabled', '原生禁用，不在 Tab 顺序里', facts({ operable: false, focusable: false, disabled: true }), { label: 'Managed setting', isDisabled: true }),
  input('input-disabled-with-message', '不可用但仍可聚焦，原因挂在控件上', facts({ operable: false, disabled: true, description: 'Managed by your administrator' }), { label: 'Managed setting', isDisabled: true, disabledMessage: 'Managed by your administrator' }),
  input('input-loading', '忙碌中：可聚焦但拒绝再改', facts({ operable: false }), { label: 'Email notifications', isLoading: true }),
  input('input-read-only', '只读：可聚焦但不能改', facts({ checked: true, operable: false, readOnly: true }), { label: 'Policy acknowledged', modelValue: true, isReadOnly: true }),
  input('input-required', '声明必填（未勾选时约束校验不通过）', facts({ required: true, invalid: true }), { label: 'Accept terms', isRequired: true }),
  {
    id: 'input-inherited-required-valid',
    summary: '从 FormLayout 继承必填，只写 aria-required、不触发原生校验',
    facts: facts({ required: true }),
    render: () => h(FormLayout, { defaultOptionality: 'required' }, () => controlled(CheckboxInput, 'modelValue', false, { label: 'Marketing consent' })),
  },
  input('input-invalid', '当前值有错误', facts({ invalid: true, description: 'You must accept the terms' }), { label: 'Accept terms', status: { type: 'error', message: 'You must accept the terms' } }),
  input('input-warning', '有警告说明，但值有效', facts({ description: 'This setting affects all workspaces' }), { label: 'Enable sharing', status: { type: 'warning', message: 'This setting affects all workspaces' } }),
  input('input-success', '有成功说明，值有效', facts({ checked: true, description: 'Preference saved' }), { label: 'Email notifications', modelValue: true, status: { type: 'success', message: 'Preference saved' } }),

  listItem('list-item-unchecked', '独立的列表项', facts(), { label: 'Email' }),
  inList('list-item-checked', '受控 CheckboxList 里已勾选的一项', facts({ checked: true }), { modelValue: ['email'] }),
  listItem('list-item-mixed', '部分勾选的独立列表项', facts({ checked: 'mixed' }), { label: 'Select all', isChecked: 'indeterminate' }),
  listItem('list-item-described', '有可见说明文字的列表项', facts({ description: 'Receive notifications by email' }), { label: 'Email', description: 'Receive notifications by email' }),
  listItem('list-item-disabled', '单独禁用的列表项', facts({ operable: false, focusable: false, disabled: true }), { label: 'SMS', isDisabled: true }),
  listItem('list-item-loading', '忙碌中的列表项：可聚焦但拒绝再改', facts({ operable: false }), { label: 'Push notifications', isLoading: true }),
  inList('list-item-read-only', '只读 CheckboxList 里的一项', facts({ checked: true, operable: false, readOnly: true }), { modelValue: ['email'], isReadOnly: true }),
  inList('list-item-group-disabled-with-message', '整组不可用并给了原因，每项仍可聚焦', facts({ checked: true, operable: false, disabled: true }), { modelValue: ['email'], isDisabled: true, disabledMessage: 'Managed by your administrator' }),

  menuItem('menu-item-unchecked', '菜单里未勾选的一项；菜单契约负责组合焦点和按键', menuFacts(), {}),
  menuItem('menu-item-checked', '菜单里已勾选的一项', menuFacts({ checked: true }), { modelValue: true }),
  menuItem('menu-item-described', '带第二行说明的菜单项', menuFacts(), { description: 'Include unpublished items' }),
  menuItem('menu-item-disabled', '不可用的菜单项', menuFacts({ operable: false, disabled: true }), { isDisabled: true }),

  card('card-unchecked', '可单独选择的卡片，未选', facts(), {}),
  card('card-checked', '同一张卡片，已选', facts({ checked: true }), { isSelected: true }),
  card('card-disabled', '不可用的卡片；上游公开约定它仍可用键盘到达', facts({ operable: false, disabled: true }), { isDisabled: true }),
]

const BINDINGS = ['CheckboxInput', 'CheckboxListItem', 'DropdownMenuCheckboxItem', 'SelectableCard'] as const
const PREFIX: Record<(typeof BINDINGS)[number], string> = { CheckboxInput: 'input-', CheckboxListItem: 'list-item-', DropdownMenuCheckboxItem: 'menu-item-', SelectableCard: 'card-' }

for (const binding of BINDINGS) {
  describeBinding({
    spec: CHECKBOX_PATTERN,
    binding,
    role: facts => facts.role,
    states: STATES.filter(state => state.id.startsWith(PREFIX[binding])),
    knownFailures: A11Y_KNOWN_FAILURES,
  })
}
