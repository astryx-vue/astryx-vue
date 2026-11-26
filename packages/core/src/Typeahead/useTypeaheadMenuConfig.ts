import type { ComputedRef, Ref } from 'vue'
import type { TypeaheadHandle, TypeaheadMenuConfig } from './types.js'
import { computed, nextTick, ref, watch } from 'vue'
import { devWarn } from '../composables/useDevWarning.js'

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

interface MenuConfigOptions {
  config: () => TypeaheadMenuConfig | undefined
  popupEl: () => HTMLElement | null
  inputEl: () => HTMLElement | null
  /** 结果列表这一半：打开、关闭和是否打开。 */
  listbox: { isOpen: Readonly<Ref<boolean>>, open: () => void, close: () => void }
  isDisabled: () => boolean
  /** 结果列表现在有东西可显示：有聚焦清单，或输入框里有查询。没有时 `open()` 不开空列表。 */
  canOpenList: () => boolean
  /** 输入框被值标签盖住时，dialog 关闭后焦点还给谁。 */
  returnTarget?: () => HTMLElement | null
}

export interface TypeaheadMenuConfigApi extends TypeaheadHandle {
  isDialog: ComputedRef<boolean>
  /** 菜单现在是否显示：dialog 角色看 dialog，listbox 角色看结果列表。 */
  popupOpen: ComputedRef<boolean>
  /** dialog 菜单开着时，输入框和菜单里的 Escape 先关掉它。关掉了返回 true，这次按键就算处理过。 */
  closeOnEscape: (event: KeyboardEvent) => boolean
  /** 点在字段和菜单之外：关掉 dialog，不抢走点击落到的焦点。 */
  dismiss: () => void
  /** 选择期间调用方在 `change` 里调了 `open()`：菜单跟着这次选择保持打开。 */
  beginPick: () => void
  endPick: () => boolean
}

/**
 * 菜单的角色：结果列表（listbox）或会拿走焦点的内容（dialog），以及用 `open()` 打开它的方法。
 *
 * - dialog 只能由 `open()` 打开，输入、聚焦、方向键都不会；打开后焦点进到里面，
 *   Escape 或 `close()` 关掉后焦点回到打开它时的元素，那个元素没了就回到输入框。
 * - listbox 的 `open()` 显示结果，需要时先加载。
 * - 在 `change` 里调用 `open()`：这次选择之后菜单保持打开，换成 dialog 时挂在同一个锚点上不闪。
 */
export function useTypeaheadMenuConfig(options: MenuConfigOptions): TypeaheadMenuConfigApi {
  const isDialog = computed(() => options.config()?.role === 'dialog')
  const dialogOpen = ref(false)
  const popupOpen = computed(() => isDialog.value ? dialogOpen.value : options.listbox.isOpen.value)
  let opener: HTMLElement | null = null
  let requestedInPick = false

  function popupHolds(element: Element | null): boolean {
    return element != null && options.popupEl()?.contains(element) === true
  }

  /** 焦点掉在菜单里、或没处可去时，才送回打开它的元素。点到别处的焦点不抢。 */
  function restoreFocus(): void {
    const active = document.activeElement
    if (active != null && active !== document.body && !popupHolds(active))
      return
    const target = opener?.isConnected ? opener : (options.returnTarget?.() ?? options.inputEl())
    opener = null
    target?.focus()
  }

  function focusInside(): void {
    const popup = options.popupEl()
    const first = popup?.querySelector<HTMLElement>(FOCUSABLE)
    ;(first ?? popup)?.focus()
  }

  function open(): void {
    if (options.isDisabled())
      return
    const active = document.activeElement
    opener = active instanceof HTMLElement && !popupHolds(active) ? active : null
    requestedInPick = true
    // 等调用方这一轮渲染完再动手：同时换了菜单角色的话，这时才是新的角色。
    void nextTick(() => {
      if (options.isDisabled())
        return
      if (isDialog.value) {
        options.listbox.close()
        dialogOpen.value = true
        void nextTick(focusInside)
      }
      else if (options.canOpenList()) {
        options.listbox.open()
      }
    })
  }

  function close(): void {
    if (dialogOpen.value) {
      dialogOpen.value = false
      void nextTick(restoreFocus)
    }
    else {
      options.listbox.close()
    }
  }

  function dismiss(): void {
    dialogOpen.value = false
    opener = null
  }

  watch(isDialog, (dialog) => {
    if (!dialog)
      dialogOpen.value = false
  })
  watch(() => options.isDisabled(), (disabled) => {
    if (disabled)
      dialogOpen.value = false
  })

  // 开发期：结果列表角色里，要点的东西应该是列表里的结果，放在列表外面方向键够不到。
  watch(popupOpen, (isOpen) => {
    if (!isOpen || isDialog.value)
      return
    void nextTick(() => {
      const popup = options.popupEl()
      const list = popup?.querySelector('[role="listbox"], [role="grid"]')
      if (!popup || !list)
        return
      const outside = [...popup.querySelectorAll<HTMLElement>(FOCUSABLE)].some(control => !list.contains(control) && control !== popup)
      if (outside)
        devWarn('Typeahead', 'a control sits outside the result list in the menu. Anything a person acts on belongs in the list as a result, so the arrow keys reach it.')
    })
  })

  function closeOnEscape(event: KeyboardEvent): boolean {
    if (event.key !== 'Escape' || !isDialog.value || !popupOpen.value)
      return false
    event.preventDefault()
    event.stopPropagation()
    close()
    return true
  }

  return {
    isDialog,
    popupOpen,
    open,
    close,
    closeOnEscape,
    dismiss,
    beginPick: () => {
      requestedInPick = false
    },
    endPick: () => {
      const requested = requestedInPick
      requestedInPick = false
      return requested
    },
  }
}
