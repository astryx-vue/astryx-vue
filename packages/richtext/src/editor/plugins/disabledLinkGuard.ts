// 禁用的编辑器里，链接不进 Tab 顺序，点击和回车也不跳转。
// Enter on a focused link and a screen reader's activation arrive as a click.
// A middle click arrives as auxclick.

import type { LexicalEditor } from 'lexical'

function preventLinkActivation(event: MouseEvent): void {
  if (event.target instanceof Element && event.target.closest('a[href]')) {
    event.preventDefault()
  }
}

/**
 * Guards the links under one root element. It records the links it changes,
 * so it restores only those.
 */
function createLinkGuard(root: HTMLElement): { guard: () => void, release: () => void } {
  const guarded = new Set<Element>()
  const guard = (): void => {
    for (const link of root.querySelectorAll('a[href]')) {
      if (!guarded.has(link)) {
        guarded.add(link)
        link.setAttribute('tabindex', '-1')
        // Assistive technology announces each link as disabled. Only the
        // link ignores the pointer, so a wide table still scrolls.
        link.setAttribute('aria-disabled', 'true')
        if (link instanceof HTMLElement) {
          link.style.pointerEvents = 'none'
        }
      }
    }
  }
  guard()
  root.addEventListener('click', preventLinkActivation, true)
  root.addEventListener('auxclick', preventLinkActivation, true)
  return {
    guard,
    release() {
      for (const link of guarded) {
        link.removeAttribute('tabindex')
        link.removeAttribute('aria-disabled')
        if (link instanceof HTMLElement) {
          link.style.removeProperty('pointer-events')
        }
      }
      guarded.clear()
      root.removeEventListener('click', preventLinkActivation, true)
      root.removeEventListener('auxclick', preventLinkActivation, true)
    },
  }
}

/** 禁用期间守住编辑器里的链接；返回的函数撤销这一切。 */
export function registerDisabledLinkGuard(editor: LexicalEditor): () => void {
  let linkGuard: ReturnType<typeof createLinkGuard> | null = null
  const unregisterRoot = editor.registerRootListener((next) => {
    linkGuard?.release()
    linkGuard = next == null ? null : createLinkGuard(next)
  })
  // 新文档或改过的文档会渲染出新的链接元素。
  const unregisterUpdate = editor.registerUpdateListener(() => {
    linkGuard?.guard()
  })
  return () => {
    unregisterUpdate()
    unregisterRoot()
    linkGuard?.release()
  }
}
