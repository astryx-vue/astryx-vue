<script setup lang="ts">
/**
 * PowerSearch 触屏呈现的弹层流程（上游 PowerSearchBottomSheet.tsx）：「筛选条件」「添加筛选条件」和值那一步
 * 是三张独立的底部弹层，叠着开。状态和规则在 usePowerSearchSheetFlow 里，这里摆放弹层、确认框，
 * 并在换步骤后把焦点放到该去的控件上。
 */
import type { PowerSearchLookup } from './config.js'
import type { DraftReport } from './sheetDraftEdits.js'
import type { PowerSearchComponents, PowerSearchConfig, PowerSearchFilter, PowerSearchItem } from './types.js'
import type { PendingSheetFocus } from './usePowerSearchSheetFlow.js'
import { computed, nextTick, reactive, ref, watch } from 'vue'
import { LazyBottomSheet } from '../BottomSheet/lazyBottomSheet.js'
import { useAnnounce } from '../composables/useAnnounce.js'
import SheetConfirmation from '../layer/SheetConfirmation.vue'
import { useCalendarSystem } from '../locale/calendar.js'
import { useAstryxLocale, useComponentMessages } from '../locale/context.js'
import { powerSearchSheetMessages } from '../locale/messages/power-search-sheet.js'
import { powerSearchMessages } from '../locale/messages/power-search.js'
import { tokenizerMessages } from '../locale/messages/tokenizer.js'
import PowerSearchSheetFields from './PowerSearchSheetFields.vue'
import PowerSearchSheetFilters from './PowerSearchSheetFilters.vue'
import PowerSearchSheetValue from './PowerSearchSheetValue.vue'
import { resolveFilterIdentityIndex } from './sheetFilterIdentity.js'
import { describeSheetFilter, describeSheetFilterParts, sheetEditorTitle } from './sheetFilterText.js'
import { usePowerSearchSheetFlow } from './usePowerSearchSheetFlow.js'
import '../../styles/power-search-sheet.css'

defineOptions({ name: 'AstryxPowerSearchBottomSheet' })

const props = defineProps<{
  isOpen: boolean
  /** 触发器：流程关上时焦点回到这里。 */
  finalFocus: HTMLElement | null
  config: PowerSearchConfig
  lookup: PowerSearchLookup
  /** 已提交的条件，草稿从它开始。 */
  filters: readonly PowerSearchFilter[]
  search: (query: string) => PowerSearchItem[]
  placeholder: string
  isReadOnly: boolean
  isDisabled: boolean
  hasClear: boolean
  maxOperatorMenuItems?: number
  timeZone?: string
  saveLabel?: string
  components?: PowerSearchComponents
}>()

const emit = defineEmits<{
  close: []
  commit: Parameters<DraftReport>
  /** 整个流程的进场、退场：最后一张弹层退场播完才算退场结束。 */
  motionComplete: [motion: 'entering' | 'exiting']
}>()

const messages = useComponentMessages({ powerSearch: powerSearchMessages, powerSearchSheet: powerSearchSheetMessages, tokenizer: tokenizerMessages })
const locale = useAstryxLocale()
const calendar = useCalendarSystem(undefined, 'PowerSearch')
const announce = useAnnounce()

const textContext = computed(() => ({
  lookup: props.lookup,
  messages: messages.value.powerSearch,
  sheet: messages.value.powerSearchSheet,
  locale: locale.value,
  timeZone: props.timeZone,
  calendar: calendar.value,
}))

const flow = usePowerSearchSheetFlow({
  isOpen: () => props.isOpen,
  committed: () => props.filters,
  lookup: () => props.lookup,
  isInteractive: () => !props.isDisabled && !props.isReadOnly,
  commit: (filters, changeType, index) => emit('commit', filters, changeType, index),
  close: () => emit('close'),
  describe: filter => describeSheetFilter(filter, textContext.value),
  announce: message => void nextTick(() => announce(message)),
  added: label => messages.value.tokenizer.added(label),
  removed: label => messages.value.tokenizer.removed(label),
  cleared: keptReadOnly => keptReadOnly ? messages.value.powerSearch.editableFiltersRemoved : messages.value.powerSearch.allFiltersRemoved,
})

const editorTitle = computed(() => sheetEditorTitle(flow.draft.value, textContext.value))
const sheetText = computed(() => messages.value.powerSearchSheet)

// ---- 焦点 ----
const panels = reactive<Record<'manage' | 'fields' | 'value', HTMLElement | null>>({ manage: null, fields: null, value: null })
/** 关上的步骤弹层退场后把焦点还给这里；没有就还给触发器。 */
const stepReturnTarget = ref<HTMLElement | null>(null)
const stepFinalFocus = computed(() => stepReturnTarget.value ?? props.finalFocus)

function setPanel(step: 'manage' | 'fields' | 'value', element: unknown): void {
  panels[step] = element instanceof HTMLElement ? element : null
}

function resolveFocusTarget(target: PendingSheetFocus): HTMLElement | null | undefined {
  if (target.type === 'manager-add')
    return panels.manage?.querySelector<HTMLElement>('[data-sheet-add]')
  if (target.type === 'content-search')
    return panels.fields?.querySelector<HTMLElement>('[data-sheet-content-search] input, input[data-sheet-content-search]')
  if (target.type === 'field')
    return panels.fields?.querySelector<HTMLElement>(`[data-sheet-field="${CSS.escape(target.fieldKey)}"] button`)
  const index = resolveFilterIdentityIndex(flow.filters.value, target.sourceFilter, target.sourceSignature, target.preferredIndex)
  const row = index == null ? null : panels.manage?.querySelector<HTMLElement>(`[data-sheet-filter="${index}"]`)
  const control = target.part === 'remove' ? row?.querySelector<HTMLElement>('[data-sheet-remove]') : row?.querySelector<HTMLElement>('button')
  return control ?? panels.manage?.querySelector<HTMLElement>('[data-sheet-add]')
}

function placePendingFocus(): void {
  const target = flow.pendingFocus.value
  if (target == null)
    return
  const element = resolveFocusTarget(target)
  if (element == null)
    return
  flow.pendingFocus.value = null
  stepReturnTarget.value = element
  element.focus({ preventScroll: true })
}

watch([flow.step, flow.pendingFocus, () => flow.filters.value], () => {
  void nextTick(placePendingFocus)
}, { flush: 'post' })

// ---- 进场、退场 ----
/** 打开过、还没退场播完的弹层。 */
const shownSheets = new Set<string>()

watch([flow.isManageSheetOpen, flow.isFieldsSheetOpen, flow.isValueSheetOpen], ([manage, fields, value]) => {
  if (manage)
    shownSheets.add('manage')
  if (fields)
    shownSheets.add('fields')
  if (value)
    shownSheets.add('value')
}, { immediate: true })

function onMotionComplete(sheet: string, motion: 'entering' | 'exiting'): void {
  if (motion === 'entering') {
    placePendingFocus()
    emit('motionComplete', 'entering')
    return
  }
  shownSheets.delete(sheet)
  if (!props.isOpen && shownSheets.size === 0)
    emit('motionComplete', 'exiting')
}

function closeDiscardConfirmation(): void {
  flow.isDiscardConfirmationOpen.value = false
  void nextTick(() => {
    const panel = flow.step.value === 'manage' ? panels.manage : panels.fields
    const target = panel?.querySelector<HTMLElement>('[data-sheet-add]') ?? panel?.closest<HTMLElement>('[tabindex="-1"]')
    target?.focus({ preventScroll: true })
  })
}

function closeClearConfirmation(confirmed: boolean): void {
  flow.closeClearConfirmation(confirmed)
  if (!confirmed)
    void nextTick(() => panels.manage?.querySelector<HTMLElement>('[data-sheet-clear]')?.focus())
}
</script>

<template>
  <LazyBottomSheet
    :is-open="flow.isManageSheetOpen.value"
    :label="sheetText.filtersTitle"
    height="tall"
    :padding="0"
    :final-focus-ref="finalFocus"
    @update:is-open="(open: unknown) => flow.onManageOpenChange(Boolean(open))"
    @motion-complete="onMotionComplete('manage', $event)"
  >
    <PowerSearchSheetFilters
      :ref="element => setPanel('manage', (element as { $el?: unknown } | null)?.$el)"
      :flow="flow"
      :lookup="lookup"
      :has-clear="hasClear"
      :describe-parts="filter => describeSheetFilterParts(filter, textContext)"
    />
  </LazyBottomSheet>
  <LazyBottomSheet
    :is-open="flow.isFieldsSheetOpen.value"
    :label="sheetText.addFilter"
    height="tall"
    :padding="0"
    :final-focus-ref="stepFinalFocus"
    @update:is-open="(open: unknown) => flow.onFieldsOpenChange(Boolean(open))"
    @motion-complete="onMotionComplete('fields', $event)"
  >
    <PowerSearchSheetFields
      :ref="element => setPanel('fields', (element as { $el?: unknown } | null)?.$el)"
      :flow="flow"
      :lookup="lookup"
      :placeholder="placeholder"
      :search="search"
    />
  </LazyBottomSheet>
  <LazyBottomSheet
    :is-open="flow.isValueSheetOpen.value"
    :label="editorTitle"
    height="tall"
    :padding="0"
    purpose="info"
    :final-focus-ref="stepFinalFocus"
    @update:is-open="(open: unknown) => flow.onValueOpenChange(Boolean(open))"
    @motion-complete="onMotionComplete('value', $event)"
  >
    <PowerSearchSheetValue
      :ref="element => setPanel('value', (element as { $el?: unknown } | null)?.$el)"
      :flow="flow"
      :lookup="lookup"
      :config="config"
      :title="editorTitle"
      :messages="messages.powerSearch"
      :components="components"
      :save-label="saveLabel"
      :is-read-only="isReadOnly"
      :is-disabled="isDisabled"
      :time-zone="timeZone"
      :max-operator-menu-items="maxOperatorMenuItems"
    />
  </LazyBottomSheet>
  <SheetConfirmation
    v-if="flow.isClearConfirmationOpen.value"
    is-open
    :title="sheetText.clearAllTitle"
    :description="sheetText.clearAllDescription"
    :cancel-label="sheetText.clearAllCancel"
    :action-label="sheetText.clearAllConfirm"
    @open-change="$event || closeClearConfirmation(false)"
    @action="closeClearConfirmation(true)"
  />
  <SheetConfirmation
    v-if="flow.isDiscardConfirmationOpen.value"
    is-open
    :title="sheetText.discardTitle"
    :description="sheetText.discardDescription"
    :cancel-label="sheetText.keepEditing"
    :action-label="sheetText.discardConfirm"
    @open-change="$event || closeDiscardConfirmation()"
    @action="flow.discard"
  />
</template>
