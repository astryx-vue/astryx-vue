// 按钮类组件绑定 button 契约（happy-dom 快速通道）。
// 状态清单照上游 Button/__tests__/Button.a11y.states.ts，覆盖五个采用者：
// Button、IconButton、ClickableCard、SideNavCollapseButton、ChatSendButton。
// ToggleButton 带 aria-pressed，属于 toggle-button 模式，这里只检查它没有被当成普通按钮遗漏（见文件末尾）。
import type { BindingState, ButtonStateFacts } from '../../test-support/a11y'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { BUTTON_PATTERN, describeBinding } from '../../test-support/a11y'
import { A11Y_KNOWN_FAILURES } from '../../test-support/a11y/known-failures'
import { mountAndFind } from '../../test-support/a11y/vue'
import ChatSendButton from '../Chat/ChatSendButton.vue'
import ClickableCard from '../ClickableCard/ClickableCard.vue'
import IconButton from '../IconButton/IconButton.vue'
import SideNavCollapseButton from '../SideNav/SideNavCollapseButton.vue'
import ToggleButton from '../ToggleButton/ToggleButton.vue'
import Button from './Button.vue'

const BASE: ButtonStateFacts = { operable: true, focusable: true, unavailable: false, described: false }

function facts(overrides: Partial<ButtonStateFacts> = {}): ButtonStateFacts {
  return { ...BASE, ...overrides }
}

type State = BindingState<ButtonStateFacts>

const ICON = () => h('span', { 'aria-hidden': 'true' }, '×')
const DISABLED = facts({ operable: false, focusable: false, unavailable: true })

const BUTTON_STATES: readonly State[] = [
  { id: 'button-text', summary: '默认：用看得见的文字命名', facts: facts(), render: activate => h(Button, { label: 'Save changes', onClick: activate }) },
  { id: 'button-icon-only', summary: '只有图标，label 就是可访问名称', facts: facts(), render: activate => h(Button, { label: 'Delete conversation', isIconOnly: true, onClick: activate }, { icon: ICON }) },
  { id: 'button-composed-label', summary: '默认插槽渲染可见内容，label 另给可访问名称', facts: facts(), render: activate => h(Button, { label: 'Save changes', onClick: activate }, () => 'Save changes') },
  { id: 'button-disabled', summary: '硬禁用：不可用，也不在 Tab 顺序里', facts: DISABLED, render: activate => h(Button, { label: 'Save changes', isDisabled: true, onClick: activate }) },
  { id: 'button-disabled-with-tooltip', summary: '带提示的禁用：仍可聚焦，不可用的原因能被读到', facts: facts({ operable: false, unavailable: true, described: true }), render: activate => h(Button, { label: 'Save changes', isDisabled: true, tooltip: 'Fill in every required field first', onClick: activate }) },
  { id: 'button-loading', summary: '等待自己发起的动作：不可用，按上游约定仍应可聚焦', facts: facts({ operable: false, unavailable: true }), render: activate => h(Button, { label: 'Save changes', isLoading: true, onClick: activate }) },
]

const ICON_BUTTON_STATES: readonly State[] = [
  { id: 'icon-button', summary: '只用 label 命名的图标按钮', facts: facts(), render: activate => h(IconButton, { label: 'Delete conversation', onClick: activate }, ICON) },
  { id: 'icon-button-disabled', summary: '禁用的图标按钮', facts: DISABLED, render: activate => h(IconButton, { label: 'Delete conversation', isDisabled: true, onClick: activate }, ICON) },
  { id: 'icon-button-loading', summary: '等待中的图标按钮', facts: facts({ operable: false, unavailable: true }), render: activate => h(IconButton, { label: 'Delete conversation', isLoading: true, onClick: activate }, ICON) },
]

const CARD_STATES: readonly State[] = [
  { id: 'clickable-card', summary: '整张卡片执行动作，靠藏起来的按钮承担角色和名字', facts: facts(), render: activate => h(ClickableCard, { label: 'Open billing settings', onClick: activate }, () => h('div', 'Billing')) },
  { id: 'clickable-card-disabled', summary: '禁用的动作卡片', facts: DISABLED, render: activate => h(ClickableCard, { label: 'Open billing settings', isDisabled: true, onClick: activate }, () => h('div', 'Billing')) },
]

const COLLAPSE_STATES: readonly State[] = [
  { id: 'sidenav-collapse-icon', summary: '默认的收起按钮：只有图标，名字说明会把侧栏往哪边收', facts: facts(), render: activate => h(SideNavCollapseButton, { 'isCollapsed': false, 'onUpdate:isCollapsed': activate }) },
  { id: 'sidenav-collapse-labelled', summary: '给了自己的 label 的收起按钮', facts: facts(), render: activate => h(SideNavCollapseButton, { 'isCollapsed': false, 'label': 'Collapse sidebar', 'onUpdate:isCollapsed': activate }) },
]

const CHAT_STATES: readonly State[] = [
  { id: 'chat-send', summary: '可以发送的发送按钮', facts: facts(), render: activate => h(ChatSendButton, { isDisabled: false, onSend: activate }) },
  { id: 'chat-send-disabled', summary: '没东西可发时的发送按钮', facts: DISABLED, render: activate => h(ChatSendButton, { isDisabled: true, onSend: activate }) },
  { id: 'chat-send-stop', summary: '回复生成中变成「停止」：换了动作和名字，必须仍能按', facts: facts(), render: activate => h(ChatSendButton, { isStopShown: true, onStop: activate }) },
]

const ADOPTERS: readonly [string, readonly State[]][] = [
  ['Button', BUTTON_STATES],
  ['IconButton', ICON_BUTTON_STATES],
  ['ClickableCard', CARD_STATES],
  ['SideNavCollapseButton', COLLAPSE_STATES],
  ['ChatSendButton', CHAT_STATES],
]

for (const [binding, states] of ADOPTERS)
  describeBinding({ spec: BUTTON_PATTERN, binding, role: 'button', states, knownFailures: A11Y_KNOWN_FAILURES, countsActivations: true })

// 看起来像按钮、但按设计归别的模式的部分。确认它们真的呈现那个角色，免得排除理由悄悄变错。
describe('button 模式的排除项', () => {
  it.each([
    ['给了 href 的 Button 是链接', () => h(Button, { label: 'Read the guide', href: '#guide' }), 'link'],
    ['给了 href 的 ClickableCard 是链接', () => h(ClickableCard, { label: 'Open billing settings', href: '#billing' }, () => h('div', 'Billing')), 'link'],
  ] as const)('%s', async (_name, render, role) => {
    expect(await mountAndFind(render, role, element => element != null)).toBe(true)
  })

  it('toggleButton 带 aria-pressed，归 toggle-button 模式', async () => {
    expect(await mountAndFind(() => h(ToggleButton, { label: 'Bold' }), 'button', element => element?.getAttribute('aria-pressed'))).toBe('false')
  })
})
