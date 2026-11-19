import type { ComputedRef, CSSProperties, MaybeRefOrGetter, Ref } from 'vue'
import type { LayerPlacement } from '../layer/position.js'
import type { TooltipAlignment, TooltipFocusTrigger, TooltipPlacement, TooltipTouchTrigger } from './types.js'
import { computed, onMounted, onScopeDispose, ref, shallowRef, toValue, watch } from 'vue'
import { useAnnounce } from '../composables/useAnnounce.js'
import { useLayer } from '../composables/useLayer.js'
import { isFocusable } from '../layer/focus.js'
import { useHoverLayerDismiss } from '../layer/useHoverLayerDismiss.js'
import { listenOutside, listenPressEnd } from './documentListeners.js'
import { renderedText } from './renderedText.js'

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
  /**
   * 立刻打开气泡并一直保持，直到 `hide()`、Escape、点到外面、滚动外面，或焦点离开触发器和气泡。
   * 文字会被读屏播报一次。受控的 `isOpen` 下只调用 `onShow`，不改 `isOpen`。`isEnabled` 为 false 时什么都不做。
   *
   * 用 `show()` 和 `hide()` 做开关式触发器：自己的按钮调用它们，把 `aria-describedby`、
   * `aria-controls` 设为 `describedBy`，`aria-expanded` 在显示时为 true，并保留自己的无障碍名称。
   */
  show: () => void
  /** 立刻关闭气泡并结束保持。受控的 `isOpen` 下只调用 `onHide`，不改 `isOpen`。 */
  hide: () => void
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
  let bound: HTMLElement | null = null
  const announce = useAnnounce()

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

  // 应用调用 show() 后气泡被「保持」：悬停离开、触发器失焦都不关，
  // 直到 hide()、Escape、点击或滚动到外面，或焦点离开触发器和气泡。
  const isHeld = shallowRef(false)
  // 这次保持是不是在触发器被按住时开始的。这样的保持随按压结束：
  // 按压在触发器外结束、没有点击时，保持随之结束，交给悬停规则决定。
  let isHoldFromPress = false
  // show() 是否发生在这一轮任务里，用来识别「先于本 hook 的 pointerdown 监听」的调用。
  let isHoldInThisTask = false
  let isTriggerPressed = false
  let stopPressTracking: (() => void) | null = null
  let stopOutsideDismiss: (() => void) | null = null

  function isHeldOpen(): boolean {
    return isHeld.value && layer.isOpen.value && toValue(options.isOpen) !== false
  }

  function isInsideTooltip(node: Node | null): boolean {
    return node != null && (bound?.contains(node) === true || layer.contentRef.value?.contains(node) === true)
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
    if (toValue(options.isOpen) === true || isHeldOpen())
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

  function onMouseLeave(event: MouseEvent): void {
    if (isTouchPointer.value)
      return
    // 快速从触发器移进气泡时，气泡的 mouseenter 可能先取消隐藏，
    // 随后触发器的 mouseleave 又排上一个。目的地已在气泡里时不再排队。
    const next = event.relatedTarget
    if (next instanceof Node && layer.contentRef.value?.contains(next))
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

  function trackTriggerPress(): void {
    stopPressTracking?.()
    const trigger = bound
    if (trigger == null)
      return
    isTriggerPressed = true
    stopPressTracking = listenPressEnd((event) => {
      isTriggerPressed = false
      stopPressTracking = null
      if (event.type !== 'pointerup')
        return
      // 在触发器上结束的按压保留保持，就像点击一样。
      if (event.target instanceof Node && trigger.contains(event.target)) {
        isHoldFromPress = false
      }
      else if (isHoldFromPress && isHeld.value) {
        // 按压在触发器外结束、也没有点击：保持结束，悬停规则接手。
        // 落在气泡上就让气泡的鼠标事件管；落在别处，没人悬停了，排上隐藏。
        setHeld(false)
        if (!(event.target instanceof Node && isInsideTooltip(event.target)))
          scheduleHide()
      }
    })
  }

  function onPointerDown(event: PointerEvent): void {
    trackTriggerPress()
    // 应用的 hide() 才关保持中的气泡：按压既不关它，也不等触摸的判断。
    if (isHeld.value) {
      if (isHoldInThisTask)
        isHoldFromPress = true
      return
    }
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

  // 焦点离开触发器和气泡就结束保持，不管 focusTrigger 是什么。
  // 焦点去了「没有元素」时由按压决定。
  function onHeldFocusOut(event: FocusEvent): void {
    if (!isHeldOpen())
      return
    const next = event.relatedTarget
    if (!(next instanceof Node) || isInsideTooltip(next))
      return
    releaseHold()
  }

  function armOutsideDismiss(): void {
    stopOutsideDismiss?.()
    if (typeof document === 'undefined')
      return
    // 点击或滚动发生在气泡和触发器之外，就结束保持并关闭气泡。
    stopOutsideDismiss = listenOutside((target) => {
      if (isHeldOpen() && !(target != null && isInsideTooltip(target)))
        releaseHold()
    })
  }

  function setHeld(next: boolean): void {
    isHeld.value = next
    if (!next) {
      stopOutsideDismiss?.()
      isHoldFromPress = false
    }
  }

  function dropHold(): void {
    if (isHeld.value)
      setHeld(false)
  }

  function releaseHold(): void {
    setHeld(false)
    if (toValue(options.isOpen) !== undefined) {
      options.onHide?.()
      return
    }
    hideNow()
  }

  function show(): void {
    clearTimers()
    if (!isEnabled())
      return
    setHeld(true)
    armOutsideDismiss()
    isHoldFromPress = isTriggerPressed
    isHoldInThisTask = true
    setTimeout(() => {
      isHoldInThisTask = false
    }, 0)
    if (isControlled.value) {
      options.onShow?.()
      return
    }
    layer.show()
  }

  function hide(): void {
    clearTimers()
    releaseHold()
  }

  // 只有保持才播报文字：预览本来就是触发器的描述。
  watch(() => isHeld.value && isOpen.value, (shown) => {
    if (!shown)
      return
    const text = layer.contentRef.value == null ? '' : renderedText(layer.contentRef.value)
    if (text !== '')
      announce(text)
  }, { flush: 'post' })

  // 整段生命周期都留在关闭栈里，并带上外层传下来的嵌套深度。
  useHoverLayerDismiss({
    isPresent: () => isOpen.value,
    getContainer: () => layer.contentRef.value,
    onDismiss() {
      clearTimers()
      dropHold()
      if (isControlled.value) {
        options.onHide?.()
        return
      }
      layer.hide()
    },
  })

  function shouldListenFocus(element: HTMLElement): boolean {
    return focusTriggerMode() === 'always' || (focusTriggerMode() === 'auto' && isFocusable(element))
  }

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
    element.addEventListener('focusout', onHeldFocusOut as EventListener)
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
    bound.removeEventListener('focusout', onHeldFocusOut as EventListener)
    stopPressTracking?.()
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

  watch(() => toValue(options.isEnabled), (enabled) => {
    if (enabled !== false)
      return
    // 禁用后触发器已解绑，没必要再保留一次不会生效的显示；隐藏仍要继续。
    clearTimeout(showTimer)
    showTimer = undefined
  }, { flush: 'sync' })

  // 受控值落到内部状态上，只同步不生事件：这是使用方自己设的值，不该再回报给它。
  function syncControlled(open: boolean): void {
    layer.isOpen.value = open
  }

  watch(() => toValue(options.isOpen), (open) => {
    clearTimers()
    if (open === undefined)
      return
    // 使用方关闭气泡时保持随之结束。
    if (!open)
      dropHold()
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
    stopOutsideDismiss?.()
    unbind()
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
    show,
    hide,
  }
}
