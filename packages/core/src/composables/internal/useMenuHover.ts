import type { MaybeRefOrGetter, Ref } from 'vue'
import { getCurrentScope, onScopeDispose, toValue, watch } from 'vue'
import { useListFocus } from '../useListFocus.js'
import { useMediaQuery } from '../useMediaQuery.js'
import { createHideTimer } from './hoverIntent.js'

/** 悬停打开后，这段时间内的一次点击是「确认」而不是关闭。 */
export const MENU_HOVER_CLICK_GUARD_MS = 500

/**
 * 关闭后这段时间内触发器上的 mouseenter 不算数。
 *
 * 盖在自己触发器上的面板一关，触发器又回到静止的指针下面，浏览器会补一个 mouseenter，
 * 把刚关掉的菜单又打开。按时间算而不是只挡一次，几秒后真的再悬停照样能开；真正的 mouseleave 会提前清掉它。
 */
export const MENU_HOVER_REOPEN_SUPPRESS_MS = 300

export interface UseMenuHoverOptions {
  /** 打开。悬停打开时会传 `{ skipAutoFocus: true }`，焦点留在触发器上。 */
  show: (options?: { skipAutoFocus?: boolean }) => void
  hide: () => void
  isOpen: MaybeRefOrGetter<boolean>
  /** 为假时所有处理函数什么都不做，正在等的悬停打开也会作废。 */
  isEnabled: MaybeRefOrGetter<boolean>
  /** 悬停多久打开，毫秒。@default 150 */
  showDelay?: MaybeRefOrGetter<number>
  /** 离开触发器或菜单多久关闭，毫秒。@default 200 */
  hideDelay?: MaybeRefOrGetter<number>
  /** 悬停打开后多长时间内点击算确认。0 表示每次点击都切换。@default 500 */
  clickGuardMs?: MaybeRefOrGetter<number>
  /** 菜单可聚焦项的选择器，交给 `useListFocus`。@default '[role="menuitem"]' */
  itemSelector?: string
  /**
   * 弹层的 DOM id。弹层是原生 `popover="auto"`、触发器又在它外面时传：
   * 触发器会带上 `popovertarget`，成为弹层的调用者，点它不会被浏览器的点外关闭先关掉。
   */
  popoverId?: string
  /**
   * 点击或键盘打开时，由这里移动焦点。面板是对话框而不是菜单（没有菜单项可聚焦）时传 false，
   * 焦点交给弹层自己的焦点陷阱。@default true
   */
  ownsFocus?: boolean
  /** 飞出层元素，给不用 `menuRef` 的调用方。安全三角从它的近边算；不传时没有三角。 */
  flyoutRef?: Ref<HTMLElement | null>
}

export interface UseMenuHoverReturn {
  /** 用 `v-bind` 摊到触发器上。 */
  triggerProps: {
    onClick: (event?: MouseEvent) => void
    onMouseenter: () => void
    /** 把事件传进来：指针离开触发器的位置是安全三角的顶点。 */
    onMouseleave: (event?: MouseEvent) => void
    popovertarget?: string
  }
  /** 用 `v-bind` 摊到菜单内容上。 */
  contentProps: {
    onMouseenter: () => void
    onMouseleave: (event?: MouseEvent) => void
    onKeydown: (event: KeyboardEvent) => void
  }
  /** 菜单列表元素，绑到内容的 `ref` 上。 */
  menuRef: Ref<HTMLElement | null>
  /** 聚焦第一个可用项。没有时返回 false。 */
  focusFirst: () => boolean
  /** 聚焦第一个可用项；菜单空着或还在加载时聚焦菜单容器。 */
  focusMenu: () => void
  /** 自己处理点击的调用方在「已打开」分支里调：返回 true 表示这是悬停打开后的确认点击，菜单已钉住，不要当成关闭。 */
  confirmHoverOpen: () => boolean
  /** 关闭，并把焦点还给触发器。给面板里的关闭按钮用。 */
  close: () => void
  /** 记下触发器元素，关闭时焦点回到它。 */
  setTriggerEl: (el: Element | null) => void
}

/**
 * 对应原版 Astryx 的 `hooks/useMenuHover`（内部用，和原版一样不从包入口导出）。
 *
 * 悬停是在普通弹层行为上的增强：点击切换，Escape 和点外关闭，方向键导航；
 * 再加上：鼠标进入后延时打开，离开时关掉由悬停打开的那一次。
 *
 * 三个不明显但很要紧的行为：
 * 1. 悬停后点击的保护。悬停打开时菜单已经在指针下面了，紧跟着的那一下点击会把它关掉。
 *    `clickGuardMs` 内的点击改为确认：菜单钉住，之后就像点击打开的一样。
 * 2. 焦点同步移动。点击或键盘打开后立刻把焦点放进第一项；悬停打开时指针在主导，焦点留在触发器上。
 * 3. 原生点外关闭。`popoverId` 让触发器成为弹层的调用者，点它不算点外。
 *
 * 另外：触发器在悬停等待期间被禁用时，那个已经排好的打开会作废，菜单保持关闭。
 */
export function useMenuHover(options: UseMenuHoverOptions): UseMenuHoverReturn {
  const ownsFocus = options.ownsFocus ?? true
  const hasHover = useMediaQuery('(hover: hover)')

  let showTimer: ReturnType<typeof setTimeout> | null = null
  let triggerEl: HTMLElement | null = null
  /** 这次是悬停打开的，所以离开可以关。 */
  let isHoverMode = false
  let closedAt = 0
  /** 这次打开是悬停打开的时刻；确认或关闭后为 0。 */
  let hoverOpenedAt = 0

  const isOpen = (): boolean => toValue(options.isOpen)
  const isEnabled = (): boolean => toValue(options.isEnabled)
  const clickGuardMs = (): number => toValue(options.clickGuardMs) ?? MENU_HOVER_CLICK_GUARD_MS

  const list = useListFocus({ itemSelector: options.itemSelector, onEscape: () => onEscape() })
  const menuRef = list.listRef
  const hideTimer = createHideTimer(() => toValue(options.hideDelay) ?? 200, () => options.hide())

  function clearTimeouts(): void {
    if (showTimer != null) {
      clearTimeout(showTimer)
      showTimer = null
    }
    hideTimer.clear()
  }

  // 不管是什么关掉的，都在这里记一笔。同步回调，赶在浏览器对消失的面板做命中测试、补发 mouseenter 之前。
  watch(isOpen, (open, wasOpen) => {
    if (wasOpen && !open) {
      isHoverMode = false
      hoverOpenedAt = 0
      closedAt = Date.now()
    }
  }, { flush: 'sync' })

  watch(isEnabled, (enabled) => {
    if (!enabled)
      clearTimeouts()
  }, { flush: 'sync' })

  if (getCurrentScope() != null)
    onScopeDispose(clearTimeouts)

  function close(): void {
    // 先读再关：关掉弹层本身会移动焦点。
    const menuHadFocus = typeof document !== 'undefined' && (menuRef.value?.contains(document.activeElement) ?? false)
    options.hide()
    if (menuHadFocus)
      triggerEl?.focus()
  }

  function onEscape(): void {
    clearTimeouts()
    close()
  }

  function focusMenu(): void {
    // 空的或还在加载的菜单没有可聚焦项，聚焦容器，键盘的归属照样从触发器移走。
    if (!list.focusFirst())
      menuRef.value?.focus()
  }

  function openAndFocus(): void {
    if (!ownsFocus) {
      options.show()
      return
    }
    options.show({ skipAutoFocus: true })
    focusMenu()
  }

  function resetHover(): void {
    closedAt = 0
    isHoverMode = false
    hoverOpenedAt = 0
  }

  function confirmHoverOpen(): boolean {
    const guard = clickGuardMs()
    const isConfirming = guard > 0 && hoverOpenedAt > 0 && Date.now() - hoverOpenedAt < guard
    if (!isConfirming)
      return false
    isHoverMode = false
    hoverOpenedAt = 0
    return true
  }

  function onClick(event?: MouseEvent): void {
    if (!isEnabled())
      return
    // 取消调用者默认的切换，这里是唯一的判断来源；popovertarget 仍然让触发器免于点外关闭。
    if (options.popoverId != null)
      event?.preventDefault()
    clearTimeouts()
    // Enter / Space 以 detail 为 0 的 click 到达，总是打开。键盘用户能停在一个已开菜单的触发器上，
    // 只是因为悬停打开把焦点留在了这里；这时关掉会把他们关在一个看得见的菜单外面。
    if (event != null && event.detail === 0) {
      resetHover()
      if (!isOpen())
        openAndFocus()
      else if (ownsFocus)
        focusMenu()
      return
    }
    if (!isOpen()) {
      resetHover()
      openAndFocus()
      return
    }
    if (confirmHoverOpen()) {
      if (ownsFocus)
        focusMenu()
      return
    }
    close()
  }

  function onTriggerMouseEnter(): void {
    if (!isEnabled() || !hasHover.value)
      return
    if (closedAt > 0 && Date.now() - closedAt < MENU_HOVER_REOPEN_SUPPRESS_MS)
      return
    // 再次进入已开菜单的触发器不能解除钉住、也不能重新开始保护期，否则下一次有意的点击又成了「确认」，菜单关不掉。
    if (isOpen()) {
      clearTimeouts()
      return
    }
    isHoverMode = true
    clearTimeouts()
    const openByHover = (): void => {
      showTimer = null
      if (!isEnabled())
        return
      hoverOpenedAt = Date.now()
      options.show({ skipAutoFocus: true })
    }
    const delay = toValue(options.showDelay) ?? 150
    if (delay > 0)
      showTimer = setTimeout(openByHover, delay)
    else
      openByHover()
  }

  function onMouseLeave(event?: MouseEvent): void {
    if (!isEnabled())
      return
    // 真正的离开结束了「指针没动」那种情况，下一次进入是有意的。
    closedAt = 0
    if (!isHoverMode)
      return
    clearTimeouts()
    const apex = event == null ? null : { x: event.clientX, y: event.clientY }
    hideTimer.schedule(apex, options.flyoutRef?.value ?? menuRef.value, isOpen())
  }

  function onContentMouseEnter(): void {
    if (isEnabled())
      clearTimeouts()
  }

  function onContentKeyDown(event: KeyboardEvent): void {
    if (isEnabled())
      list.handleKeyDown(event)
  }

  function setTriggerEl(el: Element | null): void {
    triggerEl = el instanceof HTMLElement ? el : null
  }

  const triggerProps: UseMenuHoverReturn['triggerProps'] = {
    onClick,
    onMouseenter: onTriggerMouseEnter,
    onMouseleave: onMouseLeave,
  }
  if (options.popoverId != null)
    triggerProps.popovertarget = options.popoverId

  return {
    close,
    confirmHoverOpen,
    contentProps: { onKeydown: onContentKeyDown, onMouseenter: onContentMouseEnter, onMouseleave: onMouseLeave },
    focusFirst: list.focusFirst,
    focusMenu,
    menuRef,
    setTriggerEl,
    triggerProps,
  }
}
