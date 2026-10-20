/**
 * checkbox 契约的自测夹具，照搬上游 `checkbox.fixtures.ts` 的状态和违规清单。
 */
import type { Fixture, FixtureSet } from '../fixtures'
import type { CheckboxStateFacts } from './checkbox'
import { SUBJECT_ATTRIBUTE } from '../fixtures'

const BASE: CheckboxStateFacts = { role: 'checkbox', checked: false, operable: true, focusable: true, disabled: false, description: null, readOnly: false, required: false, invalid: false }

function facts(overrides: Partial<CheckboxStateFacts> = {}): CheckboxStateFacts {
  return { ...BASE, ...overrides }
}

function nativeCheckbox(attributes = ''): string {
  return `<label for="fx">Notifications</label><input id="fx" ${SUBJECT_ATTRIBUTE} type="checkbox"${attributes ? ` ${attributes}` : ''}>`
}

function divCheckbox(attributes: string, body = 'Notifications'): string {
  return `<div ${SUBJECT_ATTRIBUTE} role="checkbox" ${attributes}>${body}</div>`
}

const HINT = 'Sends a notification for every mention.'
const FLIP = `this.setAttribute('aria-checked', this.getAttribute('aria-checked') === 'true' ? 'false' : 'true')`
const TOGGLE_ON_CLICK = `onclick="${FLIP}"`
const TOGGLE_ON_SPACE = `onkeydown="if (event.key === ' ') { event.preventDefault(); ${FLIP}; }"`
const REFUSE = `onclick="event.preventDefault()" onkeydown="if (event.key === ' ') { event.preventDefault(); }"`

const FIXTURES: readonly Fixture<CheckboxStateFacts>[] = [
  { id: 'conforming-menuitem', summary: '菜单里的勾选项，焦点由菜单管理', facts: facts({ role: 'menuitemcheckbox', focusable: false }), html: `<div ${SUBJECT_ATTRIBUTE} role="menuitemcheckbox" tabindex="-1" aria-checked="false" ${TOGGLE_ON_CLICK}>Notifications</div>` },
  { id: 'conforming-off', summary: '有标签的原生复选框，未勾选', facts: facts(), html: nativeCheckbox() },
  { id: 'conforming-on', summary: '同一个复选框，已勾选', facts: facts({ checked: true }), html: nativeCheckbox('checked') },
  {
    id: 'conforming-mixed',
    summary: '部分勾选的三态复选框',
    facts: facts({ checked: 'mixed' }),
    html: divCheckbox(`tabindex="0" aria-checked="mixed" onclick="const state = this.getAttribute('aria-checked'); this.setAttribute('aria-checked', state === 'mixed' ? 'true' : state === 'true' ? 'false' : 'true')" onkeydown="if (event.key === ' ') { event.preventDefault(); this.click(); }"`),
  },
  { id: 'conforming-described', summary: '挂了说明文字', facts: facts({ description: HINT }), html: `<p id="hint">${HINT}</p>${nativeCheckbox('aria-describedby="hint"')}` },
  { id: 'conforming-label-hidden', summary: '只给读屏软件命名', facts: facts(), html: `<input ${SUBJECT_ATTRIBUTE} type="checkbox" aria-label="Notifications">` },
  { id: 'conforming-disabled', summary: '原生禁用', facts: facts({ disabled: true, operable: false, focusable: false }), html: nativeCheckbox('disabled') },
  { id: 'conforming-focusable-disabled', summary: '不可用但留在 Tab 顺序里，拒绝鼠标和键盘改动', facts: facts({ disabled: true, operable: false }), html: nativeCheckbox(`aria-disabled="true" ${REFUSE}`) },
  { id: 'conforming-pending', summary: '不禁用但拒绝改动', facts: facts({ operable: false }), html: nativeCheckbox(REFUSE) },
  { id: 'conforming-readonly', summary: '只读，能聚焦但不变', facts: facts({ readOnly: true, operable: false }), html: nativeCheckbox(`aria-readonly="true" ${REFUSE}`) },
  { id: 'conforming-required', summary: '必填（未勾选时约束校验不通过，也会被报成无效）', facts: facts({ required: true, invalid: true }), html: nativeCheckbox('required') },
  { id: 'conforming-invalid', summary: '报告了错误', facts: facts({ invalid: true }), html: nativeCheckbox('aria-invalid="true"') },

  { id: 'violating-unnamed', summary: '完全没有标签', facts: facts(), html: `<input ${SUBJECT_ATTRIBUTE} type="checkbox">` },
  { id: 'violating-name-mismatch', summary: 'aria-label 盖掉了可见标签', facts: facts(), html: nativeCheckbox('aria-label="Toggle"') },
  { id: 'violating-down-event-toggle', summary: '按下那一刻就切换', facts: facts(), html: divCheckbox(`tabindex="0" aria-checked="false" onpointerdown="${FLIP}" ${TOGGLE_ON_SPACE}`) },
  { id: 'violating-focus-moves-on-change', summary: '一勾选就把焦点甩走', facts: facts(), html: `${nativeCheckbox(`onchange="document.getElementById('after').focus()"`)}<button id="after" type="button">After</button>` },
  { id: 'violating-checkbox-role', summary: '报成了开关', facts: facts(), html: `<label for="fx">Notifications</label><input id="fx" ${SUBJECT_ATTRIBUTE} type="checkbox" role="switch">` },
  { id: 'violating-generic-element', summary: '没有角色也没有状态', facts: facts({ operable: false, focusable: false }), html: `<div ${SUBJECT_ATTRIBUTE} tabindex="0">Notifications</div>` },
  { id: 'violating-state-mismatch', summary: '画的是已勾选，报的是未勾选', facts: facts({ checked: true, operable: false, focusable: false }), html: divCheckbox('tabindex="0" aria-checked="false"') },
  { id: 'violating-mixed-state-mismatch', summary: '部分勾选被报成未勾选', facts: facts({ checked: 'mixed', operable: false, focusable: false }), html: divCheckbox('tabindex="0" aria-checked="false"') },
  { id: 'violating-dangling-description', summary: 'aria-describedby 指向不存在的 id', facts: facts({ description: HINT }), html: nativeCheckbox('aria-describedby="hint"') },
  { id: 'violating-empty-description', summary: 'aria-describedby 指向空元素', facts: facts({ description: HINT }), html: `<p id="hint"></p>${nativeCheckbox('aria-describedby="hint"')}` },
  { id: 'violating-wrong-description', summary: 'aria-describedby 指向无关的文字', facts: facts({ description: HINT }), html: `<p id="hint">This text describes a different control.</p>${nativeCheckbox('aria-describedby="hint"')}` },
  { id: 'violating-inert', summary: '怎么按都不变', facts: facts(), html: divCheckbox('tabindex="0" aria-checked="false"') },
  { id: 'violating-one-way', summary: '能勾上、取消不了', facts: facts(), html: divCheckbox(`tabindex="0" aria-checked="false" onclick="this.setAttribute('aria-checked', 'true')" onkeydown="if (event.key === ' ') { event.preventDefault(); this.setAttribute('aria-checked', 'true'); }"`) },
  { id: 'violating-pointer-only', summary: '只认鼠标不认键盘', facts: facts(), html: divCheckbox(`tabindex="0" aria-checked="false" ${TOGGLE_ON_CLICK}`) },
  { id: 'violating-unreachable', summary: '不在 Tab 顺序里', facts: facts(), html: divCheckbox(`aria-checked="false" ${TOGGLE_ON_CLICK} ${TOGGLE_ON_SPACE}`) },
  { id: 'violating-declared-unavailable-unreachable', summary: '承诺可聚焦却原生禁用', facts: facts({ disabled: true, operable: false }), html: nativeCheckbox('disabled') },
  { id: 'violating-keyboard-trap', summary: '吞掉离开用的 Tab', facts: facts(), html: nativeCheckbox(`onkeydown="if (event.key === 'Tab') { event.preventDefault(); }"`) },
  { id: 'violating-disabled-overexposed', summary: '可用却被报成不可用', facts: facts({ focusable: false, operable: false }), html: nativeCheckbox('disabled') },
  { id: 'violating-disabled-unexposed', summary: '拒绝改动却不说自己不可用', facts: facts({ disabled: true, operable: false }), html: nativeCheckbox(`onclick="event.preventDefault()"`) },
  { id: 'violating-disabled-operable', summary: '标了不可用却还能改', facts: facts({ disabled: true, operable: false }), html: nativeCheckbox('aria-disabled="true"') },
  { id: 'violating-required-unexposed', summary: '必须勾选却不声明', facts: facts({ required: true }), html: nativeCheckbox() },
  { id: 'violating-readonly-unexposed', summary: '只读却不声明', facts: facts({ readOnly: true, operable: false }), html: nativeCheckbox(REFUSE) },
  { id: 'violating-readonly-overexposed', summary: '能改却被声明只读', facts: facts(), html: nativeCheckbox('aria-readonly="true"') },
  { id: 'violating-required-overexposed', summary: '不是必填却声明必填', facts: facts({ checked: true }), html: nativeCheckbox('checked required') },
  { id: 'violating-invalid-overexposed', summary: '没出错却被报成无效', facts: facts(), html: nativeCheckbox('aria-invalid="true"') },
  { id: 'violating-invalid-unexposed', summary: '出错了却不说', facts: facts({ invalid: true }), html: nativeCheckbox() },
]

export const CHECKBOX_FIXTURES: FixtureSet<CheckboxStateFacts> = {
  fixtures: FIXTURES,
  mutations: {
    'checkbox.role.exposed': ['violating-checkbox-role', 'violating-generic-element'],
    'checkbox.name.exposed': ['violating-unnamed'],
    'checkbox.name.matches-visible-label': ['violating-name-mismatch'],
    'checkbox.state.exposed': ['violating-state-mismatch', 'violating-mixed-state-mismatch', 'violating-generic-element'],
    'checkbox.description.resolvable': ['violating-dangling-description', 'violating-wrong-description'],
    'checkbox.description.exposed': ['violating-empty-description', 'violating-wrong-description'],
    'checkbox.disabled.exposed': ['violating-disabled-unexposed'],
    'checkbox.disabled.not-exposed': ['violating-disabled-overexposed'],
    'checkbox.readonly.declared': ['violating-readonly-unexposed'],
    'checkbox.readonly.not-declared': ['violating-readonly-overexposed'],
    'checkbox.required.declared': ['violating-required-unexposed'],
    'checkbox.required.not-declared': ['violating-required-overexposed'],
    'checkbox.invalid.exposed': ['violating-invalid-unexposed'],
    'checkbox.invalid.not-exposed': ['violating-invalid-overexposed'],
    'checkbox.state.pointer-round-trip': ['violating-inert', 'violating-one-way'],
    'checkbox.state.space-round-trip': ['violating-pointer-only', 'violating-one-way'],
    'checkbox.state.survives-an-aborted-press': ['violating-down-event-toggle'],
    'checkbox.state.keeps-focus-on-change': ['violating-focus-moves-on-change', 'violating-inert'],
    'checkbox.focus.reachable-and-escapable': ['violating-unreachable', 'violating-keyboard-trap'],
    'checkbox.focus.declared-inoperable-reachable': ['violating-declared-unavailable-unreachable'],
    'checkbox.state.inoperable': ['violating-disabled-operable'],
  },
}
