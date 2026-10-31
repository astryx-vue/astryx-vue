import type { LexicalEditor } from 'lexical'
import { TableNode } from '@lexical/table'

interface Tracked {
  wrapper: HTMLElement
  observer: ResizeObserver | null
}

/** 只有表格比容器宽的时候，滚动区域才占一个 Tab 停靠点。 */
function syncTabStop(wrapper: HTMLElement): void {
  if (wrapper.scrollWidth > wrapper.clientWidth)
    wrapper.tabIndex = 0
  else
    wrapper.removeAttribute('tabindex')
}

/**
 * 只读视图里没有光标，键盘没办法滚动宽表格里的内容。所以和 core `Table` 的滚动区域一样：
 * 每张表格外面的容器是一个叫「表格」的分组，只在表格溢出时才占一个 Tab 停靠点，
 * 放得下的表格不加停靠点。停靠点是显式写的，因为有的浏览器不会自己让滚动容器可聚焦。
 */
export function registerTableScrollRegion(editor: LexicalEditor, label: () => string): () => void {
  const regions = new Map<string, Tracked>()

  function release(key: string): void {
    regions.get(key)?.observer?.disconnect()
    regions.delete(key)
  }

  function track(key: string): void {
    // 开了横向滚动后，表格节点对应的 DOM 就是这个容器。
    const wrapper = editor.getElementByKey(key)
    if (!(wrapper instanceof HTMLDivElement)) {
      release(key)
      return
    }
    if (regions.get(key)?.wrapper === wrapper) {
      syncTabStop(wrapper)
      return
    }
    release(key)
    wrapper.setAttribute('role', 'group')
    wrapper.setAttribute('aria-label', label())
    let observer: ResizeObserver | null = null
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(() => syncTabStop(wrapper))
      // 容器随外面的容器变，表格随内容变，两个都要看。
      observer.observe(wrapper)
      const table = wrapper.querySelector(':scope > table')
      if (table !== null)
        observer.observe(table)
    }
    regions.set(key, { wrapper, observer })
    syncTabStop(wrapper)
  }

  const stop = editor.registerMutationListener(TableNode, (mutations) => {
    for (const [key, mutation] of mutations) {
      if (mutation === 'destroyed')
        release(key)
      else
        track(key)
    }
  }, { skipInitialization: false })

  return () => {
    stop()
    for (const key of [...regions.keys()])
      release(key)
  }
}
