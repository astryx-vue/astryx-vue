import { isDisabledControl } from '../../utils/controlKind.js'
import { INTERACTIVE_SELECTORS } from '../useClickableContainer.js'

/**
 * @file touchTriggerRules.ts
 * @output isActionTrigger、tapLandsOnDisabledControl：一次轻点该交给触发器自己，还是打开浮层
 * @position useTouchTrigger 和 Tooltip 共用的触屏判断规则
 */

/**
 * 表示「激活它会做事」的 ARIA role。显式 role 优先于标签名：
 * `<button role="presentation">` 只是布景，`<span role="button">` 才是真控件。
 */
const ACTION_ROLES = new Set([
  'button',
  'checkbox',
  'combobox',
  'link',
  'menuitem',
  'menuitemcheckbox',
  'menuitemradio',
  'option',
  'radio',
  'searchbox',
  'slider',
  'spinbutton',
  'switch',
  'tab',
  'textbox',
])

/**
 * 激活这个元素是不是「做了别的事」，而不是「显示浮层」。
 *
 * 比「可聚焦」窄是有意的：纯文字 Tooltip 的触发器带 `tabindex=0`，
 * 键盘用户要能聚焦它读提示，但它本身没有动作。
 *
 * 禁用的控件（`aria-disabled`）不做事：轻点它可以打开解释「为什么禁用」的浮层。
 * 标签靠操作它的控件做事，所以禁用控件的标签也不算动作。
 *
 * 返回 true 只决定「浮层不开」，那一下点击本身不会被吞掉：这里不调
 * `preventDefault`，也不调 `stopPropagation`。
 */
export function isActionTrigger(element: HTMLElement): boolean {
  if (isDisabledControl(element))
    return false
  const role = element.getAttribute('role')
  if (role != null && role !== '')
    return ACTION_ROLES.has(role)

  switch (element.tagName) {
    case 'LABEL': {
      const control = (element as HTMLLabelElement).control
      return control == null || !isDisabledControl(control)
    }
    case 'BUTTON':
    case 'INPUT':
    case 'SELECT':
    case 'SUMMARY':
    case 'TEXTAREA':
      return true
    case 'A':
    case 'AREA':
      return element.hasAttribute('href')
    default:
      return isEditable(element)
  }
}

/** 这个元素自己接下轻点，像禁用控件那样：禁用的控件，或禁用控件的标签。 */
function isDisabledTarget(element: Element): boolean {
  if (isDisabledControl(element))
    return true
  if (element.tagName === 'LABEL') {
    const control = (element as HTMLLabelElement).control
    return control != null && isDisabledControl(control)
  }
  return false
}

function isTapTarget(element: Element): boolean {
  return element.matches(INTERACTIVE_SELECTORS) || element.tagName === 'LABEL' || isDisabledControl(element)
}

/**
 * 轻点是不是落在一个禁用控件上：从被点的元素往外走，最近的可交互元素是禁用控件
 * （或禁用控件的标签）。这一下归它：浮层打开讲出禁用原因，什么都不会被激活。
 * 其它轻点交给触发器自己决定（`isActionTrigger`）。
 */
export function tapLandsOnDisabledControl(tapped: Element): boolean {
  const body = tapped.ownerDocument.body
  for (let node: Element | null = tapped; node != null && node !== body; node = node.parentElement) {
    if (isTapTarget(node))
      return isDisabledTarget(node)
  }
  return false
}

function isEditable(element: HTMLElement): boolean {
  if (element.isContentEditable === true)
    return true
  const attribute = element.getAttribute('contenteditable')
  return attribute != null && attribute !== 'false'
}
