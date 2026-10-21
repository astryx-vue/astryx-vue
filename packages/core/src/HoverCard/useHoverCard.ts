import type { ComputedRef, CSSProperties, MaybeRefOrGetter, Ref } from 'vue'
import type { LayerPlacement } from '../layer/position.js'
import type { HoverCardAlignment, HoverCardFocusTrigger, HoverCardPlacement, HoverCardTouchTrigger } from './types.js'
import { computed, onMounted, onScopeDispose, shallowRef, toValue, watch } from 'vue'
import { useLayer } from '../composables/useLayer.js'
import { isFocusable } from '../layer/focus.js'
import { useHoverLayerDismiss } from '../layer/useHoverLayerDismiss.js'

export interface UseHoverCardOptions {
  /**
   * 相对触发元素的方位。
   * @default 'above'
   */
  placement?: MaybeRefOrGetter<HoverCardPlacement>
  /**
   * 沿方位轴的对齐方式。
   * @default 'center'
   */
  alignment?: MaybeRefOrGetter<HoverCardAlignment>
  /**
   * 悬停多久才显示，单位毫秒。
   * @default 300
   */
  delay?: MaybeRefOrGetter<number>
  /**
   * 指针或焦点离开后多久隐藏，单位毫秒。指针可以借这段时间移进卡片。
   * @default 200
   */
  hideDelay?: MaybeRefOrGetter<number>
  /**
   * 焦点是否打开卡片。
   * @default 'auto'
   */
  focusTrigger?: MaybeRefOrGetter<HoverCardFocusTrigger>
  /**
   * 触摸轻点的行为。`auto` 在触发器自己有动作时不打开，`tap` 总是打开，`none` 从不打开。
   * @default 'auto'
   */
  touchTrigger?: MaybeRefOrGetter<HoverCardTouchTrigger>
  /**
   * 是否启用悬停与焦点触发。
   * @default true
   */
  isEnabled?: MaybeRefOrGetter<boolean>
  /**
   * 卡片的无障碍名称。给了就暴露成有名字的 `role="dialog"`，
   * 不给就退回 `role="group"`（组可以没有名字）。
   */
  label?: MaybeRefOrGetter<string | undefined>
  /**
   * 受控的打开状态。true 强制显示，false 强制隐藏，undefined 交给悬停/焦点管理。
   */
  isOpen?: MaybeRefOrGetter<boolean | undefined>
  /**
   * 挂载时是否显示。
   * @default false
   */
  isDefaultOpen?: boolean
  /** 卡片显示后调用。 */
  onShow?: () => void
  /** 卡片隐藏后调用。 */
  onHide?: () => void
}

export interface UseHoverCardReturn {
  /** 卡片当前是否显示。 */
  isOpen: Ref<boolean>
  /** 触发器元素。绑到触发元素上，hook 会自动挂事件和 aria 关系。 */
  triggerRef: Ref<HTMLElement | null>
  /** 卡片内容容器。 */
  contentRef: Ref<HTMLElement | null>
  /** 卡片的唯一 ID。 */
  id: string
  /** 锚点的 CSS 标识，用于高级定位场景。 */
  anchorId: string
  /** 要拼进触发器 `aria-describedby` 的 ID。hook 已经自动写好，手写 ARIA 时用得上。 */
  describedBy: string
  /** 卡片的内联定位样式。 */
  contentStyle: ComputedRef<CSSProperties>
  /** 实际生效的方位（空间不够时会翻转）。 */
  resolvedPlacement: ComputedRef<LayerPlacement>
  /** 卡片是否以有名字的对话形式暴露。 */
  isDialog: ComputedRef<boolean>
  /** 直接摊到卡片元素上的属性：ID、role、aria-label，以及保持显示的指针/焦点事件。 */
  contentProps: ComputedRef<Record<string, unknown>>
  /** 立刻显示卡片。 */
  show: () => void
  /** 立刻隐藏卡片。 */
  hide: () => void
}

const GAP = 4
const TOUCH_POINTER_TYPES = new Set(['touch', 'pen'])

const EXPANDABLE_ROLES = new Set([
  'application',
  'button',
  'checkbox',
  'columnheader',
  'combobox',
  'gridcell',
  'link',
  'listbox',
  'menuitem',
  'menuitemcheckbox',
  'menuitemradio',
  'row',
  'rowheader',
  'switch',
  'tab',
  'treeitem',
])

const BUTTON_INPUT_TYPES = new Set(['button', 'submit', 'reset', 'image'])

const ACTION_ROLES = new Set([
  'button',
  'checkbox',
  'combobox',
  'link',
  'menuitem',
  'menuitemcheckbox',
  'menuitemradio',
  'option',
  'radio',
  'searchbox',
  'slider',
  'spinbutton',
  'switch',
  'tab',
  'textbox',
])

// aria-expanded 只在一部分 role 上合法，所以没有 role 的触发器只靠 aria-haspopup / aria-controls
// 宣告弹层。写在不合法的地方就是 aria-allowed-attr 缺陷，少写只是少一条能被推断出来的信息。
function supportsAriaExpanded(element: HTMLElement): boolean {
  const explicit = element.getAttribute('role')?.trim().split(/\s+/)[0]
  if (explicit)
    return EXPANDABLE_ROLES.has(explicit)

  switch (element.tagName) {
    case 'BUTTON':
    case 'SUMMARY':
      return true
    case 'A':
    case 'AREA':
      return element.hasAttribute('href')
    case 'INPUT':
      return BUTTON_INPUT_TYPES.has((element as HTMLInputElement).type?.toLowerCase())
    case 'SELECT':
      return true
    default:
      return false
  }
}

function isEditable(element: HTMLElement): boolean {
  if (element.isContentEditable === true)
    return true
  const attribute = element.getAttribute('contenteditable')
  return attribute != null && attribute !== 'false'
}

function isActionTrigger(element: HTMLElement): boolean {
  const role = element.getAttribute('role')
  if (role != null && role !== '')
    return ACTION_ROLES.has(role)

  switch (element.tagName) {
    case 'BUTTON':
    case 'INPUT':
    case 'LABEL':
    case 'SELECT':
    case 'SUMMARY':
    case 'TEXTAREA':
      return true
    case 'A':
    case 'AREA':
      return element.hasAttribute('href')
    default:
      return isEditable(element)
  }
}

function mergeIds(...ids: (string | null | undefined)[]): string | undefined {
  const kept = ids.filter(Boolean)
  return kept.length > 0 ? kept.join(' ') : undefined
}

/**
 * 对应原版 Astryx 的 `hooks/useHoverCard`：悬停触发的浮层卡片。
 * 负责悬停意图与延迟、指针从触发器移进卡片的宽限、触摸轻点、`aria-describedby` /
 * `role="dialog"` 的关系和定位，`HoverCard` 组件内部也用它。
 *
 * ```ts
 * const { triggerRef, contentRef, contentStyle, contentProps } = useHoverCard()
 * ```
 */
export function useHoverCard(options: UseHoverCardOptions = {}): UseHoverCardReturn {
  const triggerRef = shallowRef<HTMLElement | null>(null)
  const isControlled = computed(() => toValue(options.isOpen) !== undefined)
  const isDialog = computed(() => {
    const label = toValue(options.label)
    return label != null && label !== ''
  })

  const layer = useLayer({
    mode: 'context',
    anchor: triggerRef,
    placement: () => toValue(options.placement) ?? 'above',
    alignment: () => toValue(options.alignment) ?? 'center',
    gap: GAP,
    onShow: () => options.onShow?.(),
    onHide: () => options.onHide?.(),
  })

  const isOpen = layer.isOpen

  function isEnabled(): boolean {
    return toValue(options.isEnabled) ?? true
  }

  // 轻点会把焦点留在被点的触发器上，鼠标点一下也不该让下一次键盘聚焦被当成触摸场景，
  // 所以这里同时看指针类型和最近的输入方式。
  let lastModality: 'keyboard' | 'pointer' = 'keyboard'
  let isTouchPointer = false
  let isHoveringContent = false
  let isEscapeDismissing = false
  let showTimer: ReturnType<typeof setTimeout> | undefined
  let hideTimer: ReturnType<typeof setTimeout> | undefined

  function onModalityPointerDown(): void {
    lastModality = 'pointer'
  }

  function onModalityKeyDown(event: KeyboardEvent): void {
    if (event.metaKey || event.altKey || event.ctrlKey)
      return
    lastModality = 'keyboard'
  }

  function clearTimers(): void {
    clearTimeout(showTimer)
    clearTimeout(hideTimer)
    showTimer = undefined
    hideTimer = undefined
  }

  function showNow(): void {
    clearTimers()
    if (!isEnabled())
      return
    layer.show()
  }

  function hideNow(): void {
    clearTimers()
    isHoveringContent = false
    if (isControlled.value)
      return
    layer.hide()
  }

  function scheduleShow(): void {
    if (!isEnabled() || isControlled.value)
      return
    clearTimers()
    showTimer = setTimeout(() => {
      showTimer = undefined
      layer.show()
    }, toValue(options.delay) ?? 300)
  }

  function scheduleHide(): void {
    if (isControlled.value)
      return
    clearTimers()
    hideTimer = setTimeout(() => {
      hideTimer = undefined
      if (!isHoveringContent)
        layer.hide()
    }, toValue(options.hideDelay) ?? 200)
  }

  function onPointerEnter(event: PointerEvent): void {
    isTouchPointer = event.pointerType === 'touch'
  }

  function onMouseEnter(): void {
    if (isTouchPointer)
      return
    scheduleShow()
  }

  function onMouseLeave(): void {
    if (isTouchPointer)
      return
    scheduleHide()
  }

  function onPointerDown(event: PointerEvent): void {
    const isTouch = TOUCH_POINTER_TYPES.has(event.pointerType)
    isTouchPointer = isTouch
    if (!isTouch || isControlled.value)
      return

    const trigger = triggerRef.value
    const mode = toValue(options.touchTrigger) ?? 'auto'
    const resolved = mode === 'auto'
      ? (trigger != null && isActionTrigger(trigger) ? 'none' : 'tap')
      : mode

    if (resolved === 'none' || !isEnabled()) {
      hideNow()
      return
    }

    if (isOpen.value)
      hideNow()
    else
      showNow()
  }

  function onFocusIn(): void {
    if (!isEnabled())
      return
    if (isTouchPointer && lastModality === 'pointer')
      return
    if (isEscapeDismissing) {
      isEscapeDismissing = false
      return
    }
    showNow()
  }

  function onFocusOut(event: FocusEvent): void {
    const related = event.relatedTarget as HTMLElement | null
    if (related && layer.contentRef.value?.contains(related))
      return
    scheduleHide()
  }

  function onContentMouseEnter(): void {
    if (isTouchPointer)
      return
    isHoveringContent = true
    clearTimers()
  }

  function onContentMouseLeave(): void {
    if (isTouchPointer)
      return
    isHoveringContent = false
    scheduleHide()
  }

  function onContentFocusOut(event: FocusEvent): void {
    const related = event.relatedTarget as HTMLElement | null
    if (related && layer.contentRef.value?.contains(related))
      return
    if (related && triggerRef.value?.contains(related))
      return
    scheduleHide()
  }

  function dismissFromEscape(): void {
    clearTimers()
    isHoveringContent = false
    if (isControlled.value)
      return options.onHide?.()
    const hadFocus = layer.contentRef.value?.contains(document.activeElement) ?? false
    layer.hide()
    if (hadFocus && triggerRef.value) {
      isEscapeDismissing = true
      triggerRef.value.focus()
    }
  }

  useHoverLayerDismiss({
    isPresent: () => isOpen.value,
    getContainer: () => layer.contentRef.value,
    onDismiss: dismissFromEscape,
  })

  function onDocumentPointerDown(event: PointerEvent): void {
    if (!TOUCH_POINTER_TYPES.has(event.pointerType) || !isOpen.value || isControlled.value)
      return
    const target = event.target as Node
    if (triggerRef.value?.contains(target) || layer.contentRef.value?.contains(target))
      return
    hideNow()
  }

  let bound: HTMLElement | null = null
  let describedByBefore: string | null = null
  let haspopupBefore: string | null = null
  let controlsBefore: string | null = null
  let expandedBefore: string | null = null
  let canExpand = false

  function applyTriggerAttributes(): void {
    const active = triggerRef.value
    if (!active)
      return

    if (isDialog.value) {
      active.setAttribute('aria-haspopup', 'dialog')
      if (isOpen.value)
        active.setAttribute('aria-controls', mergeIds(controlsBefore, layer.id) ?? '')
      else if (controlsBefore)
        active.setAttribute('aria-controls', controlsBefore)
      else
        active.removeAttribute('aria-controls')

      if (canExpand)
        active.setAttribute('aria-expanded', String(isOpen.value))
      else if (expandedBefore)
        active.setAttribute('aria-expanded', expandedBefore)
      else
        active.removeAttribute('aria-expanded')
      return
    }

    active.setAttribute('aria-describedby', mergeIds(describedByBefore, layer.id) ?? '')
  }

  function restoreTriggerAttributes(): void {
    const active = bound
    if (!active)
      return

    if (describedByBefore)
      active.setAttribute('aria-describedby', describedByBefore)
    else
      active.removeAttribute('aria-describedby')

    if (haspopupBefore)
      active.setAttribute('aria-haspopup', haspopupBefore)
    else
      active.removeAttribute('aria-haspopup')

    if (controlsBefore)
      active.setAttribute('aria-controls', controlsBefore)
    else
      active.removeAttribute('aria-controls')

    if (expandedBefore)
      active.setAttribute('aria-expanded', expandedBefore)
    else
      active.removeAttribute('aria-expanded')
  }

  function shouldListenFocus(element: HTMLElement): boolean {
    const mode = toValue(options.focusTrigger) ?? 'auto'
    return mode === 'always' || (mode === 'auto' && isFocusable(element))
  }

  function bind(element: HTMLElement): void {
    if (bound === element)
      return
    unbind()
    bound = element

    describedByBefore = element.getAttribute('aria-describedby')
    haspopupBefore = element.getAttribute('aria-haspopup')
    controlsBefore = element.getAttribute('aria-controls')
    expandedBefore = element.getAttribute('aria-expanded')
    canExpand = supportsAriaExpanded(element)

    element.addEventListener('pointerenter', onPointerEnter as EventListener)
    element.addEventListener('mouseenter', onMouseEnter)
    element.addEventListener('mouseleave', onMouseLeave)
    element.addEventListener('pointerdown', onPointerDown as EventListener)
    if (shouldListenFocus(element)) {
      element.addEventListener('focusin', onFocusIn)
      element.addEventListener('focusout', onFocusOut)
    }
    applyTriggerAttributes()
  }

  function unbind(): void {
    if (bound == null)
      return
    bound.removeEventListener('pointerenter', onPointerEnter as EventListener)
    bound.removeEventListener('mouseenter', onMouseEnter)
    bound.removeEventListener('mouseleave', onMouseLeave)
    bound.removeEventListener('pointerdown', onPointerDown as EventListener)
    bound.removeEventListener('focusin', onFocusIn)
    bound.removeEventListener('focusout', onFocusOut)
    restoreTriggerAttributes()
    bound = null
    describedByBefore = null
    haspopupBefore = null
    controlsBefore = null
    expandedBefore = null
    canExpand = false
  }

  // 同步监听：组件在 onMounted / onUpdated 里写 ref，属性要立刻落到元素上。
  watch(triggerRef, (element) => {
    if (element == null)
      unbind()
    else
      bind(element)
  }, { flush: 'sync' })

  watch(isOpen, (visible) => {
    applyTriggerAttributes()
    if (typeof document === 'undefined')
      return
    if (visible)
      document.addEventListener('pointerdown', onDocumentPointerDown, true)
    else
      document.removeEventListener('pointerdown', onDocumentPointerDown, true)
  }, { immediate: true })

  watch(() => toValue(options.isOpen), (open) => {
    clearTimers()
    if (open === undefined)
      return
    // 使用方自己设的受控值只是同步进来，不再回报给它。
    layer.isOpen.value = open
  })

  watch(() => toValue(options.isEnabled), (enabled) => {
    if (!enabled)
      hideNow()
  })

  onMounted(() => {
    if (typeof document === 'undefined')
      return
    document.addEventListener('pointerdown', onModalityPointerDown, { capture: true, passive: true })
    document.addEventListener('keydown', onModalityKeyDown, { capture: true, passive: true })
    if (isControlled.value) {
      if (toValue(options.isOpen) === true)
        layer.isOpen.value = true
      return
    }
    if (options.isDefaultOpen === true)
      showNow()
  })

  onScopeDispose(() => {
    clearTimers()
    unbind()
    if (typeof document === 'undefined')
      return
    document.removeEventListener('pointerdown', onModalityPointerDown, true)
    document.removeEventListener('keydown', onModalityKeyDown, true)
    document.removeEventListener('pointerdown', onDocumentPointerDown, true)
  })

  function show(): void {
    showNow()
  }

  function hide(): void {
    clearTimers()
    isHoveringContent = false
    layer.hide()
  }

  const contentProps = computed<Record<string, unknown>>(() => {
    const props: Record<string, unknown> = {
      id: layer.id,
      role: isDialog.value ? 'dialog' : 'group',
      onMouseenter: onContentMouseEnter,
      onMouseleave: onContentMouseLeave,
      onFocusout: onContentFocusOut,
    }
    if (isDialog.value)
      props['aria-label'] = toValue(options.label)
    return props
  })

  return {
    isOpen,
    triggerRef,
    contentRef: layer.contentRef,
    id: layer.id,
    anchorId: layer.anchorId,
    describedBy: layer.id,
    contentStyle: layer.contentStyle,
    resolvedPlacement: layer.resolvedPlacement,
    isDialog,
    contentProps,
    show,
    hide,
  }
}
