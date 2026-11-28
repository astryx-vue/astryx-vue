<script setup lang="ts" generic="T extends SearchableItem">
import type { SheetDraftChange } from '../composables/internal/sheetDraft.js'
/**
 * Tokenizer `presentation="bottom-sheet"` 的触屏弹层（上游 TokenizerBottomSheet.tsx）。
 *
 * 一次打开编辑一份草稿，草稿从 `value` 开始；勾选行、新建行、「全部清除」都只改草稿，
 * 按「保存」才交出一次。打开期间行不挪位置，下次打开才把已选的排到前面。
 *
 * 用户自己关（保存、下滑、点遮罩、Escape）会清空查询，下次打开列出初始清单；字段被
 * 禁用而强制关上时查询留着。草稿改过时，下滑、点遮罩、Escape 先问要不要放弃。
 */
import type { SearchableItem, SearchSource } from '../composables/useAsyncSource.js'
import { computed, nextTick, provide, ref, shallowRef, useTemplateRef, watch } from 'vue'
import { LazyBottomSheet } from '../BottomSheet/lazyBottomSheet.js'
import Button from '../Button/Button.vue'
import CheckboxIndicator from '../CheckboxIndicator/CheckboxIndicator.vue'
import { useBusyAnnouncement } from '../composables/internal/busyAnnouncement.js'
import { dismissSearchOnTouchDrag } from '../composables/internal/dismissSearchOnTouchDrag.js'
import { hasSameSelection, nameSheetDraftChange } from '../composables/internal/sheetDraft.js'
import { useAnnounce } from '../composables/useAnnounce.js'
import EmptyState from '../EmptyState/EmptyState.vue'
import Icon from '../Icon/Icon.vue'
import SheetConfirmation from '../layer/SheetConfirmation.vue'
import { useComponentMessages } from '../locale/context.js'
import { alertDialogMessages } from '../locale/messages/alert-dialog.js'
import { tokenizerMessages } from '../locale/messages/tokenizer.js'
import Spinner from '../Spinner/Spinner.vue'
import { spinnerOwnerKey } from '../Spinner/SpinnerOwnerContext.js'
import Text from '../Text/Text.vue'
import TextInput from '../TextInput/TextInput.vue'
import { useTokenizerSheetSearch } from './useTokenizerSheetSearch.js'
import '../../styles/tokenizer-sheet.css'

defineOptions({ name: 'AstryxTokenizerBottomSheet' })

const props = defineProps<{
  isOpen: boolean
  /** 字段标签：给弹层、搜索框和确认框命名。 */
  label: string
  /** 弹层关上、退场播完后拿回焦点的触发器。 */
  finalFocus: HTMLElement | null
  /** 这次呈现开始时的查询。 */
  initialQuery: string
  searchSource: SearchSource<T>
  /** 已提交的选择，草稿从它开始。 */
  value: readonly T[]
  maxEntries?: number
  hasCreate: boolean
  maxMenuItems: number
  minQueryLength: number
  debounceMs: number
  /** 没有结果时的标题。 */
  emptySearchText?: string | null
}>()

const emit = defineEmits<{
  /** 弹层要关上（保存、干净的关闭、确认放弃）。 */
  close: []
  /** 「保存」交出整份草稿和还成立的最后一次编辑。 */
  commit: [items: T[], change: SheetDraftChange<T>]
  changeQuery: [query: string]
  motionComplete: [motion: 'entering' | 'exiting']
}>()

defineSlots<{ empty?: () => unknown }>()

const CREATABLE_ID_PREFIX = '__xds_create__'

const messages = useComponentMessages({ tokenizer: tokenizerMessages, alertDialog: alertDialogMessages })
const announce = useAnnounce()
// 面板自己播报搜索，里面的加载圈保持安静。
provide(spinnerOwnerKey, true)
const searchInput = useTemplateRef<{ element: HTMLInputElement | null, focus: (options?: FocusOptions) => void }>('searchInput')
const listRef = useTemplateRef<HTMLElement>('listRef')
const clearAllButton = useTemplateRef<{ element: HTMLElement | null }>('clearAllButton')

// ---- 草稿 ----
const valueAtOpen = shallowRef<T[]>([...props.value])
const draft = shallowRef<T[]>([...props.value])
const selectedAtOpen = shallowRef<T[]>([...props.value])
let lastDraftChange: SheetDraftChange<T> | null = null
const isDraftDirty = computed(() => !hasSameSelection(valueAtOpen.value, draft.value))
const selectedIds = computed(() => new Set(draft.value.map(item => item.id)))
const isAtMax = computed(() => props.maxEntries != null && draft.value.length >= props.maxEntries)
const isDraftOverMax = computed(() => props.maxEntries != null && draft.value.length > props.maxEntries)
const isClearConfirmationOpen = ref(false)
const isDiscardConfirmationOpen = ref(false)

const search = useTokenizerSheetSearch<T>({
  isOpen: () => props.isOpen,
  initialQuery: props.initialQuery,
  searchSource: () => props.searchSource,
  minQueryLength: () => props.minQueryLength,
  maxMenuItems: () => props.maxMenuItems,
  debounceMs: () => props.debounceMs,
  selectedAtOpen: () => selectedAtOpen.value,
  draft: () => draft.value,
})
const { query, isPending, visibleItems, renderedItems } = search
const trimmedQuery = computed(() => query.value.trim())

// 关闭中又打开：重新拍一份打开时的选择，草稿从头来。
watch(() => props.isOpen, (open) => {
  if (!open)
    return
  selectedAtOpen.value = [...props.value]
  valueAtOpen.value = [...props.value]
  draft.value = [...props.value]
  lastDraftChange = null
  isClearConfirmationOpen.value = false
  isDiscardConfirmationOpen.value = false
}, { flush: 'sync' })

/** 输入的文字不在任何选项里时，给一行「创建 …」和后面的「添加」按钮。等这次搜索落定再判断。 */
const createItem = computed<T | null>(() => {
  const trimmed = trimmedQuery.value
  if (!props.hasCreate || trimmed === '' || isAtMax.value || isPending.value)
    return null
  const lowered = trimmed.toLowerCase()
  if (selectedIds.value.has(trimmed)
    || draft.value.some(item => item.label.toLowerCase() === lowered)
    || search.results.value.some(item => item.label.toLowerCase() === lowered)) {
    return null
  }
  return { id: `${CREATABLE_ID_PREFIX}${trimmed}`, label: messages.value.tokenizer.create(trimmed) } as unknown as T
})

const isSettledEmpty = computed(() => !isPending.value && !search.isBelowMinQuery.value && trimmedQuery.value !== ''
  && visibleItems.value.length === 0 && createItem.value == null)
const isSettledBlank = computed(() => !isPending.value && !search.isBelowMinQuery.value && trimmedQuery.value === ''
  && visibleItems.value.length === 0 && createItem.value == null)

useBusyAnnouncement(() => props.isOpen && isPending.value, () => messages.value.tokenizer.loading, () => listRef.value)

// 每次搜索落定播报一次结果数；空状态由 EmptyState 自己念。
watch(search.settledCount, () => {
  if (!props.isOpen || isSettledEmpty.value || trimmedQuery.value === '')
    return
  announce(messages.value.tokenizer.resultCount(visibleItems.value.length + (createItem.value ? 1 : 0) + search.hiddenMatchCount.value))
}, { flush: 'post' })

function changeQuery(next: string): void {
  search.setQuery(next)
  emit('changeQuery', next)
}

function closeSheet(): void {
  if (query.value !== '')
    changeQuery('')
  emit('close')
}

/** 下滑、点遮罩、Escape：草稿改过时先问。 */
function onSheetOpenChange(open: unknown): void {
  if (open !== false)
    return
  if (isDraftDirty.value)
    isDiscardConfirmationOpen.value = true
  else
    closeSheet()
}

function toggle(item: T): void {
  const selected = selectedIds.value.has(item.id)
  if (!selected && isAtMax.value)
    return
  if (selected) {
    draft.value = draft.value.filter(entry => entry.id !== item.id)
    lastDraftChange = { item, type: 'remove' }
    announce(messages.value.tokenizer.removed(item.label))
  }
  else {
    draft.value = [...draft.value, item]
    lastDraftChange = { item, type: 'add' }
    announce(messages.value.tokenizer.added(item.label))
  }
}

function create(): void {
  const value = trimmedQuery.value
  const created = { id: value, label: value } as T
  draft.value = [...draft.value, created]
  lastDraftChange = { item: created, type: 'create' }
  announce(messages.value.tokenizer.added(value))
  changeQuery('')
  // 这一行随查询一起没了，焦点回到搜索框，接着输下一个。
  searchInput.value?.focus()
}

function save(): void {
  if (isDraftOverMax.value)
    return
  const change = isDraftDirty.value ? nameSheetDraftChange(valueAtOpen.value, draft.value, lastDraftChange) : null
  if (change != null)
    emit('commit', [...draft.value], change)
  closeSheet()
}

function closeClearConfirmation(confirmed: boolean): void {
  isClearConfirmationOpen.value = false
  void nextTick(() => {
    // 清空后「全部清除」变成 aria-disabled，但仍能聚焦，焦点留在它上面。
    clearAllButton.value?.element?.focus()
    if (confirmed)
      announce(messages.value.tokenizer.allRemoved)
  })
}

function confirmClear(): void {
  const last = draft.value.at(-1)
  if (last != null) {
    draft.value = []
    lastDraftChange = { item: last, type: 'remove' }
  }
  closeClearConfirmation(true)
}

/** 「继续编辑」：确认框没了，焦点回到搜索框，弹层自己的阅读顺序从那里开始。 */
function keepEditing(): void {
  isDiscardConfirmationOpen.value = false
  void nextTick(() => searchInput.value?.focus({ preventScroll: true }))
}

function discard(): void {
  isDiscardConfirmationOpen.value = false
  closeSheet()
}

// 一次落定的搜索拿走了有焦点的那一行：焦点交给搜索框，不掉到弹层后面的页面上。
let isRowFocused = false
watch(renderedItems, () => {
  if (!props.isOpen || isPending.value || !isRowFocused)
    return
  const active = document.activeElement
  if (active == null || active === document.body) {
    isRowFocused = false
    searchInput.value?.focus()
  }
}, { flush: 'post' })

function onListFocusIn(event: FocusEvent): void {
  isRowFocused = event.target instanceof HTMLElement && event.target.getAttribute('role') === 'checkbox'
}

function onListFocusOut(event: FocusEvent): void {
  // 有焦点的行被卸载时不发 focusout；发了就是焦点真的去了别处。
  if (event.relatedTarget != null)
    isRowFocused = false
}

/** 焦点走到最后一行就画下一批：Tab 和方向键不用滚动也能走到每一行。 */
function onRowFocus(index: number): void {
  if (index === renderedItems.value.length - 1 && renderedItems.value.length < visibleItems.value.length)
    search.renderMore()
}

// 在结果上直接拖动：焦点从搜索框挪到弹层面板上，键盘收起，查询保留。
const listDrag = dismissSearchOnTouchDrag(
  () => [searchInput.value?.element],
  () => listRef.value?.closest<HTMLElement>('[tabindex="-1"]'),
)

const searchLabel = computed(() => messages.value.tokenizer.search(props.label))
</script>

<template>
  <LazyBottomSheet
    :is-open="isOpen"
    :label="label"
    height="tall"
    :padding="0"
    :final-focus-ref="finalFocus"
    @update:is-open="onSheetOpenChange"
    @motion-complete="emit('motionComplete', $event)"
  >
    <div class="astryx-tokenizer-sheet">
      <div class="astryx-tokenizer-sheet__search">
        <TextInput
          ref="searchInput"
          :model-value="query"
          :label="searchLabel"
          is-label-hidden
          :placeholder="messages.tokenizer.searchPlaceholder"
          start-icon="search"
          size="lg"
          width="100%"
          has-clear
          @update:model-value="changeQuery($event ?? '')"
        />
      </div>
      <!-- 弹层内容区已经用标签命名了，列表再叫同一个名字会念两遍。 -->
      <div
        ref="listRef"
        class="astryx-tokenizer-sheet__list"
        :aria-busy="isPending || undefined"
        :data-rendered-count="renderedItems.length"
        :data-total-count="visibleItems.length"
        @touchstart="listDrag.onTouchstart"
        @touchmove="listDrag.onTouchmove"
        @touchend="listDrag.onTouchend"
        @touchcancel="listDrag.onTouchcancel"
        @focusin="onListFocusIn"
        @focusout="onListFocusOut"
        @scroll="search.onScroll"
      >
        <div v-if="createItem" class="astryx-tokenizer-sheet__create-row">
          <Text class="astryx-tokenizer-sheet__create-label" type="body">
            {{ createItem.label }}
          </Text>
          <Button
            :label="messages.tokenizer.add"
            :aria-label="messages.tokenizer.addValue(trimmedQuery)"
            variant="secondary"
            size="lg"
            @click="create"
          />
        </div>
        <div v-if="isPending" class="astryx-tokenizer-sheet__pending">
          <Spinner size="md" :label="messages.tokenizer.loading" />
        </div>
        <div v-if="isSettledEmpty" class="astryx-tokenizer-sheet__empty">
          <slot name="empty">
            <EmptyState
              :title="emptySearchText ?? messages.tokenizer.empty"
              :description="messages.tokenizer.noResultsDescription"
              is-compact
            >
              <template #icon>
                <Icon icon="search" size="lg" color="secondary" />
              </template>
            </EmptyState>
          </slot>
        </div>
        <div v-else-if="!isSettledBlank" role="list" class="astryx-tokenizer-sheet__rows">
          <div
            v-for="(item, index) in renderedItems"
            :key="item.id"
            role="listitem"
            class="astryx-tokenizer-sheet__row-item"
            :aria-setsize="visibleItems.length"
            :aria-posinset="index + 1"
          >
            <button
              type="button"
              role="checkbox"
              class="astryx-tokenizer-sheet__row"
              :aria-checked="selectedIds.has(item.id)"
              :aria-label="item.label"
              :aria-disabled="(!selectedIds.has(item.id) && isAtMax) || undefined"
              @focus="onRowFocus(index)"
              @click="toggle(item)"
            >
              <Text class="astryx-tokenizer-sheet__row-label" type="body">
                {{ item.label }}
              </Text>
              <CheckboxIndicator
                :state="selectedIds.has(item.id) ? 'checked' : 'unchecked'"
                size="md"
                :is-disabled="!selectedIds.has(item.id) && isAtMax"
              />
            </button>
          </div>
        </div>
      </div>
      <div class="astryx-tokenizer-sheet__footer">
        <Button
          ref="clearAllButton"
          class="astryx-tokenizer-sheet__footer-action"
          :label="messages.tokenizer.clear"
          variant="secondary"
          size="lg"
          :is-disabled="draft.length === 0"
          :tooltip="draft.length === 0 ? messages.tokenizer.nothingToClear : undefined"
          @click="isClearConfirmationOpen = true"
        />
        <Button
          class="astryx-tokenizer-sheet__footer-action"
          :label="messages.tokenizer.save"
          variant="primary"
          size="lg"
          :is-disabled="isDraftOverMax"
          :tooltip="isDraftOverMax ? messages.tokenizer.selectionLimit(maxEntries ?? 0) : undefined"
          @click="save"
        />
      </div>
      <SheetConfirmation
        :is-open="isClearConfirmationOpen"
        :title="messages.tokenizer.clearAllTitle"
        :description="messages.tokenizer.clearAllDescription(label)"
        :cancel-label="messages.alertDialog.cancel"
        :action-label="messages.tokenizer.clearSelection"
        @open-change="$event || closeClearConfirmation(false)"
        @action="confirmClear"
      />
      <SheetConfirmation
        :is-open="isDiscardConfirmationOpen"
        :title="messages.tokenizer.discardChangesTitle"
        :description="messages.tokenizer.discardChangesDescription(label)"
        :cancel-label="messages.tokenizer.keepEditing"
        :action-label="messages.tokenizer.discardChanges"
        @open-change="$event || keepEditing()"
        @action="discard"
      />
    </div>
  </LazyBottomSheet>
</template>
