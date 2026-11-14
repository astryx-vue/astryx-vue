<script setup lang="ts">
import type { EmojiCategory, EmojiOption, EmojiPickerEmits, EmojiPickerProps } from './types.js'
import { Center, HStack, ScrollableArea, Spinner, Text, TextInput, useAnnounce, useGridFocus, useTranslator, VStack } from '@astryx-vue/core'
import { computed, ref, useId, useTemplateRef, watch } from 'vue'
import { DEFAULT_EMOJI_LIST_HEIGHT, DEFAULT_FREQUENT_EMOJIS, EMOJI_PICKER_COLUMNS } from './constants.js'
import { bundledGroupLabelKey, loadBundledCategories } from './emojiData.js'
import { buildSections, queryWordsOf, toRows } from './filter.js'
import { isImeKeyEvent } from './ime.js'
import { SearchIcon } from './SearchIcon.js'
import '../../styles/emoji-picker.css'

defineOptions({ name: 'AstryxEmojiPicker', inheritAttrs: false })

const props = withDefaults(defineProps<EmojiPickerProps>(), {
  hasAutoFocus: false,
})
const emit = defineEmits<EmojiPickerEmits>()

const { t } = useTranslator()
const announce = useAnnounce()
const query = ref('')
const preview = ref<EmojiOption | null>(null)
const loaded = ref<readonly EmojiCategory[] | 'loading' | 'failed'>('loading')
const searchField = useTemplateRef<InstanceType<typeof TextInput>>('searchField')
const root = useTemplateRef<HTMLElement>('root')
const baseId = useId()

const { gridRef, handleKeyDown, handleFocus, focusFirst } = useGridFocus({
  columns: EMOJI_PICKER_COLUMNS,
  cellSelector: '[role="gridcell"]',
  isCellFocusable: cell => cell.querySelector('button') !== null,
  getFocusTarget: cell => cell.querySelector<HTMLElement>('button'),
  hasRovingTabIndex: true,
  onNavigateBefore: (_column, offset) => {
    if (offset === EMOJI_PICKER_COLUMNS)
      focusSearch()
  },
})

function setGrid(element: unknown): void {
  gridRef.value = element instanceof HTMLElement ? element : null
}

function onGridsFocusOut(event: FocusEvent): void {
  const current = event.currentTarget
  const next = event.relatedTarget
  if (current instanceof Node && next instanceof Node && current.contains(next))
    return
  preview.value = null
}

function focusSearch(): void {
  searchField.value?.focus()
}

// 宿主传入 categories 或组件卸载后，还没回来的内置数据作废，不再覆盖当前内容。
watch(() => props.categories, (categories, _previous, onCleanup) => {
  if (categories != null) {
    loaded.value = categories
    return
  }
  let isCurrent = true
  onCleanup(() => {
    isCurrent = false
  })
  loaded.value = 'loading'
  loadBundledCategories().then(
    (result) => {
      if (isCurrent)
        loaded.value = result
    },
    () => {
      if (isCurrent)
        loaded.value = 'failed'
    },
  )
}, { immediate: true })

const label = computed(() => props.label ?? t('@astryx.emojiPicker.label'))
const searchLabel = computed(() => props.searchLabel ?? t('@astryx.emojiPicker.searchLabel'))
const listHeight = computed(() => props.height ?? DEFAULT_EMOJI_LIST_HEIGHT)
const frequentEmojis = computed(() => props.frequentEmojis ?? DEFAULT_FREQUENT_EMOJIS)
const queryWords = computed(() => queryWordsOf(query.value))
const isLoading = computed(() => loaded.value === 'loading')
const groups = computed(() => Array.isArray(loaded.value) ? loaded.value : [])
const sections = computed(() => buildSections({
  queryWords: queryWords.value,
  frequentEmojis: frequentEmojis.value,
  groups: groups.value,
  frequentLabel: t('@astryx.emojiPicker.frequentlyUsed'),
  searchResultsLabel: t('@astryx.emojiPicker.searchResults'),
  groupLabel: (group) => {
    const labelKey = bundledGroupLabelKey(group)
    return labelKey != null ? t(labelKey) : group.name
  },
}))
const firstMatch = computed(() => sections.value[0]?.emojis[0])
const noResultsMessage = computed(() => {
  if (!isLoading.value && queryWords.value.length > 0 && sections.value.length === 0)
    return t('@astryx.emojiPicker.noResults', { query: query.value.trim() })
  return undefined
})
const showLoading = computed(() => {
  if (!isLoading.value)
    return false
  return queryWords.value.length === 0 || sections.value.length === 0
})

watch(showLoading, (busy) => {
  if (busy)
    announce(t('@astryx.emojiPicker.loading'), 'polite')
})

function pick(option: EmojiOption): void {
  emit('select', option.emoji, option)
}

function onQueryChange(value: string): void {
  query.value = value
  preview.value = null
}

function onSearchEnter(): void {
  if (queryWords.value.length > 0 && firstMatch.value != null)
    pick(firstMatch.value)
}

function onSearchKeyDown(event: KeyboardEvent): void {
  if (isImeKeyEvent(event))
    return
  if (event.key === 'ArrowDown' && firstMatch.value != null) {
    event.preventDefault()
    focusFirst()
  }
}

function sectionLabelId(index: number): string {
  return `${baseId}-group-${index}`
}

defineExpose({ element: root })
</script>

<template>
  <VStack
    ref="root"
    class="astryx-emoji-picker"
    :gap="2"
    width="100%"
    :padding-block-start="3"
    v-bind="$attrs"
  >
    <VStack :padding-inline="3" width="100%">
      <TextInput
        ref="searchField"
        :model-value="query"
        :label="searchLabel"
        is-label-hidden
        :placeholder="searchLabel"
        :start-icon="SearchIcon"
        has-clear
        :has-auto-focus="hasAutoFocus"
        width="100%"
        @update:model-value="onQueryChange"
        @enter="onSearchEnter"
        @keydown="onSearchKeyDown"
      />
    </VStack>
    <ScrollableArea :label="label" :height="listHeight" overscroll="contain">
      <!-- eslint-disable-next-line vue-a11y/no-static-element-interactions -- 焦点在格子按钮上，方向键冒泡到这层再按整张网格移动。 -->
      <div
        :ref="setGrid"
        class="astryx-emoji-picker__grids"
        @keydown="handleKeyDown"
        @focusin="handleFocus"
        @focusout="onGridsFocusOut"
        @mouseleave="preview = null"
      >
        <VStack
          v-for="(section, sectionIndex) in sections"
          :key="section.key"
          :gap="1"
          width="100%"
        >
          <HStack
            class="astryx-emoji-picker__category"
            :padding-inline="3"
            :padding-block="1"
          >
            <Text :id="sectionLabelId(sectionIndex)" type="label">
              {{ section.label }}
            </Text>
          </HStack>
          <VStack
            role="grid"
            :aria-labelledby="sectionLabelId(sectionIndex)"
            :gap="0.5"
            width="100%"
            :padding-inline="3"
          >
            <div
              v-for="(row, rowIndex) in toRows(section.emojis)"
              :key="rowIndex"
              class="astryx-emoji-picker__row"
              role="row"
            >
              <div
                v-for="(option, column) in row"
                :key="option?.emoji ?? `empty-${column}`"
                class="astryx-emoji-picker__grid-cell"
                role="gridcell"
              >
                <button
                  v-if="option != null"
                  type="button"
                  class="astryx-emoji-picker__cell"
                  :aria-label="option.name"
                  @click="pick(option)"
                  @focus="preview = option"
                  @mouseenter="preview = option"
                >
                  <span aria-hidden="true">{{ option.emoji }}</span>
                </button>
              </div>
            </div>
          </VStack>
        </VStack>
        <Center v-if="showLoading">
          <Spinner size="sm" :label="t('@astryx.emojiPicker.loading')" />
        </Center>
        <HStack
          role="status"
          aria-atomic="true"
          :padding-inline="3"
          data-emoji-picker-search-status="true"
        >
          <Text v-if="queryWords.length === 0 && loaded === 'failed'" type="supporting" color="secondary">
            {{ t('@astryx.emojiPicker.loadFailed') }}
          </Text>
          <Text v-else-if="noResultsMessage != null" type="supporting" color="secondary">
            {{ noResultsMessage }}
          </Text>
        </HStack>
      </div>
    </ScrollableArea>
    <HStack
      class="astryx-emoji-picker__preview"
      :gap="2"
      align="center"
      :padding-inline="3"
      :padding-block-end="2"
      aria-hidden="true"
    >
      <template v-if="preview != null">
        <span class="astryx-emoji-picker__preview-emoji">{{ preview.emoji }}</span>
        <Text type="supporting" color="secondary" :max-lines="1">
          {{ preview.name }}
        </Text>
      </template>
      <Text v-else type="supporting" color="secondary" :max-lines="1">
        {{ label }}
      </Text>
    </HStack>
  </VStack>
</template>
