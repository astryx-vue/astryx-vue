import type { CSSProperties, Ref, ShallowRef } from 'vue'
import { onBeforeUnmount, onMounted, onUpdated, shallowRef } from 'vue'

interface SelectionBox {
  x: number
  y: number
  width: number
  height: number
}

export interface SegmentedSelection {
  /** 选中块的盒子。还没量到（服务端、没有布局、没有选中）时为空，选中的分段自己画底色。 */
  box: ShallowRef<SelectionBox | null>
  /** 第一次量完之后才为真：首屏直接落在选中的分段上，不从角落滑过来。 */
  isReady: ShallowRef<boolean>
  style: () => CSSProperties | undefined
}

/**
 * 选中块是控件里的一块独立表面，每次选中的分段变了都滑到新位置，大小也跟着变。
 * 位置和大小从选中的分段量出来：分段变宽、换行、字体加载完、控件被缩放，都会重新量。
 */
export function useSegmentedSelection(root: Readonly<Ref<HTMLElement | null>>): SegmentedSelection {
  const box = shallowRef<SelectionBox | null>(null)
  const isReady = shallowRef(false)
  let observer: ResizeObserver | undefined
  let frame: number | undefined

  function measure(): void {
    const element = root.value
    const selected = element?.querySelector<HTMLElement>('[role="radio"][aria-checked="true"]')
    if (element == null || selected == null || selected.offsetWidth === 0 || selected.offsetHeight === 0) {
      box.value = null
      return
    }
    const next = { x: selected.offsetLeft, y: selected.offsetTop, width: selected.offsetWidth, height: selected.offsetHeight }
    const current = box.value
    if (current == null || current.x !== next.x || current.y !== next.y || current.width !== next.width || current.height !== next.height)
      box.value = next
  }

  onMounted(() => {
    measure()
    if (box.value != null && typeof requestAnimationFrame === 'function')
      frame = requestAnimationFrame(() => { isReady.value = true })
    if (typeof ResizeObserver !== 'undefined' && root.value != null) {
      observer = new ResizeObserver(measure)
      observer.observe(root.value)
      for (const item of root.value.querySelectorAll('[role="radio"]'))
        observer.observe(item)
    }
  })
  onUpdated(measure)
  onBeforeUnmount(() => {
    observer?.disconnect()
    if (frame != null && typeof cancelAnimationFrame === 'function')
      cancelAnimationFrame(frame)
  })

  return {
    box,
    isReady,
    style: () => {
      const current = box.value
      return current == null
        ? undefined
        : { '--_selection-x': `${current.x}px`, '--_selection-y': `${current.y}px`, '--_selection-width': `${current.width}px`, '--_selection-height': `${current.height}px` } as CSSProperties
    },
  }
}
