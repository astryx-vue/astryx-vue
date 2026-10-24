/**
 * switch 契约的自测夹具，照搬上游 `switch.fixtures.ts` 的状态和违规清单。
 * 每个合格夹具代表一种状态，每个违规夹具专门拿掉一条期望的结果。
 */
import type { Fixture, FixtureSet } from '../fixtures'
import type { SwitchStateFacts } from './switch'
import { SUBJECT_ATTRIBUTE } from '../fixtures'

const BASE: SwitchStateFacts = { checked: false, operable: true, focusable: true, disabled: false, described: false, required: false, invalid: false }

function facts(overrides: Partial<SwitchStateFacts> = {}): SwitchStateFacts {
  return { ...BASE, ...overrides }
}

/** 原生复选框加 role="switch"，APG 自己的 HTML 示例。 */
function nativeSwitch(attributes = ''): string {
  return `<label for="fx">Notifications</label><input id="fx" ${SUBJECT_ATTRIBUTE} type="checkbox" role="switch"${attributes ? ` ${attributes}` : ''}>`
}

/** div 做的开关，夹具可以故意少给原生控件自带的行为。 */
function divSwitch(attributes: string, body = 'Notifications'): string {
  return `<div ${SUBJECT_ATTRIBUTE} role="switch" ${attributes}>${body}</div>`
}

const FLIP = `this.setAttribute('aria-checked', this.getAttribute('aria-checked') === 'true' ? 'false' : 'true')`
const TOGGLE_ON_CLICK = `onclick="${FLIP}"`
const TOGGLE_ON_SPACE = `onkeydown="if (event.key === ' ') { event.preventDefault(); ${FLIP}; }"`
const TOGGLE_ON_POINTER_DOWN = `onpointerdown="${FLIP}"`
const SR_ONLY = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap'

const FIXTURES: readonly Fixture<SwitchStateFacts>[] = [
  { id: 'conforming-off', summary: '有标签的原生开关，关', facts: facts(), html: nativeSwitch() },
  { id: 'conforming-on', summary: '同一个开关，开', facts: facts({ checked: true }), html: nativeSwitch('checked') },
  { id: 'conforming-described', summary: '挂了说明文字的开关', facts: facts({ described: true }), html: `<p id="hint">Sends a notification for every mention.</p>${nativeSwitch('aria-describedby="hint"')}` },
  { id: 'conforming-label-hidden', summary: '只给读屏软件命名、画面上没有标签', facts: facts(), html: `<input ${SUBJECT_ATTRIBUTE} type="checkbox" role="switch" aria-label="Notifications">` },
  { id: 'conforming-label-sr-only', summary: '标签在，但被 sr-only 裁掉', facts: facts(), html: `<label for="fx" style="${SR_ONLY}">Notifications</label><input id="fx" ${SUBJECT_ATTRIBUTE} type="checkbox" role="switch" aria-label="Notifications">` },
  { id: 'conforming-label-hidden-by-ancestor', summary: '标签在隐藏的祖先里，名字来自 aria-label', facts: facts(), html: `<div style="visibility:hidden"><label for="fx">Notifications</label></div><input id="fx" ${SUBJECT_ATTRIBUTE} type="checkbox" role="switch" aria-label="Notifications">` },
  { id: 'conforming-disabled', summary: '原生禁用的开关', facts: facts({ disabled: true, operable: false, focusable: false }), html: nativeSwitch('disabled') },
  { id: 'conforming-pending', summary: '不禁用但拒绝改动的开关', facts: facts({ operable: false }), html: nativeSwitch(`onclick="event.preventDefault()" onkeydown="if (event.key === ' ') { event.preventDefault(); }"`) },
  { id: 'conforming-required', summary: '必填的开关', facts: facts({ required: true }), html: nativeSwitch('required') },
  { id: 'conforming-invalid', summary: '报告了错误的开关', facts: facts({ invalid: true }), html: nativeSwitch('aria-invalid="true"') },

  { id: 'violating-unnamed', summary: '完全没有标签', facts: facts(), html: `<input ${SUBJECT_ATTRIBUTE} type="checkbox" role="switch">` },
  { id: 'violating-name-mismatch', summary: 'aria-label 盖掉了可见标签', facts: facts(), html: nativeSwitch('aria-label="Toggle"') },
  {
    id: 'violating-label-changes',
    summary: '标签念的是动作，状态一变名字跟着变',
    facts: facts(),
    html: divSwitch(`tabindex="0" aria-checked="false" onclick="const on = this.getAttribute('aria-checked') !== 'true'; this.setAttribute('aria-checked', String(on)); this.textContent = on ? 'Turn off notifications' : 'Turn on notifications';" onkeydown="if (event.key === ' ') { event.preventDefault(); this.click(); }"`, 'Turn on notifications'),
  },
  { id: 'violating-down-event-toggle', summary: '按下那一刻就切换', facts: facts(), html: divSwitch(`tabindex="0" aria-checked="false" ${TOGGLE_ON_POINTER_DOWN} ${TOGGLE_ON_SPACE}`) },
  { id: 'violating-focus-moves-on-change', summary: '一切换就把焦点甩走', facts: facts(), html: `${nativeSwitch(`onchange="document.getElementById('after').focus()"`)}<button id="after" type="button">After</button>` },
  { id: 'violating-checkbox-role', summary: '没升级成开关的复选框', facts: facts(), html: `<label for="fx">Notifications</label><input id="fx" ${SUBJECT_ATTRIBUTE} type="checkbox">` },
  { id: 'violating-generic-element', summary: '没有角色也没有状态的普通元素', facts: facts({ operable: false, focusable: false }), html: `<div ${SUBJECT_ATTRIBUTE} tabindex="0">Notifications</div>` },
  { id: 'violating-state-mismatch', summary: '画的是开，报的是关', facts: facts({ checked: true, operable: false, focusable: false }), html: divSwitch('tabindex="0" aria-checked="false"') },
  { id: 'violating-dangling-description', summary: 'aria-describedby 指向不存在的 id', facts: facts({ described: true }), html: nativeSwitch('aria-describedby="hint"') },
  { id: 'violating-empty-description', summary: 'aria-describedby 指向空元素', facts: facts({ described: true }), html: `<p id="hint"></p>${nativeSwitch('aria-describedby="hint"')}` },
  { id: 'violating-inert', summary: '怎么按都不变的开关', facts: facts(), html: divSwitch('tabindex="0" aria-checked="false"') },
  { id: 'violating-one-way', summary: '能打开、关不上', facts: facts(), html: divSwitch(`tabindex="0" aria-checked="false" onclick="this.setAttribute('aria-checked', 'true')" onkeydown="if (event.key === ' ') { event.preventDefault(); this.setAttribute('aria-checked', 'true'); }"`) },
  { id: 'violating-pointer-only', summary: '只认鼠标不认键盘', facts: facts(), html: divSwitch(`tabindex="0" aria-checked="false" ${TOGGLE_ON_CLICK}`) },
  { id: 'violating-unreachable', summary: '不在 Tab 顺序里', facts: facts(), html: divSwitch(`aria-checked="false" ${TOGGLE_ON_CLICK} ${TOGGLE_ON_SPACE}`) },
  { id: 'violating-keyboard-trap', summary: '吞掉离开用的 Tab', facts: facts(), html: nativeSwitch(`onkeydown="if (event.key === 'Tab') { event.preventDefault(); }"`) },
  { id: 'violating-disabled-unexposed', summary: '拒绝改动却不说自己不可用', facts: facts({ disabled: true, operable: false }), html: nativeSwitch(`onclick="event.preventDefault()"`) },
  { id: 'violating-disabled-operable', summary: '标了不可用却还能改', facts: facts({ disabled: true, operable: false }), html: nativeSwitch('aria-disabled="true"') },
  { id: 'violating-required-unexposed', summary: '必须打开却不声明', facts: facts({ required: true }), html: nativeSwitch() },
  { id: 'violating-invalid-unexposed', summary: '出错了却不说', facts: facts({ invalid: true }), html: nativeSwitch() },
]

export const SWITCH_FIXTURES: FixtureSet<SwitchStateFacts> = {
  fixtures: FIXTURES,
  mutations: {
    'switch.role.exposed': ['violating-checkbox-role', 'violating-generic-element'],
    'switch.name.exposed': ['violating-unnamed'],
    'switch.name.matches-visible-label': ['violating-name-mismatch'],
    'switch.state.exposed': ['violating-state-mismatch', 'violating-generic-element'],
    'switch.description.resolvable': ['violating-dangling-description'],
    'switch.description.exposed': ['violating-empty-description'],
    'switch.disabled.exposed': ['violating-disabled-unexposed'],
    'switch.required.declared': ['violating-required-unexposed'],
    'switch.invalid.exposed': ['violating-invalid-unexposed'],
    'switch.state.pointer-round-trip': ['violating-inert', 'violating-one-way'],
    'switch.state.space-round-trip': ['violating-pointer-only', 'violating-one-way'],
    'switch.name.stable-across-change': ['violating-label-changes'],
    'switch.state.survives-an-aborted-press': ['violating-down-event-toggle'],
    'switch.state.keeps-focus-on-change': ['violating-focus-moves-on-change', 'violating-inert'],
    'switch.focus.reachable-and-escapable': ['violating-unreachable', 'violating-keyboard-trap'],
    'switch.state.inoperable': ['violating-disabled-operable'],
  },
}
