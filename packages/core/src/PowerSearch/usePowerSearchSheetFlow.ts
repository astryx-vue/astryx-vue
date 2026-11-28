import type { ComputedRef, Ref, ShallowRef } from 'vue'
import type { PowerSearchLookup } from './config.js'
import type { DraftEdit, DraftReport } from './sheetDraftEdits.js'
import type { FilterValue, PowerSearchChangeType, PowerSearchField, PowerSearchFilter, PowerSearchItem, PowerSearchOperator } from './types.js'
import { computed, ref, shallowRef, watch } from 'vue'
import { hasSameFilters, replayDraftEdits } from './sheetDraftEdits.js'
import { filterSignature, nearestEditableIndex, resolveFilterIdentityIndex } from './sheetFilterIdentity.js'

export type SheetStep = 'manage' | 'fields' | 'value'

/** 换步骤之后焦点该落在哪。 */
export type PendingSheetFocus
  = | { readonly type: 'manager-add' }
    | { readonly type: 'content-search' }
    | {
      readonly type: 'manager-filter'
      readonly sourceFilter: PowerSearchFilter
      readonly sourceSignature: string
      readonly preferredIndex: number
      /** 删除之后落到那一行末尾的删除按钮上，连着删不用重新瞄准。 */
      readonly part?: 'remove'
    }
    | { readonly type: 'field', readonly fieldKey: string }

/** 值那一步正在编辑的条件。 */
export interface FilterDraft {
  readonly mode: 'create' | 'edit'
  /** 这次流程里打开过几次值那一步：编辑器按它重建，同一字段的两个条件不共用状态。 */
  readonly generation: number
  /** 从「添加筛选条件」里的哪个控件来的，取消时回到那里。 */
  readonly returnFocus?: 'field' | 'content-search'
  readonly filterIndex?: number
  readonly sourceFilter?: PowerSearchFilter
  readonly sourceSignature?: string
  readonly field: string
  readonly operator?: string
  readonly value?: FilterValue
}

export interface PowerSearchSheetFlowOptions {
  isOpen: () => boolean
  /** 字段已提交的条件，草稿从它开始。 */
  committed: () => readonly PowerSearchFilter[]
  lookup: () => PowerSearchLookup
  isInteractive: () => boolean
  /** 「完成」把草稿的改动按顺序交给它。 */
  commit: DraftReport
  /** 整个流程关上。 */
  close: () => void
  /** 一个条件读出来的文字。 */
  describe: (filter: PowerSearchFilter) => string
  /** 换步骤之后要播报的话。 */
  announce: (message: string) => void
  added: (label: string) => string
  removed: (label: string) => string
  cleared: (keptReadOnly: boolean) => string
}

export interface PowerSearchSheetFlow {
  step: Readonly<Ref<SheetStep | null>>
  /** 草稿里的条件。 */
  filters: Readonly<ShallowRef<readonly PowerSearchFilter[]>>
  draft: Readonly<ShallowRef<FilterDraft | null>>
  pendingFocus: ShallowRef<PendingSheetFocus | null>
  fieldQuery: Readonly<Ref<string>>
  contentQuery: Readonly<Ref<string>>
  isClearConfirmationOpen: Readonly<Ref<boolean>>
  isDiscardConfirmationOpen: Ref<boolean>
  isInteractive: ComputedRef<boolean>
  isDraftDirty: ComputedRef<boolean>
  /** 从触发器直接进了「添加筛选条件」（没有条件时）。 */
  isDirectEntry: ComputedRef<boolean>
  isManageSheetOpen: ComputedRef<boolean>
  isFieldsSheetOpen: ComputedRef<boolean>
  isValueSheetOpen: ComputedRef<boolean>
  isRowButton: (filter: PowerSearchFilter) => boolean
  isImmediateAddField: (field: PowerSearchField) => boolean
  commitAndClose: () => void
  requestDismiss: () => void
  discard: () => void
  openFieldList: () => void
  handleFieldSelect: (field: PowerSearchField) => void
  handleContentSuggestionSelect: (item: PowerSearchItem | null | undefined) => void
  handleFilterEdit: (index: number) => void
  handleRemoveFilter: (index: number) => void
  setFieldQuery: (query: string) => void
  setContentQuery: (query: string) => void
  openClearConfirmation: () => void
  closeClearConfirmation: (confirmed: boolean) => void
  handleOperatorSelect: (operator: PowerSearchOperator) => void
  setDraftValue: (value: FilterValue) => void
  /** 值被清空：草稿回到没有值。 */
  unstageDraft: () => void
  handleSave: () => void
  commitSavedFilter: (current: FilterDraft, filter: PowerSearchFilter) => void
  returnFromValue: () => void
  handleRemove: () => void
  onManageOpenChange: (open: boolean) => void
  onFieldsOpenChange: (open: boolean) => void
  onValueOpenChange: (open: boolean) => void
}

function resolveDraftFilterIndex(filters: readonly PowerSearchFilter[], draft: FilterDraft): number | null {
  if (draft.mode !== 'edit' || draft.filterIndex == null || draft.sourceFilter == null || draft.sourceSignature == null)
    return null
  return resolveFilterIdentityIndex(filters, draft.sourceFilter, draft.sourceSignature, draft.filterIndex)
}

function filterFocus(filter: PowerSearchFilter, preferredIndex: number, part?: 'remove'): PendingSheetFocus {
  return { type: 'manager-filter', sourceFilter: filter, sourceSignature: filterSignature(filter), preferredIndex, part }
}

/**
 * PowerSearch 触屏底部弹层的流程（上游 PowerSearchBottomSheet 的状态部分）：「筛选条件」「添加筛选条件」
 * 和值那一步三张弹层叠着开，每一步开在引出它的那张上面。
 *
 * 一次打开编辑一份草稿，草稿从已提交的条件开始，每次改动都记下来；按「完成」把改动按顺序
 * 重放到字段最新的条件上，字段在这期间变成只读或禁用就什么都不报。草稿改过时关闭先确认。
 */
export function usePowerSearchSheetFlow(options: PowerSearchSheetFlowOptions): PowerSearchSheetFlow {
  const filtersAtOpen = shallowRef<readonly PowerSearchFilter[]>([])
  const filters = shallowRef<readonly PowerSearchFilter[]>([])
  let edits: DraftEdit[] = []
  const step = ref<SheetStep | null>(null)
  const fieldPickerOrigin = ref<'manage' | 'trigger'>('manage')
  const draft = shallowRef<FilterDraft | null>(null)
  let generation = 0
  const fieldQuery = ref('')
  const contentQuery = ref('')
  const isClearConfirmationOpen = ref(false)
  const isDiscardConfirmationOpen = ref(false)
  const pendingFocus = shallowRef<PendingSheetFocus | null>(null)

  const isInteractive = computed(options.isInteractive)
  const isDraftDirty = computed(() => !hasSameFilters(filtersAtOpen.value, filters.value))
  const isDirectEntry = computed(() => fieldPickerOrigin.value === 'trigger')
  const isManageSheetOpen = computed(() => step.value === 'manage'
    || (step.value === 'fields' && !isDirectEntry.value)
    || (step.value === 'value' && (draft.value?.mode === 'edit' || !isDirectEntry.value)))
  const isFieldsSheetOpen = computed(() => step.value === 'fields' || (step.value === 'value' && draft.value?.mode === 'create'))
  const isValueSheetOpen = computed(() => step.value === 'value')

  watch(options.isOpen, (open) => {
    if (open) {
      const committed = options.committed()
      filtersAtOpen.value = committed
      filters.value = committed
      edits = []
      const startsOnAddFilter = committed.length === 0 && isInteractive.value
      fieldQuery.value = ''
      contentQuery.value = ''
      pendingFocus.value = null
      step.value = startsOnAddFilter ? 'fields' : 'manage'
      fieldPickerOrigin.value = startsOnAddFilter ? 'trigger' : 'manage'
    }
    else {
      step.value = null
      isClearConfirmationOpen.value = false
      isDiscardConfirmationOpen.value = false
    }
  }, { immediate: true })

  /** 草稿里的一次改动：记下来，按「完成」时重放。 */
  function change(next: readonly PowerSearchFilter[], changeType: PowerSearchChangeType, index: number): void {
    edits.push({ before: filters.value, after: next, changeType, index })
    filters.value = next
  }

  function isRowButton(filter: PowerSearchFilter): boolean {
    return !filter.isReadOnly && isInteractive.value
  }

  function isImmediateAddField(field: PowerSearchField): boolean {
    const operators = options.lookup().getVisibleOperators(field.key)
    return operators.length === 1 && operators[0]!.value.type === 'empty'
  }

  function goTo(next: SheetStep, focus: PendingSheetFocus | null): void {
    pendingFocus.value = focus
    step.value = next
  }

  function closeFlow(): void {
    pendingFocus.value = null
    step.value = null
    options.close()
  }

  function commitAndClose(): void {
    if (isDraftDirty.value && isInteractive.value)
      replayDraftEdits(options.committed(), edits, options.commit)
    edits = []
    closeFlow()
  }

  function requestDismiss(): void {
    if (isDraftDirty.value)
      isDiscardConfirmationOpen.value = true
    else
      closeFlow()
  }

  function discard(): void {
    isDiscardConfirmationOpen.value = false
    edits = []
    closeFlow()
  }

  function openFieldList(): void {
    if (!isInteractive.value)
      return
    fieldPickerOrigin.value = 'manage'
    fieldQuery.value = ''
    contentQuery.value = ''
    goTo('fields', null)
  }

  function addAtOnce(filter: PowerSearchFilter, label: string): void {
    const index = filters.value.length
    change([...filters.value, filter], 'add', index)
    options.announce(options.added(label))
    goTo('manage', filterFocus(filter, index))
  }

  function openCreateEditor(field: PowerSearchField, operator: PowerSearchOperator, returnFocus: 'field' | 'content-search' = 'field'): void {
    draft.value = {
      mode: 'create',
      generation: ++generation,
      returnFocus,
      field: field.key,
      operator: operator.key,
      value: operator.value.type === 'empty' ? { type: 'empty' } : undefined,
    }
    goTo('value', null)
  }

  function handleFieldSelect(field: PowerSearchField): void {
    if (!isInteractive.value)
      return
    const lookup = options.lookup()
    if (isImmediateAddField(field)) {
      const operator = lookup.getVisibleOperators(field.key)[0]!
      const filter: PowerSearchFilter = { field: field.key, operator: operator.key, value: { type: 'empty' } }
      addAtOnce(filter, options.describe(filter))
      return
    }
    const operator = lookup.getDefaultOperator(field.key) ?? field.operators[0]
    if (operator != null)
      openCreateEditor(field, operator)
  }

  function handleContentSuggestionSelect(item: PowerSearchItem | null | undefined): void {
    const aux = item?.auxiliaryData
    if (!isInteractive.value || item == null || aux == null)
      return
    const lookup = options.lookup()
    const field = lookup.getField(aux.fieldKey)
    const operator = aux.operatorKey == null ? lookup.getDefaultOperator(aux.fieldKey) : lookup.getOperator(aux.fieldKey, aux.operatorKey)
    if (field == null || operator == null)
      return
    contentQuery.value = ''
    if (aux.filterValue != null) {
      addAtOnce({ field: field.key, operator: operator.key, value: aux.filterValue }, item.label)
      return
    }
    openCreateEditor(field, operator, 'content-search')
  }

  function handleFilterEdit(index: number): void {
    const filter = filters.value[index]
    if (!isInteractive.value || filter == null || filter.isReadOnly)
      return
    draft.value = {
      mode: 'edit',
      generation: ++generation,
      filterIndex: index,
      sourceFilter: filter,
      sourceSignature: filterSignature(filter),
      field: filter.field,
      operator: filter.operator,
      value: filter.value,
    }
    goTo('value', null)
  }

  function handleRemoveFilter(index: number): void {
    const filter = filters.value[index]
    if (!isInteractive.value || filter == null || filter.isReadOnly)
      return
    const next = filters.value.filter((_, i) => i !== index)
    const nextIndex = nearestEditableIndex(next, index, isRowButton)
    pendingFocus.value = nextIndex == null ? { type: 'manager-add' } : filterFocus(next[nextIndex]!, nextIndex, 'remove')
    change(next, 'remove', index)
    options.announce(options.removed(options.describe(filter)))
  }

  function closeClearConfirmation(confirmed: boolean): void {
    const kept = filters.value.filter(filter => filter.isReadOnly)
    const firstRemovedIndex = filters.value.findIndex(filter => !filter.isReadOnly)
    isClearConfirmationOpen.value = false
    if (!confirmed || !isInteractive.value || firstRemovedIndex < 0)
      return
    change(kept, 'remove', firstRemovedIndex)
    pendingFocus.value = { type: 'manager-add' }
    options.announce(options.cleared(kept.length > 0))
  }

  function updateDraft(patch: Partial<FilterDraft>): void {
    if (draft.value != null)
      draft.value = { ...draft.value, ...patch }
  }

  /** 换运算符：值的类型一样才留着；`empty` 运算符直接带上空值。 */
  function handleOperatorSelect(operator: PowerSearchOperator): void {
    const current = draft.value
    if (current == null)
      return
    const keepsValue = current.value != null && current.value.type === operator.value.type
    updateDraft({
      operator: operator.key,
      value: operator.value.type === 'empty' ? { type: 'empty' } : keepsValue ? current.value : undefined,
    })
  }

  /** 值那一步交回一个条件（保存或自定义编辑器的 onSave）：写进草稿，回到「筛选条件」。 */
  function commitSavedFilter(current: FilterDraft, filter: PowerSearchFilter): void {
    if (!isInteractive.value) {
      goTo('manage', { type: 'manager-add' })
      return
    }
    if (current.mode === 'create') {
      change([...filters.value, filter], 'add', filters.value.length)
      goTo('manage', { type: 'manager-add' })
      return
    }
    const index = resolveDraftFilterIndex(filters.value, current)
    if (index == null || filters.value[index]?.isReadOnly) {
      // 原来那个条件被父组件删了、有歧义或变成只读：什么都不写。
      const fallback = current.sourceFilter != null && current.filterIndex != null
        ? filterFocus(current.sourceFilter, current.filterIndex)
        : { type: 'manager-add' as const }
      goTo('manage', fallback)
      return
    }
    change(filters.value.map((existing, i) => (i === index ? filter : existing)), 'edit', index)
    goTo('manage', filterFocus(filter, index))
  }

  function handleSave(): void {
    const current = draft.value
    if (current?.value == null || current.operator == null)
      return
    commitSavedFilter(current, { field: current.field, operator: current.operator, value: current.value })
  }

  function returnFromValue(): void {
    const current = draft.value
    if (current == null) {
      goTo('manage', { type: 'manager-add' })
      return
    }
    if (current.mode === 'edit' && current.sourceFilter != null && current.filterIndex != null) {
      goTo('manage', filterFocus(current.sourceFilter, resolveDraftFilterIndex(filters.value, current) ?? current.filterIndex))
      return
    }
    if (current.returnFocus === 'content-search')
      goTo('fields', { type: 'content-search' })
    else
      goTo('fields', { type: 'field', fieldKey: current.field })
  }

  /** 自定义编辑器交回 null：编辑中就删掉这个条件，新建时什么都不加。 */
  function handleRemove(): void {
    const current = draft.value
    if (current?.mode !== 'edit') {
      goTo('manage', { type: 'manager-add' })
      return
    }
    const index = resolveDraftFilterIndex(filters.value, current)
    step.value = 'manage'
    if (index == null || filters.value[index]?.isReadOnly)
      pendingFocus.value = { type: 'manager-add' }
    else
      handleRemoveFilter(index)
  }

  function onManageOpenChange(open: boolean): void {
    if (!open && step.value === 'manage')
      requestDismiss()
  }

  function onFieldsOpenChange(open: boolean): void {
    if (open || step.value !== 'fields')
      return
    if (isDirectEntry.value)
      requestDismiss()
    else
      goTo('manage', { type: 'manager-add' })
  }

  function onValueOpenChange(open: boolean): void {
    if (!open && step.value === 'value')
      returnFromValue()
  }

  return {
    step,
    filters,
    draft,
    pendingFocus,
    fieldQuery,
    contentQuery,
    isClearConfirmationOpen,
    isDiscardConfirmationOpen,
    isInteractive,
    isDraftDirty,
    isDirectEntry,
    isManageSheetOpen,
    isFieldsSheetOpen,
    isValueSheetOpen,
    isRowButton,
    isImmediateAddField,
    commitAndClose,
    requestDismiss,
    discard,
    openFieldList,
    handleFieldSelect,
    handleContentSuggestionSelect,
    handleFilterEdit,
    handleRemoveFilter,
    setFieldQuery: (query: string) => {
      fieldQuery.value = query
    },
    setContentQuery: (query: string) => {
      contentQuery.value = query
    },
    openClearConfirmation: () => {
      isClearConfirmationOpen.value = true
    },
    closeClearConfirmation,
    handleOperatorSelect,
    setDraftValue: (value: FilterValue) => updateDraft({ value }),
    unstageDraft: () => updateDraft({ value: undefined }),
    handleSave,
    commitSavedFilter,
    returnFromValue,
    handleRemove,
    onManageOpenChange,
    onFieldsOpenChange,
    onValueOpenChange,
  }
}
