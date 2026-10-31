import type { LexicalEditor } from 'lexical'
import type { Ref } from 'vue'
import { onBeforeUnmount, shallowRef } from 'vue'
import { createFrameScheduler } from './nextFrame.js'

/** 一个叠加层的位置：相对于「编辑区的容器」，单位像素。 */
export interface OverlayBox {
  /** 对应的 Lexical 节点键，也用来当列表的渲染键。 */
  key: string
}

/**
 * 编辑区上面有些东西（代码块的标题栏、任务项的勾选框）不能放进可编辑的文字里，
 * 只能是编辑区的兄弟元素，画在对应文档块的上方。这个函数负责「量位置、跟着变」：
 * 文档更新、编辑区尺寸变化、窗口缩放之后，下一帧重新量一次，结果没变就不触发重画。
 *
 * `measure` 在 Lexical 的只读上下文里调用（可以用 `$` 开头的函数），
 * `origin` 是容器的位置，用来把元素的屏幕坐标换成相对容器的坐标。
 */
export function useOverlayPlacements<T extends OverlayBox>(
  editor: LexicalEditor,
  measure: (origin: DOMRect) => T[],
  isSame: (a: readonly T[], b: readonly T[]) => boolean,
): Ref<readonly T[]> {
  const placements = shallowRef<readonly T[]>([])

  const frame = createFrameScheduler(() => {
    const container = editor.getRootElement()?.parentElement ?? null
    if (container === null) {
      if (placements.value.length > 0)
        placements.value = []
      return
    }
    const origin = container.getBoundingClientRect()
    const next = editor.getEditorState().read(() => measure(origin))
    if (!isSame(placements.value, next))
      placements.value = next
  })
  const schedule = frame.schedule

  // 服务端没有这些，什么也不挂；浏览器里编辑区自己的大小变了（比如窗口缩放引起折行），位置就变了。
  const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(schedule)
  const stopRoot = editor.registerRootListener((root) => {
    observer?.disconnect()
    if (root !== null)
      observer?.observe(root)
    schedule()
  })
  const stopUpdate = editor.registerUpdateListener(schedule)
  const hasWindow = typeof window !== 'undefined'
  if (hasWindow)
    window.addEventListener('resize', schedule)
  schedule()

  onBeforeUnmount(() => {
    frame.cancel()
    observer?.disconnect()
    stopRoot()
    stopUpdate()
    if (hasWindow)
      window.removeEventListener('resize', schedule)
  })

  return placements
}
