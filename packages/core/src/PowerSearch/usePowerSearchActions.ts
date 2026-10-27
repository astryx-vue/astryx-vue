import type { Component, ComputedRef, Ref } from 'vue'
import type { PowerSearchMessages } from '../locale/messages/power-search.js'
import type { PowerSearchLookup } from './config.js'
import type { EditorPlacement } from './placement.js'
import type {
  PartialFilter,
  PowerSearchChangeType,
  PowerSearchComponents,
  PowerSearchField,
  PowerSearchFilter,
  PowerSearchItem,
  PowerSearchOperator,
  PowerSearchProps,
} from './types.js'
import { computed, nextTick, ref } from 'vue'
import { useLayerGutter } from '../LayerProvider/context.js'
import { resolveEditorPlacement } from './placement.js'
import PowerSearchEditor from './PowerSearchEditor.vue'

interface EditorSession {
  mode: 'create' | 'edit'
  index: number
  filter: PartialFilter
  placement: EditorPlacement
  ready: boolean
  control: HTMLElement | null
}

export interface PowerSearchMenuBridge {
  query: Ref<string>
  close: () => void
  setQuery: (value: string) => void
  onKeyDown: (event: KeyboardEvent) => void
}

/**
 * 筛选条件的增删改，以及编辑器的打开、保存和键盘移动。
 * 菜单的搜索和定位留在组件里，因为那一层跟着输入框的锚点走。
 */
interface PowerSearchActions {
  activate: (index: number) => void
  canRemove: (filter: PowerSearchFilter) => boolean
  clearAll: (event?: Event) => void
  closeEditor: (restore: boolean) => void
  editorComponent: ComputedRef<Component>
  editorOpen: ComputedRef<boolean>
  editorStyle: ComputedRef<{ top: string, left: string, width: string } | undefined>
  fieldFor: (filter: PowerSearchFilter) => PowerSearchField | undefined
  filters: ComputedRef<readonly PowerSearchFilter[]>
  onEditorSave: (filter: PowerSearchFilter | null) => void
  onInput: (event: Event) => void
  onInputKeyDown: (event: KeyboardEvent) => void
  onTokenKeyDown: (event: KeyboardEvent, index: number) => void
  openingControl: Ref<HTMLElement | null>
  operatorFor: (filter: PowerSearchFilter) => PowerSearchOperator | undefined
  pick: (item: PowerSearchItem) => void
  removeAt: (index: number) => void
  session: Ref<EditorSession | null>
  setTokenEl: (index: number, element: unknown) => void
  tokenComponent: (filter: PowerSearchFilter) => Component | undefined
}

export function usePowerSearchActions(options: {
  props: PowerSearchProps
  emit: {
    (event: 'update:filters', filters: PowerSearchFilter[]): void
    (event: 'change', filters: PowerSearchFilter[], changeType: PowerSearchChangeType, index: number): void
  }
  hasCustomEditor: () => boolean
  menu: PowerSearchMenuBridge
  anchorRef: Ref<HTMLElement | null>
  inputRef: Ref<HTMLInputElement | null>
  lookup: ComputedRef<PowerSearchLookup>
  text: ComputedRef<PowerSearchMessages>
  announce: (message: string) => void
  visibleCount: () => number
}): PowerSearchActions {
  const { props, emit, menu, lookup, text, announce } = options
  const gutter = useLayerGutter()
  const internal = ref<PowerSearchFilter[]>([])
  const filters = computed(() => props.filters ?? internal.value)
  const session = ref<EditorSession | null>(null)
  const openingControl = ref<HTMLElement | null>(null)
  const editorOpen = computed(() => session.value != null)
  const tokenEls = new Map<number, HTMLElement>()

  const editorStyle = computed(() => {
    const place = session.value?.placement
    if (place == null)
      return undefined
    return {
      top: `${place.top}px`,
      left: `${place.left}px`,
      width: `${place.width}px`,
    }
  })

  const editorComponent = computed(() => {
    const filter = session.value?.filter
    if (filter?.operator == null)
      return PowerSearchEditor
    const operator = lookup.value.getOperator(filter.field, filter.operator)
    const type = operator?.value.type
    return (type ? props.components?.[type]?.editor : undefined) ?? PowerSearchEditor
  })

  function commit(next: PowerSearchFilter[], changeType: PowerSearchChangeType, index: number): void {
    internal.value = next
    emit('update:filters', next)
    emit('change', next, changeType, index)
  }

  function operatorFor(filter: PowerSearchFilter): PowerSearchOperator | undefined {
    return lookup.value.getOperator(filter.field, filter.operator)
  }

  function fieldFor(filter: PowerSearchFilter): PowerSearchField | undefined {
    return lookup.value.getField(filter.field)
  }

  function emptyEditorOverridden(components: PowerSearchComponents | undefined): boolean {
    return Boolean(components?.empty?.editor || options.hasCustomEditor())
  }

  function canEdit(filter: PowerSearchFilter): boolean {
    if (props.disabled || props.readOnly || filter.isReadOnly)
      return false
    const operator = operatorFor(filter)
    if (operator == null)
      return false
    if (operator.value.type !== 'empty')
      return true
    return emptyEditorOverridden(props.components)
  }

  function canRemove(filter: PowerSearchFilter): boolean {
    return !props.disabled && !props.readOnly && filter.isReadOnly !== true
  }

  function tokenComponent(filter: PowerSearchFilter): Component | undefined {
    const type = operatorFor(filter)?.value.type
    return type ? props.components?.[type]?.token : undefined
  }

  function measure(control: HTMLElement | null): EditorPlacement | null {
    const outer = options.anchorRef.value
    if (outer == null)
      return null
    const target = control ?? outer
    const outerRect = outer.getBoundingClientRect()
    const controlRect = target.getBoundingClientRect()
    const edges = gutter.value
    return resolveEditorPlacement({
      outer: { left: outerRect.left, right: outerRect.right, width: outerRect.width },
      control: { left: controlRect.left, right: controlRect.right, width: controlRect.width },
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      inlineStart: edges.inlineStart,
      inlineEnd: edges.inlineEnd,
      blockInset: edges.blockStart,
      direction: getComputedStyle(outer).direction === 'rtl' ? 'rtl' : 'ltr',
      anchorTop: controlRect.top,
      anchorBottom: controlRect.bottom,
    })
  }

  function openEditor(mode: 'create' | 'edit', filter: PartialFilter, index: number, control: HTMLElement | null): void {
    const placement = measure(control)
    if (placement == null)
      return
    menu.close()
    openingControl.value = control
    session.value = { mode, index, filter, placement, ready: false, control }
    void nextTick(() => {
      requestAnimationFrame(() => {
        if (session.value)
          session.value = { ...session.value, ready: true }
      })
    })
  }

  function closeEditor(restore: boolean): void {
    const control = session.value?.control
    session.value = null
    openingControl.value = null
    if (!restore)
      return
    void nextTick(() => {
      if (control instanceof HTMLElement)
        control.focus()
      else
        options.inputRef.value?.focus()
    })
  }

  function focusInput(): void {
    void nextTick(() => options.inputRef.value?.focus())
  }

  function pick(item: PowerSearchItem): void {
    const data = item.auxiliaryData
    if (data == null)
      return
    const field = lookup.value.getField(data.fieldKey)
    const operator = (data.operatorKey ? lookup.value.getOperator(data.fieldKey, data.operatorKey) : undefined)
      ?? lookup.value.getDefaultOperator(data.fieldKey)
    if (field == null || operator == null)
      return
    menu.setQuery('')
    menu.close()
    if (data.filterValue != null || operator.value.type === 'empty') {
      const value = data.filterValue ?? { type: 'empty' as const }
      const next = [...filters.value, { field: field.key, operator: operator.key, value }]
      commit(next, 'add', next.length - 1)
      announce(`${field.label}: ${operator.key}`)
      focusInput()
      return
    }
    openEditor('create', { field: field.key, operator: operator.key }, filters.value.length, options.inputRef.value)
  }

  function onEditorSave(filter: PowerSearchFilter | null): void {
    const current = session.value
    if (current == null)
      return
    if (filter == null) {
      if (current.mode === 'edit') {
        const dropped = filters.value[current.index]
        const next = filters.value.filter((_, index) => index !== current.index)
        commit(next, 'remove', current.index)
        announce(text.value.removeFilter(dropped ? fieldFor(dropped)?.label ?? dropped.field : ''))
      }
      closeEditor(false)
      focusInput()
      return
    }
    if (current.mode === 'edit') {
      const next = filters.value.map((item, index) => index === current.index ? filter : item)
      commit(next, 'edit', current.index)
    }
    else {
      const next = [...filters.value, filter]
      commit(next, 'add', next.length - 1)
    }
    const field = lookup.value.getField(filter.field)
    announce(field?.label ?? filter.field)
    closeEditor(false)
    focusInput()
  }

  function removeAt(index: number): void {
    const filter = filters.value[index]
    if (filter == null || !canRemove(filter))
      return
    const next = filters.value.filter((_, itemIndex) => itemIndex !== index)
    commit(next, 'remove', index)
    announce(text.value.removeFilter(fieldFor(filter)?.label ?? filter.field))
    focusInput()
  }

  function clearAll(event?: Event): void {
    event?.stopPropagation()
    if (props.disabled || filters.value.length === 0)
      return
    commit([], 'remove', 0)
    announce(text.value.clear)
    menu.close()
    options.inputRef.value?.focus()
  }

  function activate(index: number): void {
    const filter = filters.value[index]
    if (filter == null || props.disabled || props.readOnly || filter.isReadOnly)
      return
    const operator = operatorFor(filter)
    // 内置编辑器对空运算符没有可改的值。点标签时按「保存」提交一次，而不是打开后再靠副作用保存。
    if (operator?.value.type === 'empty' && !emptyEditorOverridden(props.components)) {
      const next = filters.value.map((item, itemIndex) => itemIndex === index
        ? { field: item.field, operator: item.operator, value: { type: 'empty' as const }, isReadOnly: item.isReadOnly }
        : item)
      commit(next, 'edit', index)
      return
    }
    if (!canEdit(filter))
      return
    openEditor('edit', filter, index, tokenEls.get(index) ?? null)
  }

  function setTokenEl(index: number, element: unknown): void {
    if (element instanceof HTMLElement)
      tokenEls.set(index, element)
    else
      tokenEls.delete(index)
  }

  function focusToken(index: number): void {
    void nextTick(() => tokenEls.get(index)?.focus())
  }

  function onInput(event: Event): void {
    if (props.disabled || props.readOnly)
      return
    menu.setQuery((event.target as HTMLInputElement).value)
  }

  function onInputKeyDown(event: KeyboardEvent): void {
    if (session.value != null)
      return
    const input = options.inputRef.value
    if (event.key === 'Backspace' && menu.query.value === '' && filters.value.length > 0 && canRemove(filters.value[filters.value.length - 1]!)) {
      event.preventDefault()
      removeAt(filters.value.length - 1)
      return
    }
    if (event.key === 'ArrowLeft' && input && input.selectionStart === 0 && input.selectionEnd === 0 && filters.value.length > 0) {
      event.preventDefault()
      focusToken(Math.min(options.visibleCount(), filters.value.length) - 1)
      return
    }
    if (event.key === 'ArrowRight' && input && menu.query.value === '' && input.selectionStart === 0)
      return
    menu.onKeyDown(event)
  }

  function onTokenKeyDown(event: KeyboardEvent, index: number): void {
    const shown = options.visibleCount()
    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault()
      focusToken(index - 1)
    }
    else if (event.key === 'ArrowRight') {
      event.preventDefault()
      if (index < shown - 1)
        focusToken(index + 1)
      else
        options.inputRef.value?.focus()
    }
    else if (event.key === 'Escape') {
      options.inputRef.value?.focus()
    }
    else if ((event.key === 'Backspace' || event.key === 'Delete') && canRemove(filters.value[index]!)) {
      event.preventDefault()
      removeAt(index)
      if (index > 0)
        focusToken(index - 1)
    }
    else if (event.key === 'Enter') {
      event.preventDefault()
      activate(index)
    }
  }

  return {
    activate,
    canRemove,
    clearAll,
    closeEditor,
    editorComponent,
    editorOpen,
    editorStyle,
    fieldFor,
    filters,
    onEditorSave,
    onInput,
    onInputKeyDown,
    onTokenKeyDown,
    openingControl,
    operatorFor,
    pick,
    removeAt,
    session,
    setTokenEl,
    tokenComponent,
  }
}
