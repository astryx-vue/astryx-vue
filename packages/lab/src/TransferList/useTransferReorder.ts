import type { Ref } from 'vue'
import type { TransferListOption } from './types.js'
import { computed, nextTick, ref, watch } from 'vue'
import { movableRange, moveItem } from './transferItems.js'

/** 松手前先要跨过这么远的竖直距离，才算真的在拖。 */
const POINTER_DRAG_THRESHOLD_PX = 5

export interface TransferReorderSession<T extends string> {
  value: T
  label: string
  mode: 'keyboard' | 'pointer'
  originalValue: readonly T[]
  fromIndex: number
  toIndex: number
  pointerId?: number
  pointerStartY?: number
  pointerOffsetY?: number
  pointerClientY?: number
  previewX?: number
  previewWidth?: number
  hasPointerMoved?: boolean
}

export interface TransferReorderMessages {
  grabbed: (label: string, position: number, total: number) => string
  moveCancelled: (label: string) => string
  dropped: (label: string, position: number, total: number) => string
  returned: (label: string, position: number) => string
  movedToPosition: (label: string, position: number, total: number) => string
}

export interface TransferReorderOptions<T extends string> {
  isReorderable: () => boolean
  /** 外面给的已选顺序。父组件更新后盖掉这里的乐观顺序。 */
  currentValue: () => readonly T[]
  optionByValue: () => Map<T, TransferListOption<T>>
  /** 一行对应的 DOM 元素。拖动时靠它量位置。 */
  rowElement: (value: T) => HTMLElement | null
  /** 跟随指针的克隆体挂在这里。 */
  previewHost: Ref<HTMLElement | null>
  commit: (next: readonly T[]) => void
  announce: (message: string) => void
  messages: TransferReorderMessages
}

export interface TransferReorder<T extends string> {
  session: Ref<TransferReorderSession<T> | null>
  /** 正在被拖的那一项，用来给源行降透明度。 */
  draggingValue: Ref<T | null>
  /** 键盘拿起中的那一项，用来标出正在调整的行。 */
  grabbedValue: Ref<T | null>
  /** 指针拖动时该画在哪一行之前或之后。 */
  pointerPlacement: Ref<{ value: T, position: 'before' | 'after' } | null>
  /** 克隆体该放在视口哪个位置。 */
  previewStyle: Ref<Record<string, string> | null>
  onHandleClick: (option: TransferListOption<T>) => void
  onHandleKeydown: (event: KeyboardEvent, option: TransferListOption<T>) => void
  onHandlePointerDown: (event: PointerEvent, option: TransferListOption<T>) => void
  onHandlePointerMove: (event: PointerEvent, option: TransferListOption<T>) => void
  onHandlePointerUp: (event: PointerEvent, option: TransferListOption<T>) => void
  onHandlePointerCancel: (event: PointerEvent, option: TransferListOption<T>) => void
  onHandleLostPointerCapture: (event: PointerEvent) => void
}

/**
 * 已选栏的重排状态机：键盘拿起／放下、指针拖动、读屏播报，都在这里。
 *
 * 键盘走「每一步立刻提交」，指针走「松手才提交」，和上游一致：
 * 键盘用户按一次方向键就该听到新位置，鼠标用户拖动过程中不该改动数据。
 */
export function useTransferReorder<T extends string>(options: TransferReorderOptions<T>): TransferReorder<T> {
  const session = ref<TransferReorderSession<T> | null>(null) as Ref<TransferReorderSession<T> | null>
  // 提交后父组件下一帧才更新 props，中间的按键读不到。这里留一份同步的顺序。
  const liveValue = ref([...options.currentValue()]) as Ref<readonly T[]>
  let suppressClick = false

  watch(options.currentValue, (next) => {
    liveValue.value = [...next]
  })

  function commit(next: readonly T[]): void {
    liveValue.value = [...next]
    options.commit(next)
  }

  function setSession(next: TransferReorderSession<T> | null): void {
    session.value = next
  }

  function begin(option: TransferListOption<T>, mode: 'keyboard' | 'pointer', geometry?: Partial<TransferReorderSession<T>>): void {
    if (option.isReorderDisabled || !options.isReorderable())
      return
    const index = liveValue.value.indexOf(option.value)
    if (index < 0 || (mode === 'pointer' && geometry == null))
      return
    setSession({
      value: option.value,
      label: option.label,
      mode,
      originalValue: [...liveValue.value],
      fromIndex: index,
      toIndex: index,
      ...geometry,
      hasPointerMoved: false,
    })
    if (mode === 'keyboard')
      options.announce(options.messages.grabbed(option.label, index + 1, liveValue.value.length))
  }

  function finish(cancelled: boolean): void {
    const current = session.value
    if (current == null)
      return
    if (current.mode === 'pointer') {
      if (cancelled || !current.hasPointerMoved) {
        setSession(null)
        if (cancelled)
          options.announce(options.messages.moveCancelled(current.label))
        return
      }
      const hasChanged = current.fromIndex !== current.toIndex
      const nextValue = moveItem(current.originalValue, current.fromIndex, current.toIndex)
      setSession(null)
      if (hasChanged) {
        commit(nextValue)
        options.announce(options.messages.dropped(current.label, current.toIndex + 1, current.originalValue.length))
      }
      else {
        options.announce(options.messages.returned(current.label, current.fromIndex + 1))
      }
      return
    }
    if (cancelled) {
      commit(current.originalValue)
      options.announce(options.messages.moveCancelled(current.label))
    }
    else {
      const index = liveValue.value.indexOf(current.value)
      options.announce(options.messages.dropped(current.label, index + 1, liveValue.value.length))
    }
    setSession(null)
  }

  function moveTo(option: TransferListOption<T>, requestedIndex: number): boolean {
    const nextValue = [...liveValue.value]
    const { index, start, end } = movableRange(options.optionByValue(), option.value, nextValue)
    if (index < 0)
      return false
    const target = Math.max(start, Math.min(end, requestedIndex))
    if (target === index)
      return false
    nextValue.splice(index, 1)
    nextValue.splice(target, 0, option.value)
    commit(nextValue)
    return true
  }

  function onHandleClick(option: TransferListOption<T>): void {
    if (suppressClick) {
      suppressClick = false
      return
    }
    if (session.value?.value === option.value)
      finish(false)
    else
      begin(option, 'keyboard')
  }

  function onHandleKeydown(event: KeyboardEvent, option: TransferListOption<T>): void {
    const current = session.value
    if (current?.value !== option.value || current.mode !== 'keyboard')
      return
    if (event.key === 'Escape') {
      event.preventDefault()
      finish(true)
      return
    }
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault()
      finish(false)
      return
    }
    const { index, start, end } = movableRange(options.optionByValue(), option.value, liveValue.value)
    const targets: Record<string, number> = {
      ArrowUp: index - 1,
      ArrowDown: index + 1,
      Home: start,
      End: end,
    }
    const target = targets[event.key]
    if (target == null)
      return
    event.preventDefault()
    if (moveTo(option, target)) {
      const nextIndex = liveValue.value.indexOf(option.value)
      options.announce(options.messages.movedToPosition(option.label, nextIndex + 1, liveValue.value.length))
    }
  }

  function onHandlePointerDown(event: PointerEvent, option: TransferListOption<T>): void {
    if (event.button !== 0 || option.isReorderDisabled)
      return
    const sourceRow = options.rowElement(option.value)
    if (sourceRow == null)
      return
    const bounds = sourceRow.getBoundingClientRect()
    suppressClick = true
    ;(event.currentTarget as HTMLElement | null)?.setPointerCapture?.(event.pointerId)
    begin(option, 'pointer', {
      pointerId: event.pointerId,
      pointerStartY: event.clientY,
      pointerOffsetY: event.clientY - bounds.top,
      pointerClientY: event.clientY,
      previewX: bounds.left,
      previewWidth: bounds.width,
    })
  }

  function onHandlePointerMove(event: PointerEvent, option: TransferListOption<T>): void {
    const current = session.value
    if (current?.value !== option.value || current.mode !== 'pointer' || current.pointerId !== event.pointerId)
      return
    const verticalDistance = event.clientY - (current.pointerStartY ?? event.clientY)
    const hasCrossedThreshold = current.hasPointerMoved === true || Math.abs(verticalDistance) >= POINTER_DRAG_THRESHOLD_PX
    let targetIndex = current.fromIndex
    if (hasCrossedThreshold) {
      event.preventDefault()
      const { start, end } = movableRange(options.optionByValue(), current.value, current.originalValue)
      const remainingValues = current.originalValue.filter(optionValue => optionValue !== current.value)
      const candidates = current.originalValue
        .map((optionValue, originalIndex) => ({ optionValue, originalIndex }))
        .filter(candidate => candidate.optionValue !== current.value && candidate.originalIndex >= start && candidate.originalIndex <= end)
        .map(candidate => ({
          row: options.rowElement(candidate.optionValue),
          targetIndex: remainingValues.indexOf(candidate.optionValue),
        }))
        .filter((candidate): candidate is { row: HTMLElement, targetIndex: number } => candidate.row != null)
      if (candidates.length > 0) {
        targetIndex = (candidates[candidates.length - 1] as { targetIndex: number }).targetIndex + 1
        for (const candidate of candidates) {
          const candidateBounds = candidate.row.getBoundingClientRect()
          if (event.clientY < candidateBounds.top + candidateBounds.height / 2) {
            targetIndex = candidate.targetIndex
            break
          }
        }
        targetIndex = Math.max(start, Math.min(end, targetIndex))
      }
    }
    const nextSession: TransferReorderSession<T> = {
      ...current,
      pointerClientY: event.clientY,
      hasPointerMoved: hasCrossedThreshold,
      toIndex: targetIndex,
    }
    setSession(nextSession)
    if (hasCrossedThreshold && current.toIndex !== targetIndex)
      options.announce(options.messages.movedToPosition(option.label, targetIndex + 1, current.originalValue.length))
  }

  function onHandlePointerUp(event: PointerEvent, option: TransferListOption<T>): void {
    const current = session.value
    if (current?.mode !== 'pointer' || current.pointerId !== event.pointerId)
      return
    if (current.value !== option.value)
      return
    suppressClick = false
    finish(false)
    const target = event.currentTarget as HTMLElement | null
    if (target?.hasPointerCapture?.(event.pointerId))
      target.releasePointerCapture?.(event.pointerId)
  }

  function onHandlePointerCancel(event: PointerEvent, option: TransferListOption<T>): void {
    const current = session.value
    if (current?.mode !== 'pointer' || current.pointerId !== event.pointerId)
      return
    if (current.value !== option.value)
      return
    suppressClick = false
    finish(true)
    const target = event.currentTarget as HTMLElement | null
    if (target?.hasPointerCapture?.(event.pointerId))
      target.releasePointerCapture?.(event.pointerId)
  }

  function onHandleLostPointerCapture(event: PointerEvent): void {
    const current = session.value
    if (current?.mode === 'pointer' && current.pointerId === event.pointerId) {
      suppressClick = false
      finish(true)
    }
  }

  const draggingValue = computed<T | null>(() => (session.value?.mode === 'pointer' ? session.value.value : null))
  const grabbedValue = computed<T | null>(() => (session.value?.mode === 'keyboard' ? session.value.value : null))

  const pointerPlacement = computed<{ value: T, position: 'before' | 'after' } | null>(() => {
    const current = session.value
    if (current?.mode !== 'pointer' || !current.hasPointerMoved || current.toIndex === current.fromIndex)
      return null
    const remainingValues = current.originalValue.filter(optionValue => optionValue !== current.value)
    const beforeValue = remainingValues[current.toIndex]
    if (beforeValue != null)
      return { value: beforeValue, position: 'before' }
    const afterValue = remainingValues.at(-1)
    return afterValue == null ? null : { value: afterValue, position: 'after' }
  })

  const previewStyle = computed<Record<string, string> | null>(() => {
    const current = session.value
    if (current?.mode !== 'pointer' || current.pointerClientY == null || current.pointerOffsetY == null || current.previewX == null || current.previewWidth == null)
      return null
    return {
      top: `${current.pointerClientY - current.pointerOffsetY}px`,
      left: `${current.previewX}px`,
      width: `${current.previewWidth}px`,
    }
  })

  // 克隆体只是一张跟随指针的静态图片：去掉 id、ARIA 关联和 Tab 停靠点，
  // 否则读屏会把同一行读两遍，Tab 也会跳进影子里。
  watch(
    () => (session.value?.mode === 'pointer' ? session.value.value : null),
    async (cloneValue) => {
      if (cloneValue == null)
        return
      // 预览宿主是 pointerdown 之后才渲染出来的，要等一帧再去拿。
      await nextTick()
      const host = options.previewHost.value
      if (host == null)
        return
      const sourceRow = options.rowElement(cloneValue)
      if (sourceRow == null)
        return
      const clone = sourceRow.cloneNode(true) as HTMLElement
      host.style.direction = getComputedStyle(sourceRow).direction
      clone.style.opacity = '1'
      clone.setAttribute('aria-hidden', 'true')
      for (const element of [clone, ...clone.querySelectorAll<HTMLElement>('*')]) {
        element.removeAttribute('id')
        element.removeAttribute('aria-describedby')
        element.removeAttribute('aria-labelledby')
        element.removeAttribute('name')
        for (const attribute of [...element.attributes]) {
          if (attribute.name.startsWith('data-transfer-list-'))
            element.removeAttribute(attribute.name)
        }
        element.setAttribute('tabindex', '-1')
      }
      host.replaceChildren(clone)
    },
  )

  watch(
    () => (session.value?.mode === 'pointer' ? session.value.value : null),
    (cloneValue) => {
      if (cloneValue != null)
        return
      options.previewHost.value?.replaceChildren()
    },
  )

  return {
    session,
    draggingValue,
    grabbedValue,
    pointerPlacement,
    previewStyle,
    onHandleClick,
    onHandleKeydown,
    onHandlePointerDown,
    onHandlePointerMove,
    onHandlePointerUp,
    onHandlePointerCancel,
    onHandleLostPointerCapture,
  }
}
