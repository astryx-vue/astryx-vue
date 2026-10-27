/**
 * happy-dom 环境：vitest 里的快速通道，跟着 `pnpm check` 每次都跑。
 *
 * 能直接看的层：unit、dom，以及 computed-dom。
 * computed-dom 用 dom-accessibility-api 按 W3C 的 accname 和 HTML-AAM 规则，从 DOM 推算角色、名称、描述和状态，
 * 并用它近似 accessibility-tree 层，跑出的结果会标上「近似」。
 *
 * 看不见的层：真实浏览器（焦点、按键激活、指针按下又滑开、布局可见性）。happy-dom 不会把 Space 变成一次勾选，
 * 也没有真实的 Tab 顺序，所以这些期望报 unrun，等浏览器通道接上再跑。
 */
import type { ComputedNode, EvidenceLayer, Harness, Subject, TriState } from '../harness'
import { computeAccessibleDescription, computeAccessibleName, getRole, isDisabled, isInaccessible } from 'dom-accessibility-api'
import { UnobservableError } from '../harness'

export const HAPPY_DOM_HARNESS = 'happy-dom'
export const HAPPY_DOM_OBSERVES: readonly EvidenceLayer[] = ['unit', 'dom', 'computed-dom']
export const HAPPY_DOM_APPROXIMATES = { 'accessibility-tree': 'computed-dom' } as const

function unobservable(layer: EvidenceLayer, what: string): never {
  throw new UnobservableError(HAPPY_DOM_HARNESS, layer, what)
}

function triState(value: string | null): TriState | null {
  return value === 'true' || value === 'false' || value === 'mixed' ? value : null
}

function isNativeToggle(element: Element): element is HTMLInputElement {
  return element instanceof HTMLInputElement && (element.type === 'checkbox' || element.type === 'radio')
}

/** 原生复选框和单选框按 HTML-AAM 用自身的 checked/indeterminate，别的元素读 aria-checked。 */
function checkedOf(element: Element): TriState | null {
  if (isNativeToggle(element)) {
    if (element.type === 'checkbox' && element.indeterminate)
      return 'mixed'
    return element.checked ? 'true' : 'false'
  }
  return triState(element.getAttribute('aria-checked'))
}

/** aria-invalid 或原生约束校验不通过，都算无效（Chromium 对必填但没勾的复选框也报 invalid）。 */
function invalidOf(element: Element): boolean {
  const aria = element.getAttribute('aria-invalid')
  if (aria != null && aria !== 'false')
    return true
  return element instanceof HTMLInputElement && element.willValidate && element.validity.valid === false
}

function computedOf(element: Element): ComputedNode {
  const hidden = isInaccessible(element)
  return {
    role: hidden ? null : (getRole(element) ?? null),
    name: hidden ? '' : computeAccessibleName(element),
    description: hidden ? '' : computeAccessibleDescription(element),
    pressed: triState(element.getAttribute('aria-pressed')),
    checked: checkedOf(element),
    disabled: isDisabled(element) || element.closest('fieldset[disabled]') != null,
    invalid: invalidOf(element),
    required: element.hasAttribute('required') || element.getAttribute('aria-required') === 'true',
    readOnly: element.getAttribute('aria-readonly') === 'true',
  }
}

function createSubject(element: Element): Subject {
  return {
    attribute: async name => element.getAttribute(name),
    idReferences: async (attribute) => {
      const ids = (element.getAttribute(attribute) ?? '').split(/\s+/).filter(Boolean)
      return ids.map((id) => {
        const target = element.ownerDocument.getElementById(id)
        return target == null ? null : (target.textContent ?? '').trim()
      })
    },
    textContent: async () => (element.textContent ?? '').replace(/\s+/g, ' ').trim(),
    computed: async () => computedOf(element),
    visibleLabelText: async () => unobservable('real-browser', '标签是否真的画在屏幕上'),
    isFocused: async () => unobservable('real-browser', '真实焦点'),
    focus: async () => unobservable('real-browser', '真实焦点'),
  }
}

export function createHappyDomHarness(subjectElement: Element): Harness {
  const subject = createSubject(subjectElement)
  return {
    name: HAPPY_DOM_HARNESS,
    observes: HAPPY_DOM_OBSERVES,
    approximates: HAPPY_DOM_APPROXIMATES,
    subject: async () => subject,
    click: async () => unobservable('real-browser', '真实的指针点击'),
    abortedPress: async () => unobservable('real-browser', '真实的指针按下'),
    press: async () => unobservable('real-browser', '真实的按键'),
    resetFocus: async () => unobservable('real-browser', '真实焦点'),
  }
}
