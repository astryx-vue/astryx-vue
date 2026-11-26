export const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

export function getFocusables(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
    .filter(element => !element.hasAttribute('disabled'))
}

export function focusElement(element: HTMLElement): boolean {
  try {
    element.focus()
  }
  catch {
    return false
  }
  // 读元素自己的 document：iframe、画中画窗口里的元素，焦点记在那个窗口里。
  return element.ownerDocument.activeElement === element
}

export function isFocusable(element: HTMLElement): boolean {
  if (element.hasAttribute('tabindex'))
    return element.tabIndex >= 0
  if (['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(element.tagName))
    return !(element as HTMLButtonElement).disabled
  return element.isContentEditable
}
