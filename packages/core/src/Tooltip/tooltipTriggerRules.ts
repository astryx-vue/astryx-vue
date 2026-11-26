/** 自己带动作的触发器：`touchTrigger="auto"` 时轻点它不开提示。 */
const ACTION_TAGS = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA']

/** 不能输入文字的 input 类型。 */
const NON_TEXT_INPUT_TYPES = new Set(['button', 'checkbox', 'color', 'file', 'hidden', 'image', 'radio', 'range', 'reset', 'submit'])

export function matchesFocusVisible(element: Element): boolean {
  try {
    return element.matches(':focus-visible')
  }
  catch {
    return false
  }
}

export function isActionTrigger(trigger: Element): boolean {
  return ACTION_TAGS.includes(trigger.tagName)
}

export function isTextEntryControl(element: Element): boolean {
  const tag = element.tagName
  if (tag === 'TEXTAREA')
    return true
  if (tag === 'INPUT')
    return !NON_TEXT_INPUT_TYPES.has((element.getAttribute('type') ?? 'text').toLowerCase())
  return element instanceof HTMLElement && element.isContentEditable
}

function isDisabled(element: Element): boolean {
  return element.matches(':disabled') || element.getAttribute('aria-disabled') === 'true'
}

/**
 * 轻点落在触发器里的可输入控件上（文本框、多行文本框、可编辑区）时，只让它获得焦点，
 * 不开也不关提示，免得提示盖住正要输入的文字。触发器本身就是输入框、或输入框已禁用时不算。
 */
export function isTextEntryTap(trigger: HTMLElement, tapEvent: Event | null | undefined): boolean {
  const target = tapEvent?.target
  if (!(target instanceof Element))
    return false
  for (let node: Element | null = target; node != null && node !== trigger; node = node.parentElement) {
    if (isTextEntryControl(node))
      return !isDisabled(node) && trigger.contains(node)
  }
  return false
}
