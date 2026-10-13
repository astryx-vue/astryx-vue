import type { Ref } from 'vue'

/**
 * 对应原版 Astryx 的 `hooks/useClickableContainer`。
 *
 * 让整块容器可点，同时把点在嵌套按钮、链接、输入框上的点击留给那些控件自己。
 * ClickableCard 和 SelectableCard 都走这里，避免两套“点到谁算谁”的判断。
 */

export const INTERACTIVE_SELECTORS = [
  'button',
  'a',
  'input',
  'select',
  'textarea',
  '[role="button"]',
  '[role="link"]',
  '[role="checkbox"]',
  '[role="radio"]',
  '[role="switch"]',
  '[role="tab"]',
  '[role="menuitem"]',
  '[role="option"]',
  '[role="combobox"]',
  '[role="listbox"]',
  '[role="slider"]',
  '[role="spinbutton"]',
  '[data-pressable-container]',
].join(',')

const NON_INTERACTIVE_SELECTORS = '[aria-readonly="true"]'

export interface UseClickableContainerOptions {
  /** 外层容器。 */
  containerRef: Ref<HTMLElement | null>
  /** 容器里真正获得键盘焦点的控件，例如视觉上隐藏的链接或复选框。 */
  interactiveRef?: Ref<HTMLElement | null>
  /** 点在容器表面上时调用。 */
  onClick?: (event: MouseEvent) => void
  /** 有地址时，点表面会导航到这里。 */
  href?: string
  /** 链接的 target。`_blank` 会在新标签打开。 */
  target?: string
  /** 停用后，表面点击和中键都不再响应。 */
  disabled?: boolean
}

export interface ClickableContainerHandlers {
  onClick: (event: MouseEvent) => void
  onMouseUp: (event: MouseEvent) => void
}

function hasInteractiveAncestor(element: Element, root: Element): boolean {
  let current: Element | null = element
  while (current != null && current !== root && current !== document.body) {
    if (current.matches(INTERACTIVE_SELECTORS) && !current.matches(NON_INTERACTIVE_SELECTORS))
      return true
    current = current.parentElement
  }
  return false
}

function hasTextSelection(node: Element): boolean {
  if (typeof document === 'undefined' || document.getSelection == null)
    return false
  const selection = document.getSelection()
  if (selection == null || selection.isCollapsed)
    return false
  return node.contains(selection.anchorNode)
}

function openInNewTab(href: string): void {
  window.open(href, '_blank', 'noopener')
}

/**
 * 把容器的 click / mouseup 交给调用方绑到根元素上。
 * 组件挂载后会给容器加上 `data-pressable-container`，嵌套的可点容器因此不会互相抢走点击。
 */
export function useClickableContainer(options: UseClickableContainerOptions): ClickableContainerHandlers {
  function markContainer(): void {
    const container = options.containerRef.value
    if (container != null)
      container.dataset.pressableContainer = 'true'
  }

  function onClick(event: MouseEvent): void {
    markContainer()
    if (options.disabled)
      return

    const container = options.containerRef.value
    if (container == null)
      return
    if (hasTextSelection(container))
      return

    const target = event.target
    if (!(target instanceof Element))
      return
    if (target !== event.currentTarget && hasInteractiveAncestor(target, container))
      return

    options.onClick?.(event)
    if (event.defaultPrevented)
      return

    const href = options.href
    if (href != null && href !== '') {
      const openNewTab = options.target === '_blank' || event.metaKey || event.ctrlKey
      if (openNewTab) {
        openInNewTab(href)
        return
      }
      const interactive = options.interactiveRef?.value
      if (interactive != null) {
        interactive.click()
        return
      }
      window.location.assign(href)
      return
    }

    if (options.onClick == null) {
      const interactive = options.interactiveRef?.value
      if (interactive != null) {
        interactive.dispatchEvent(new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          button: event.button,
          ctrlKey: event.ctrlKey,
          metaKey: event.metaKey,
          shiftKey: event.shiftKey,
          altKey: event.altKey,
        }))
        event.stopPropagation()
      }
    }
  }

  function onMouseUp(event: MouseEvent): void {
    if (options.disabled)
      return
    const href = options.href
    if (href == null || href === '' || event.button !== 1)
      return
    const container = options.containerRef.value
    const target = event.target
    if (container == null || !(target instanceof Element))
      return
    if (target !== event.currentTarget && hasInteractiveAncestor(target, container))
      return
    openInNewTab(href)
  }

  return { onClick, onMouseUp }
}
