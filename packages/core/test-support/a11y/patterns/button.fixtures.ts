/**
 * button 契约的自测夹具，照搬上游 `button.fixtures.ts` 的状态和违规清单。
 * 夹具在 `window.__activations` 上数动作执行次数，契约通过绑定的 `activations()` 读它。
 */
import type { Fixture, FixtureSet } from '../fixtures'
import type { ButtonStateFacts } from './button'
import { COUNT_ACTIVATION, SUBJECT_ATTRIBUTE } from '../fixtures'

const BASE: ButtonStateFacts = { operable: true, focusable: true, unavailable: false, described: false }

function facts(overrides: Partial<ButtonStateFacts> = {}): ButtonStateFacts {
  return { ...BASE, ...overrides }
}

/** 原生按钮。自带 onclick 的夹具要传 counts: false，因为 HTML 只保留第一个重复属性。 */
function nativeButton(attributes = '', { label = 'Save changes', counts = true } = {}): string {
  const onClick = counts ? ` onclick="${COUNT_ACTIVATION}"` : ''
  return `<button type="button" ${SUBJECT_ATTRIBUTE}${onClick}${attributes ? ` ${attributes}` : ''}>${label}</button>`
}

function divButton(attributes: string, label = 'Save changes'): string {
  return `<div ${SUBJECT_ATTRIBUTE} role="button" ${attributes}>${label}</div>`
}

const BOTH_KEYS = `onkeydown="if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); ${COUNT_ACTIVATION}; }"`
const REFUSE = `onclick="event.preventDefault(); return false;" onkeydown="if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); }"`

const FIXTURES: readonly Fixture<ButtonStateFacts>[] = [
  { id: 'conforming-native', summary: '用自己文字命名的原生按钮', facts: facts(), html: nativeButton() },
  { id: 'conforming-div', summary: '按 APG 做法升级的 div 按钮', facts: facts(), html: divButton(`tabindex="0" onclick="${COUNT_ACTIVATION}" ${BOTH_KEYS}`) },
  { id: 'conforming-icon-only', summary: '没有文字、用 aria-label 命名', facts: facts(), html: `<button type="button" ${SUBJECT_ATTRIBUTE} onclick="${COUNT_ACTIVATION}" aria-label="Delete conversation"><span aria-hidden="true">×</span></button>` },
  { id: 'conforming-described', summary: '挂了说明文字', facts: facts({ described: true }), html: `<p id="hint">This cannot be undone.</p>${nativeButton('aria-describedby="hint"')}` },
  { id: 'conforming-unavailable-native', summary: '原生禁用，不在 Tab 顺序里', facts: facts({ operable: false, focusable: false, unavailable: true }), html: nativeButton('disabled') },
  { id: 'conforming-unavailable-focusable', summary: '不可用但留在 Tab 顺序里，并拒绝执行', facts: facts({ operable: false, unavailable: true }), html: nativeButton(`aria-disabled="true" ${REFUSE}`, { counts: false }) },
  { id: 'conforming-busy', summary: '等待中：可聚焦、报忙、拒绝再按', facts: facts({ operable: false }), html: nativeButton(`aria-busy="true" aria-disabled="true" ${REFUSE}`, { counts: false }) },

  { id: 'violating-generic-element', summary: '没有角色的普通元素', facts: facts({ operable: false, focusable: false }), html: `<div ${SUBJECT_ATTRIBUTE}>Save changes</div>` },
  { id: 'violating-link-role', summary: '用链接干按钮的活', facts: facts(), html: `<a href="#" ${SUBJECT_ATTRIBUTE} onclick="event.preventDefault(); ${COUNT_ACTIVATION}">Save changes</a>` },
  { id: 'violating-unnamed', summary: '只有图标、没有名字', facts: facts(), html: `<button type="button" ${SUBJECT_ATTRIBUTE} onclick="${COUNT_ACTIVATION}"><span aria-hidden="true">×</span></button>` },
  { id: 'violating-name-mismatch', summary: 'aria-label 盖掉了看得见的字', facts: facts(), html: nativeButton('aria-label="Submit"') },
  { id: 'violating-dangling-description', summary: 'aria-describedby 指向不存在的 id', facts: facts({ described: true }), html: nativeButton('aria-describedby="hint"') },
  { id: 'violating-empty-description', summary: 'aria-describedby 指向空元素', facts: facts({ described: true }), html: `<p id="hint"></p>${nativeButton('aria-describedby="hint"')}` },
  { id: 'violating-inert', summary: '按了什么也不做', facts: facts(), html: divButton('tabindex="0"') },
  { id: 'violating-pointer-only', summary: '只认鼠标', facts: facts(), html: divButton(`tabindex="0" onclick="${COUNT_ACTIVATION}"`) },
  { id: 'violating-enter-only', summary: '只认 Enter 不认 Space', facts: facts(), html: divButton(`tabindex="0" onclick="${COUNT_ACTIVATION}" onkeydown="if (event.key === 'Enter') { event.preventDefault(); ${COUNT_ACTIVATION}; }"`) },
  { id: 'violating-space-only', summary: '只认 Space 不认 Enter', facts: facts(), html: divButton(`tabindex="0" onclick="${COUNT_ACTIVATION}" onkeydown="if (event.key === ' ') { event.preventDefault(); ${COUNT_ACTIVATION}; }"`) },
  { id: 'violating-unreachable', summary: '不在 Tab 顺序里', facts: facts(), html: divButton(`onclick="${COUNT_ACTIVATION}" ${BOTH_KEYS}`) },
  { id: 'violating-keyboard-trap', summary: '吞掉离开用的 Tab', facts: facts(), html: nativeButton(`onkeydown="if (event.key === 'Tab') { event.preventDefault(); }"`) },
  { id: 'violating-down-event-activation', summary: '按下那一刻就执行', facts: facts(), html: divButton(`tabindex="0" onpointerdown="${COUNT_ACTIVATION}" ${BOTH_KEYS}`) },
  { id: 'violating-unavailable-unexposed', summary: '拒绝执行却不说自己不可用', facts: facts({ operable: false, unavailable: true }), html: nativeButton('onclick="event.preventDefault(); return false;"', { counts: false }) },
  { id: 'violating-unavailable-still-acts', summary: '标了不可用却还执行', facts: facts({ operable: false, unavailable: true }), html: nativeButton('aria-disabled="true"') },
  { id: 'violating-unavailable-acts-on-key', summary: '拒绝点击却响应 Enter/Space', facts: facts({ operable: false, unavailable: true }), html: nativeButton(`aria-disabled="true" onclick="event.preventDefault(); return false;" ${BOTH_KEYS}`, { counts: false }) },
  { id: 'violating-unavailable-unfocusable', summary: '声明可聚焦却原生禁用', facts: facts({ operable: false, unavailable: true }), html: nativeButton('disabled aria-disabled="true"', { counts: false }) },
  { id: 'violating-busy-unfocusable', summary: '等待中变成原生禁用，Tab 到不了', facts: facts({ operable: false }), html: nativeButton('aria-busy="true" disabled') },
]

export const BUTTON_FIXTURES: FixtureSet<ButtonStateFacts> = {
  fixtures: FIXTURES,
  mutations: {
    'button.role.exposed': ['violating-generic-element', 'violating-link-role'],
    'button.name.exposed': ['violating-unnamed'],
    'button.name.matches-visible-label': ['violating-name-mismatch'],
    'button.description.resolvable': ['violating-dangling-description'],
    'button.description.exposed': ['violating-empty-description'],
    'button.unavailable.exposed': ['violating-unavailable-unexposed'],
    'button.action.runs-on-pointer': ['violating-inert'],
    'button.action.runs-on-enter': ['violating-inert', 'violating-pointer-only', 'violating-space-only'],
    'button.action.runs-on-space': ['violating-inert', 'violating-pointer-only', 'violating-enter-only'],
    'button.action.survives-an-aborted-press': ['violating-down-event-activation'],
    'button.focus.reachable-and-escapable': ['violating-unreachable', 'violating-keyboard-trap', 'violating-busy-unfocusable'],
    'button.unavailable.inert': ['violating-unavailable-still-acts', 'violating-unavailable-acts-on-key', 'violating-unavailable-unfocusable'],
  },
}
