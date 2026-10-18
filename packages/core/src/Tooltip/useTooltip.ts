import type { ComputedRef, CSSProperties, MaybeRefOrGetter, Ref } from 'vue'
import type { LayerPlacement } from '../layer/position.js'
import type { TooltipAlignment, TooltipFocusTrigger, TooltipPlacement, TooltipTouchTrigger } from './types.js'
import { computed, onMounted, onScopeDispose, ref, shallowRef, toValue, watch } from 'vue'
import { useLayer } from '../composables/useLayer.js'
import { isFocusable } from '../layer/focus.js'

export interface UseTooltipOptions {
  /**
   * 相对触发元素的方位。
   * @default 'above'
   */
  placement?: MaybeRefOrGetter<TooltipPlacement>
  /**
   * 沿方位轴的对齐方式。
   * @default 'center'
   */
  alignment?: MaybeRefOrGetter<TooltipAlignment>
  /**
   * 悬停多久才显示，单位毫秒。
   * @default 200
   */
  delay?: MaybeRefOrGetter<number>
  /**
   * 指针或焦点离开后多久隐藏，单位毫秒。0 表示走内部默认的 100 毫秒桥接时间。
   * @default 0
   */
  hideDelay?: MaybeRefOrGetter<number>
  /**
   * 焦点是否打开气泡。
   * @default 'auto'
   */
  focusTrigger?: MaybeRefOrGetter<TooltipFocusTrigger>
  /**
   * 触摸轻点的行为。`auto` 在触发器自己有动作时不打开，`tap` 总是打开，`none` 从不打开。
   * @default 'auto'
   */
  touchTrigger?: MaybeRefOrGetter<TooltipTouchTrigger>
  /**
   * 是否启用悬停与焦点触发。
   * @default true
   */
  isEnabled?: MaybeRefOrGetter<boolean>
  /**
   * 受控的打开状态。true 强制显示，false 强制隐藏，undefined 交给悬停/焦点管理。
   */
  isOpen?: MaybeRefOrGetter<boolean | undefined>
  /**
   * 挂载时是否显示。
   * @default false
   */
  isDefaultOpen?: boolean
  /** 气泡显示后调用。 */
  onShow?: () => void
  /** 气泡隐藏后调用。 */
  onHide?: () => void
}

export interface UseTooltipReturn {
  /** 气泡当前是否显示。受控时以 `isOpen` 为准。 */
  isOpen: ComputedRef<boolean>
  /** 触发器元素。绑到触发元素上，hook 会自动挂事件和 aria 关系。 */
  triggerRef: Ref<HTMLElement | null>
  /** 气泡内容容器。 */
  contentRef: Ref<HTMLElement | null>
  /** 气泡的唯一 ID。 */
  id: string
  /** 锚点的 CSS 标识，用于高级定位场景。 */
  anchorId: string
  /** 要拼进触发器 `aria-describedby` 的 ID。hook 已经自动写好，手写 ARIA 时用得上。 */
  describedBy: string
  /** 气泡的内联定位样式。 */
  contentStyle: ComputedRef<CSSProperties>
  /** 实际生效的方位（空间不够时会翻转）。 */
  resolvedPlacement: ComputedRef<LayerPlacement>
  /** 直接摊到气泡元素上的属性：ID、`role="tooltip"`，以及保持显示的指针事件。 */
  contentProps: ComputedRef<Record<string, unknown>>
}

const GAP = 4
/** 指针离开触发器到进入气泡之间的宽限时间。 */
const HOVER_BRIDGE_DELAY = 100
const ACTION_TAGS = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA']

function matchesFocusVisible(element: HTMLElement): boolean {
  try {
    return element.matches(':focus-visible')
  }
  catch {
    return false
  }
}

/**
 * 对应原版 Astryx 的 `hooks/useTooltip`：悬停和焦点触发的文字提示。
 * 负责延迟显示、焦点处理、`aria-describedby` 关联和定位，`Tooltip` 组件内部也用它。
 *
 * ```ts
 * const { triggerRef, contentRef, contentStyle, contentProps } = useTooltip()
 * ```
 */
export function useTooltip(options: UseTooltipOptions = {}): UseTooltipReturn {
  const triggerRef = shallowRef<HTMLElement | null>(null)
  const isControlled = computed(() => toValue(options.isOpen) !== undefined)
  const isTouchPointer = ref(false)

  const layer = useLayer({
    mode: 'context',
    anchor: triggerRef,
    placement: () => toValue(options.placement) ?? 'above',
    alignment: () => toValue(options.alignment) ?? 'center',
    gap: GAP,
    onShow: () => options.onShow?.(),
    onHide: () => options.onHide?.(),
  })

  const isOpen = computed(() => toValue(options.isOpen) ?? layer.isOpen.value)

  function isEnabled(): boolean {
    return toValue(options.isEnabled) ?? true
  }

  function focusTriggerMode(): TooltipFocusTrigger {
    return toValue(options.focusTrigger) ?? 'auto'
  }

  function touchTriggerMode(): TooltipTouchTrigger {
    return toValue(options.touchTrigger) ?? 'auto'
  }

  let showTimer: ReturnType<typeof setTimeout> | undefined
  let hideTimer: ReturnType<typeof setTimeout> | undefined

  function clearTimers(): void {
    clearTimeout(showTimer)
    clearTimeout(hideTimer)
    showTimer = undefined
    hideTimer = undefined
  }

  function showNow(): void {
    clearTimers()
    if (!isEnabled() || isControlled.value)
      return
    layer.show()
  }

  function hideNow(): void {
    clearTimers()
    if (isControlled.value)
      return
    layer.hide()
  }

  function scheduleShow(): void {
    if (!isEnabled() || isControlled.value)
      return
    clearTimers()
    showTimer = setTimeout(showNow, toValue(options.delay) ?? 200)
  }

  function scheduleHide(): void {
    if (isControlled.value)
      return
    clearTimers()
    const wait = toValue(options.hideDelay) ?? 0
    hideTimer = setTimeout(hideNow, wait > 0 ? wait : HOVER_BRIDGE_DELAY)
  }

  function cancelHide(): void {
    clearTimeout(hideTimer)
    hideTimer = undefined
  }

  function onPointerEnter(event: PointerEvent): void {
    isTouchPointer.value = event.pointerType === 'touch'
  }

  function onMouseEnter(): void {
    if (isTouchPointer.value)
      return
    scheduleShow()
  }

  function onMouseLeave(): void {
    if (isTouchPointer.value)
      return
    scheduleHide()
  }

  function onTouchTap(): void {
    if (!isEnabled() || isControlled.value || touchTriggerMode() === 'none')
      return
    const trigger = triggerRef.value
    if (touchTriggerMode() === 'auto' && trigger != null && ACTION_TAGS.includes(trigger.tagName))
      return
    if (isOpen.value)
      hideNow()
    else
      showNow()
  }

  function onPointerDown(event: PointerEvent): void {
    if (event.pointerType === 'touch') {
      onTouchTap()
      return
    }
    if (isControlled.value)
      return
    hideNow()
  }

  function onFocusIn(event: FocusEvent): void {
    if (!isEnabled() || isTouchPointer.value)
      return
    if (!matchesFocusVisible(event.target as HTMLElement))
      return
    showNow()
  }

  function onFocusOut(): void {
    scheduleHide()
  }

  function onDocumentKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Escape' || !isOpen.value)
      return
    clearTimers()
    if (isControlled.value) {
      options.onHide?.()
      return
    }
    layer.hide()
  }

  function shouldListenFocus(element: HTMLElement): boolean {
    return focusTriggerMode() === 'always' || (focusTriggerMode() === 'auto' && isFocusable(element))
  }

  let bound: HTMLElement | null = null
  let describedByBefore: string | null = null

  function bind(element: HTMLElement): void {
    if (bound === element)
      return
    unbind()
    bound = element
    element.addEventListener('pointerenter', onPointerEnter as EventListener)
    element.addEventListener('mouseenter', onMouseEnter)
    element.addEventListener('mouseleave', onMouseLeave)
    element.addEventListener('pointerdown', onPointerDown as EventListener)
    if (shouldListenFocus(element)) {
      element.addEventListener('focusin', onFocusIn as EventListener)
      element.addEventListener('focusout', onFocusOut)
    }
    describedByBefore = element.getAttribute('aria-describedby')
    element.setAttribute('aria-describedby', [describedByBefore, layer.id].filter(Boolean).join(' '))
  }

  function unbind(): void {
    if (bound == null)
      return
    bound.removeEventListener('pointerenter', onPointerEnter as EventListener)
    bound.removeEventListener('mouseenter', onMouseEnter)
    bound.removeEventListener('mouseleave', onMouseLeave)
    bound.removeEventListener('pointerdown', onPointerDown as EventListener)
    bound.removeEventListener('focusin', onFocusIn as EventListener)
    bound.removeEventListener('focusout', onFocusOut)
    if (describedByBefore)
      bound.setAttribute('aria-describedby', describedByBefore)
    else
      bound.removeAttribute('aria-describedby')
    bound = null
    describedByBefore = null
  }

  // 同步监听：组件在 onMounted / onUpdated 里写 ref，属性要立刻落到元素上。
  watch(triggerRef, (element) => {
    if (element == null)
      unbind()
    else
      bind(element)
  }, { flush: 'sync' })

  watch(isOpen, (open) => {
    if (typeof document === 'undefined')
      return
    if (open)
      document.addEventListener('keydown', onDocumentKeydown)
    else
      document.removeEventListener('keydown', onDocumentKeydown)
  }, { immediate: true })

  // 受控值落到内部状态上，只同步不生事件：这是使用方自己设的值，不该再回报给它。
  function syncControlled(open: boolean): void {
    layer.isOpen.value = open
  }

  watch(() => toValue(options.isOpen), (open) => {
    clearTimers()
    if (open === undefined)
      return
    syncControlled(open)
  })

  onMounted(() => {
    if (isControlled.value) {
      if (toValue(options.isOpen) === true)
        syncControlled(true)
      return
    }
    if (options.isDefaultOpen === true)
      showNow()
  })

  onScopeDispose(() => {
    clearTimers()
    unbind()
    if (typeof document !== 'undefined')
      document.removeEventListener('keydown', onDocumentKeydown)
  })

  const contentProps = computed<Record<string, unknown>>(() => ({
    id: layer.id,
    role: 'tooltip',
    onMouseenter: cancelHide,
    onMouseleave: scheduleHide,
  }))

  return {
    isOpen,
    triggerRef,
    contentRef: layer.contentRef,
    id: layer.id,
    anchorId: layer.anchorId,
    describedBy: layer.id,
    contentStyle: layer.contentStyle,
    resolvedPlacement: layer.resolvedPlacement,
    contentProps,
  }
}
