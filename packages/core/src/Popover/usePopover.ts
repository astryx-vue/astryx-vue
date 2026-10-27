import type { ComputedRef, CSSProperties, MaybeRefOrGetter, Ref } from 'vue'
import type { LayerPlacement } from '../layer/position.js'
import type { PopoverAlignment, PopoverPlacement, PopoverRole } from './types.js'
import { computed, nextTick, onScopeDispose, shallowRef, toValue, watch } from 'vue'
import { useDismiss } from '../composables/useDismiss.js'
import { useFocusTrap } from '../composables/useFocusTrap.js'
import { useLayer } from '../composables/useLayer.js'
import { useRestoreFocus } from '../composables/useRestoreFocus.js'
import { focusElement, getFocusables } from '../layer/focus.js'

export interface UsePopoverOptions {
  /**
   * 相对触发元素的方位。
   * @default 'below'
   */
  placement?: MaybeRefOrGetter<PopoverPlacement>
  /**
   * 沿方位轴的对齐方式。
   * @default 'start'
   */
  alignment?: MaybeRefOrGetter<PopoverAlignment>
  /**
   * 受控的打开状态。不传就自己管。
   */
  isOpen?: MaybeRefOrGetter<boolean | undefined>
  /**
   * 是否响应触发器的点击。
   * @default true
   */
  isEnabled?: MaybeRefOrGetter<boolean>
  /**
   * 点击外部是否关闭。
   * @default true
   */
  hasLightDismiss?: MaybeRefOrGetter<boolean>
  /**
   * 按 Escape 是否关闭。
   * @default true
   */
  hasEscapeDismiss?: MaybeRefOrGetter<boolean>
  /**
   * 打开后是否把焦点移进内容。
   * `role="dialog"` 且内容里没有可聚焦元素时，焦点落到内容容器上。
   * @default true
   */
  hasAutoFocus?: MaybeRefOrGetter<boolean>
  /**
   * 初始焦点要跳过的元素选择器，例如组件自带的关闭按钮。
   */
  closeButtonSelector?: string
  /**
   * `role="dialog"` 时给浮层的无障碍名称。没有可见标题时请务必提供。
   */
  dialogLabel?: MaybeRefOrGetter<string | undefined>
  /**
   * 内容容器的 ARIA role。
   * 真正的对话内容用 `dialog`；菜单、列表框这类自己带 role 的弹层用 `none`，
   * 并让触发器保持 DOM 焦点。
   * @default 'dialog'
   */
  role?: MaybeRefOrGetter<PopoverRole>
  /**
   * `role="dialog"` 时是否模态。
   * @default true
   */
  isModal?: MaybeRefOrGetter<boolean>
  /** 浮层显示后调用。 */
  onShow?: () => void
  /** 浮层隐藏后调用。 */
  onHide?: () => void
}

export interface UsePopoverReturn {
  /** 浮层当前是否打开。 */
  isOpen: Ref<boolean>
  /** 触发器元素。hook 会给它挂点击、键盘和 ARIA 关系。 */
  triggerRef: Ref<HTMLElement | null>
  /** 定位用的锚点元素。不传就用 `triggerRef`。 */
  anchorRef: Ref<HTMLElement | null>
  /** 浮层内容容器。 */
  contentRef: Ref<HTMLElement | null>
  /** 浮层的唯一 ID。 */
  id: string
  /** 锚点的 CSS 标识，用于高级定位场景。 */
  anchorId: string
  /** 浮层的内联定位样式。 */
  contentStyle: ComputedRef<CSSProperties>
  /** 实际生效的方位（空间不够时会翻转）。 */
  resolvedPlacement: ComputedRef<LayerPlacement>
  /** 直接摊到内容容器上的属性：ID、role、aria-modal、aria-label、tabindex。 */
  surfaceProps: ComputedRef<Record<string, unknown>>
  /** 触发器上要摊的 ARIA 属性。hook 也会自动写到 `triggerRef` 指向的元素上。 */
  triggerProps: ComputedRef<Record<string, unknown>>
  /** 打开浮层。 */
  show: () => void
  /** 关闭浮层。 */
  hide: () => void
  /** 在打开和关闭之间切换。 */
  toggle: () => void
}

const GAP = 4

/**
 * 对应原版 Astryx 的 `hooks/usePopover`：点击触发、能把焦点管起来的浮层。
 * 在 `useLayer` 之上叠了焦点陷阱、自动聚焦、点击外部 / Escape 关闭和 ARIA 关系，
 * `Popover` 组件内部也用它。
 *
 * ```ts
 * const { triggerRef, contentRef, contentStyle, surfaceProps } = usePopover({ dialogLabel: 'Actions' })
 * ```
 */
export function usePopover(options: UsePopoverOptions = {}): UsePopoverReturn {
  const triggerRef = shallowRef<HTMLElement | null>(null)
  const anchorRef = shallowRef<HTMLElement | null>(null)

  const layer = useLayer({
    mode: 'context',
    anchor: computed(() => anchorRef.value ?? triggerRef.value),
    placement: () => toValue(options.placement) ?? 'below',
    alignment: () => toValue(options.alignment) ?? 'start',
    gap: GAP,
    onShow: () => options.onShow?.(),
    onHide: () => options.onHide?.(),
  })

  const isOpen = layer.isOpen

  function role(): PopoverRole {
    return toValue(options.role) ?? 'dialog'
  }

  function isModalDialog(): boolean {
    return role() === 'dialog' && (toValue(options.isModal) ?? true)
  }

  function isEnabled(): boolean {
    return toValue(options.isEnabled) ?? true
  }

  useFocusTrap({
    container: layer.contentRef,
    isEnabled: computed(() => isOpen.value && isModalDialog()),
  })

  useRestoreFocus({
    isEnabled: computed(() => role() === 'dialog'),
    shouldRestore: isOpen,
  })

  useDismiss({
    container: layer.contentRef,
    trigger: triggerRef,
    isEnabled: computed(() => isOpen.value && (toValue(options.hasLightDismiss) ?? true)),
    dismissOnEscape: computed(() => (toValue(options.hasEscapeDismiss) ?? true) ? 'close' : 'block'),
    onDismiss: () => layer.hide(),
  })

  function setOpen(next: boolean): void {
    if (next)
      layer.show()
    else
      layer.hide()
  }

  function toggle(): void {
    setOpen(!isOpen.value)
  }

  function focusInitialTarget(): void {
    const surface = layer.contentRef.value
    if (!surface)
      return
    const selector = options.closeButtonSelector
    const first = getFocusables(surface).find(element => selector == null || !element.closest(selector))
    if (first && focusElement(first))
      return
    if (role() === 'dialog')
      focusElement(surface)
  }

  function onTriggerClick(): void {
    if (!isEnabled())
      return
    toggle()
  }

  function onTriggerKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter' && event.key !== ' ')
      return
    event.preventDefault()
    onTriggerClick()
  }

  let bound: HTMLElement | null = null
  let haspopupBefore: string | null = null
  let expandedBefore: string | null = null
  let controlsBefore: string | null = null

  function applyTriggerAttributes(): void {
    const element = triggerRef.value
    if (!element)
      return
    element.setAttribute('aria-haspopup', role() === 'dialog' ? 'dialog' : 'true')
    element.setAttribute('aria-expanded', String(isOpen.value))
    element.setAttribute('aria-controls', layer.id)
  }

  function restoreTriggerAttributes(): void {
    const element = bound
    if (!element)
      return
    if (haspopupBefore)
      element.setAttribute('aria-haspopup', haspopupBefore)
    else
      element.removeAttribute('aria-haspopup')
    if (expandedBefore)
      element.setAttribute('aria-expanded', expandedBefore)
    else
      element.removeAttribute('aria-expanded')
    if (controlsBefore)
      element.setAttribute('aria-controls', controlsBefore)
    else
      element.removeAttribute('aria-controls')
  }

  function bind(element: HTMLElement): void {
    if (bound === element)
      return
    unbind()
    bound = element
    haspopupBefore = element.getAttribute('aria-haspopup')
    expandedBefore = element.getAttribute('aria-expanded')
    controlsBefore = element.getAttribute('aria-controls')
    element.addEventListener('click', onTriggerClick)
    // 真的 <button> 自己会把 Enter / 空格转成 click，role="button" 的元素不会。
    if (element.tagName !== 'BUTTON' && element.getAttribute('role') === 'button')
      element.addEventListener('keydown', onTriggerKeydown)
    applyTriggerAttributes()
  }

  function unbind(): void {
    if (bound == null)
      return
    bound.removeEventListener('click', onTriggerClick)
    bound.removeEventListener('keydown', onTriggerKeydown)
    restoreTriggerAttributes()
    bound = null
    haspopupBefore = null
    expandedBefore = null
    controlsBefore = null
  }

  // 同步监听：组件在 onMounted / onUpdated 里写 ref，属性和监听要立刻落到元素上。
  watch(triggerRef, (element) => {
    if (element == null)
      unbind()
    else
      bind(element)
  }, { flush: 'sync' })

  watch(isOpen, (open) => {
    applyTriggerAttributes()
    if (open) {
      if ((toValue(options.hasAutoFocus) ?? true) && role() === 'dialog')
        void nextTick(focusInitialTarget)
      return
    }
    // 焦点还在浮层里时，关掉之后要回到触发器，否则它会掉到 body 上。
    const hadFocus = layer.contentRef.value?.contains(typeof document !== 'undefined' ? document.activeElement : null) ?? false
    const trigger = triggerRef.value
    if (hadFocus && trigger)
      void nextTick(() => focusElement(trigger))
  }, { immediate: true })

  watch(() => toValue(options.isOpen), (open) => {
    if (open === undefined)
      return
    layer.isOpen.value = open
  })

  watch(() => toValue(options.isEnabled), (enabled) => {
    if (!enabled && isOpen.value)
      setOpen(false)
  })

  // bind() 建立的监听和 ARIA 快照都挂在触发器元素上，作用域结束时必须还原。
  onScopeDispose(unbind)

  const surfaceProps = computed<Record<string, unknown>>(() => {
    const props: Record<string, unknown> = { id: layer.id }
    if (role() === 'dialog') {
      props.role = 'dialog'
      props['aria-label'] = toValue(options.dialogLabel)
      props.tabindex = -1
      if (toValue(options.isModal) ?? true)
        props['aria-modal'] = 'true'
    }
    return props
  })

  const triggerProps = computed<Record<string, unknown>>(() => ({
    'aria-haspopup': role() === 'dialog' ? 'dialog' : 'true',
    'aria-expanded': String(isOpen.value),
    'aria-controls': layer.id,
  }))

  return {
    isOpen,
    triggerRef,
    anchorRef,
    contentRef: layer.contentRef,
    id: layer.id,
    anchorId: layer.anchorId,
    contentStyle: layer.contentStyle,
    resolvedPlacement: layer.resolvedPlacement,
    surfaceProps,
    triggerProps,
    show: () => setOpen(true),
    hide: () => setOpen(false),
    toggle,
  }
}
