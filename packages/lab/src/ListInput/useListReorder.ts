import type { Ref } from 'vue'
import type { ListInputChange } from './types.js'
import { computed, nextTick, ref, watch } from 'vue'
import { moveItem } from './columns.js'

/** 指针要移动这么远才算真的在拖。 */
const POINTER_DRAG_THRESHOLD_PX = 5

export interface ListReorderState<T> {
  itemKey: string
  fromIndex: number
  toIndex: number
  originalValue: T[]
  mode: 'keyboard' | 'pointer'
  pointerId?: number
  pointerStartX?: number
  pointerStartY?: number
  pointerOffsetX?: number
  pointerOffsetY?: number
  pointerClientX?: number
  pointerClientY?: number
  previewWidth?: number
  hasPointerMoved?: boolean
}

export interface ListReorderMessages {
  grabbed: (position: number) => string
  movedToPosition: (position: number, total: number) => string
  reorderCancelled: () => string
  returnedToPosition: (position: number) => string
  dropped: (position: number, total: number) => string
  alreadyAtBoundary: (boundary: 'first' | 'last') => string
}

export interface ListReorderOptions<T> {
  /** 当前受控值。 */
  currentValue: () => T[]
  getItemKey: (item: T) => string | number
  isReorderable: () => boolean
  /** 列表禁用或加载中时不许发起、也不许继续一次重排。 */
  isBlocked: () => boolean
  rowElement: (itemKey: string) => HTMLElement | null
  previewHost: Ref<HTMLElement | null>
  emitReorder: (nextValue: T[], change: ListInputChange<T>) => void
  announce: (message: string) => void
  messages: ListReorderMessages
}

export interface ListReorder<T> {
  state: Ref<ListReorderState<T> | null>
  /** 拖动中的源行 key。 */
  sourceKey: Ref<string | null>
  /** 键盘拿起中的源行 key。 */
  keyboardKey: Ref<string | null>
  /** 指针拖动时的落点：插在哪一条之前或之后。 */
  pointerDrop: Ref<{ itemKey: string, position: 'before' | 'after' } | null>
  /** 克隆体在视口里的位置。 */
  previewStyle: Ref<Record<string, string> | null>
  /** 键盘拿起时按预览顺序排好的值。 */
  displayValue: Ref<T[]>
  startReorder: (item: T, index: number, mode: 'keyboard' | 'pointer', geometry?: Partial<ListReorderState<T>>) => void
  cancelReorder: () => void
  commitReorder: () => void
  /** 没拿起时按方向键：立刻挪一位并提交。 */
  moveWithArrowKey: (item: T, fromIndex: number, offset: -1 | 1) => void
  /** 拿起后按方向键：只改预览位置。 */
  previewReorder: (toIndex: number) => void
  onHandleKeydown: (event: KeyboardEvent, item: T, index: number) => void
  onHandlePointerDown: (event: PointerEvent, item: T, index: number) => void
  onHandlePointerMove: (event: PointerEvent) => void
  onHandlePointerUp: (event: PointerEvent) => void
  onHandlePointerCancel: (event: PointerEvent) => void
  onHandleLostPointerCapture: (event: PointerEvent) => void
  onHandleBlur: (item: T) => void
}

/**
 * 记录列表的重排状态机。
 *
 * 两种起点、两种提交时机，和上游一致：
 * - 手柄没拿起时按上下方向键：立刻挪一位，马上提交，读屏能听到新位置。
 * - 空格或回车先拿起，之后方向键只改预览，再按空格或回车才提交，Escape 放弃。
 * - 指针拖动过程中不动数据，松手才提交一次。
 */
export function useListReorder<T>(options: ListReorderOptions<T>): ListReorder<T> {
  const state = ref<ListReorderState<T> | null>(null) as Ref<ListReorderState<T> | null>

  function setState(next: ListReorderState<T> | null): void {
    state.value = next
  }

  const displayValue = computed<T[]>(() => {
    const current = state.value
    if (current == null || current.mode === 'pointer')
      return options.currentValue()
    // 键盘拿起期间只改预览顺序，不动受控数据。
    return current.fromIndex === current.toIndex
      ? current.originalValue
      : moveItem(current.originalValue, current.fromIndex, current.toIndex)
  })

  const sourceKey = computed<string | null>(() => (state.value?.mode === 'pointer' ? state.value.itemKey : null))
  const keyboardKey = computed<string | null>(() => (state.value?.mode === 'keyboard' ? state.value.itemKey : null))

  const pointerDrop = computed<{ itemKey: string, position: 'before' | 'after' } | null>(() => {
    const current = state.value
    if (current?.mode !== 'pointer' || !current.hasPointerMoved || current.toIndex === current.fromIndex)
      return null
    const remaining = current.originalValue.filter((_, index) => index !== current.fromIndex)
    const before = remaining[current.toIndex]
    if (before != null)
      return { itemKey: String(options.getItemKey(before)), position: 'before' }
    const after = remaining.at(-1)
    return after == null ? null : { itemKey: String(options.getItemKey(after)), position: 'after' }
  })

  const previewStyle = computed<Record<string, string> | null>(() => {
    const current = state.value
    if (current?.mode !== 'pointer' || current.pointerClientX == null || current.pointerClientY == null || current.pointerOffsetX == null || current.pointerOffsetY == null || current.previewWidth == null)
      return null
    return {
      top: `${current.pointerClientY - current.pointerOffsetY}px`,
      left: `${current.pointerClientX - current.pointerOffsetX}px`,
      width: `${current.previewWidth}px`,
    }
  })

  function startReorder(item: T, index: number, mode: 'keyboard' | 'pointer', geometry?: Partial<ListReorderState<T>>): void {
    if (options.isBlocked() || !options.isReorderable())
      return
    setState({
      itemKey: String(options.getItemKey(item)),
      fromIndex: index,
      toIndex: index,
      originalValue: [...options.currentValue()],
      mode,
      ...geometry,
      hasPointerMoved: false,
    })
    options.announce(options.messages.grabbed(index + 1))
  }

  function previewReorder(toIndex: number): void {
    const current = state.value
    if (current == null)
      return
    const bounded = Math.max(0, Math.min(toIndex, current.originalValue.length - 1))
    if (bounded === current.toIndex)
      return
    setState({ ...current, toIndex: bounded })
    options.announce(options.messages.movedToPosition(bounded + 1, current.originalValue.length))
  }

  function cancelReorder(): void {
    if (state.value == null)
      return
    setState(null)
    options.announce(options.messages.reorderCancelled())
  }

  function commitReorder(): void {
    const current = state.value
    if (current == null)
      return
    if (current.mode === 'pointer' && !current.hasPointerMoved) {
      setState(null)
      return
    }
    const nextValue = moveItem(current.originalValue, current.fromIndex, current.toIndex)
    const item = current.originalValue[current.fromIndex] as T
    const hasChanged = current.fromIndex !== current.toIndex
    setState(null)
    if (!hasChanged) {
      options.announce(options.messages.returnedToPosition(current.fromIndex + 1))
      return
    }
    options.emitReorder(nextValue, {
      type: 'reorder',
      item,
      fromIndex: current.fromIndex,
      toIndex: current.toIndex,
    })
    options.announce(options.messages.dropped(current.toIndex + 1, current.originalValue.length))
  }

  function moveWithArrowKey(item: T, fromIndex: number, offset: -1 | 1): void {
    const value = options.currentValue()
    const toIndex = Math.max(0, Math.min(fromIndex + offset, value.length - 1))
    if (toIndex === fromIndex) {
      options.announce(options.messages.alreadyAtBoundary(offset < 0 ? 'first' : 'last'))
      return
    }
    const nextValue = moveItem(value, fromIndex, toIndex)
    options.emitReorder(nextValue, { type: 'reorder', item, fromIndex, toIndex })
    options.announce(options.messages.movedToPosition(toIndex + 1, value.length))
  }

  function onHandleKeydown(event: KeyboardEvent, item: T, index: number): void {
    if (event.altKey || event.ctrlKey || event.metaKey)
      return
    const current = state.value
    const isActivationKey = event.key === ' ' || event.key === 'Enter'
    if (current == null) {
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        moveWithArrowKey(item, index, -1)
        return
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        moveWithArrowKey(item, index, 1)
        return
      }
      if (isActivationKey) {
        event.preventDefault()
        startReorder(item, index, 'keyboard')
      }
      return
    }
    if (current.itemKey !== String(options.getItemKey(item)))
      return
    if (isActivationKey) {
      event.preventDefault()
      commitReorder()
    }
    else if (event.key === 'Escape') {
      event.preventDefault()
      cancelReorder()
    }
    else if (event.key === 'ArrowUp') {
      event.preventDefault()
      previewReorder(current.toIndex - 1)
    }
    else if (event.key === 'ArrowDown') {
      event.preventDefault()
      previewReorder(current.toIndex + 1)
    }
    else if (event.key === 'Home') {
      event.preventDefault()
      previewReorder(0)
    }
    else if (event.key === 'End') {
      event.preventDefault()
      previewReorder(current.originalValue.length - 1)
    }
  }

  function onHandlePointerDown(event: PointerEvent, item: T, index: number): void {
    if (event.button !== 0 || options.isBlocked())
      return
    const itemKey = String(options.getItemKey(item))
    const sourceRow = options.rowElement(itemKey)
    if (sourceRow == null)
      return
    const bounds = sourceRow.getBoundingClientRect()
    ;(event.currentTarget as HTMLElement | null)?.setPointerCapture?.(event.pointerId)
    startReorder(item, index, 'pointer', {
      pointerId: event.pointerId,
      pointerStartX: event.clientX,
      pointerStartY: event.clientY,
      pointerOffsetX: event.clientX - bounds.left,
      pointerOffsetY: event.clientY - bounds.top,
      pointerClientX: event.clientX,
      pointerClientY: event.clientY,
      previewWidth: bounds.width,
    })
  }

  function onHandlePointerMove(event: PointerEvent): void {
    const current = state.value
    if (current?.mode !== 'pointer' || current.pointerId !== event.pointerId)
      return
    const horizontalDistance = event.clientX - (current.pointerStartX ?? event.clientX)
    const verticalDistance = event.clientY - (current.pointerStartY ?? event.clientY)
    const hasCrossedThreshold = current.hasPointerMoved === true
      || Math.hypot(horizontalDistance, verticalDistance) >= POINTER_DRAG_THRESHOLD_PX
    const remaining = current.originalValue.filter((_, index) => index !== current.fromIndex)
    let targetIndex = current.fromIndex
    if (hasCrossedThreshold) {
      event.preventDefault()
      targetIndex = remaining.length
      for (let index = 0; index < remaining.length; index += 1) {
        const row = options.rowElement(String(options.getItemKey(remaining[index] as T)))
        if (row == null)
          continue
        const bounds = row.getBoundingClientRect()
        if (event.clientY < bounds.top + bounds.height / 2) {
          targetIndex = index
          break
        }
      }
    }
    const nextState: ListReorderState<T> = {
      ...current,
      pointerClientX: event.clientX,
      pointerClientY: event.clientY,
      hasPointerMoved: hasCrossedThreshold,
      toIndex: targetIndex,
    }
    if (current.pointerClientX === nextState.pointerClientX
      && current.pointerClientY === nextState.pointerClientY
      && current.hasPointerMoved === nextState.hasPointerMoved
      && current.toIndex === nextState.toIndex) {
      return
    }
    setState(nextState)
    if (hasCrossedThreshold && current.toIndex !== targetIndex)
      options.announce(options.messages.movedToPosition(targetIndex + 1, current.originalValue.length))
  }

  function onHandlePointerUp(event: PointerEvent): void {
    const current = state.value
    if (current?.mode !== 'pointer' || current.pointerId !== event.pointerId)
      return
    commitReorder()
    const target = event.currentTarget as HTMLElement | null
    if (target?.hasPointerCapture?.(event.pointerId))
      target.releasePointerCapture?.(event.pointerId)
  }

  function onHandlePointerCancel(event: PointerEvent): void {
    const current = state.value
    if (current?.mode !== 'pointer' || current.pointerId !== event.pointerId)
      return
    cancelReorder()
    const target = event.currentTarget as HTMLElement | null
    if (target?.hasPointerCapture?.(event.pointerId))
      target.releasePointerCapture?.(event.pointerId)
  }

  function onHandleLostPointerCapture(event: PointerEvent): void {
    const current = state.value
    if (current?.mode === 'pointer' && current.pointerId === event.pointerId)
      cancelReorder()
  }

  /** 键盘拿起时焦点跑掉就放弃，避免留下一个看不见的预览顺序。 */
  function onHandleBlur(item: T): void {
    const current = state.value
    if (current?.mode === 'keyboard' && current.itemKey === String(options.getItemKey(item)))
      cancelReorder()
  }

  // 克隆体是一张跟着指针的静态图片：去掉 id、ARIA 关联和 Tab 停靠点。
  watch(
    () => (state.value?.mode === 'pointer' ? state.value.itemKey : null),
    async (itemKey) => {
      if (itemKey == null) {
        options.previewHost.value?.replaceChildren()
        return
      }
      await nextTick()
      const host = options.previewHost.value
      if (host == null)
        return
      const sourceRow = options.rowElement(itemKey)
      if (sourceRow == null)
        return
      const clone = sourceRow.cloneNode(true) as HTMLElement
      host.style.direction = getComputedStyle(sourceRow).direction
      clone.style.opacity = '1'
      clone.removeAttribute('data-list-input-reorder-source')
      clone.removeAttribute('data-list-input-drop-target')
      clone.removeAttribute('data-list-input-reorder')
      clone.removeAttribute('data-list-input-remove')
      clone.removeAttribute('data-list-input-row')
      clone.setAttribute('aria-hidden', 'true')
      for (const element of [clone, ...clone.querySelectorAll<HTMLElement>('*')]) {
        element.removeAttribute('id')
        element.removeAttribute('aria-describedby')
        element.removeAttribute('aria-labelledby')
        element.removeAttribute('name')
        element.removeAttribute('data-list-input-reorder-source')
        element.removeAttribute('data-list-input-drop-target')
        element.removeAttribute('data-list-input-reorder')
        element.removeAttribute('data-list-input-remove')
        element.setAttribute('tabindex', '-1')
      }
      host.replaceChildren(clone)
    },
  )

  return {
    state,
    sourceKey,
    keyboardKey,
    pointerDrop,
    previewStyle,
    displayValue,
    startReorder,
    cancelReorder,
    commitReorder,
    moveWithArrowKey,
    previewReorder,
    onHandleKeydown,
    onHandlePointerDown,
    onHandlePointerMove,
    onHandlePointerUp,
    onHandlePointerCancel,
    onHandleLostPointerCapture,
    onHandleBlur,
  }
}
