<script setup lang="ts" generic="T extends SearchableItem">
import type { Ref } from 'vue'
import type { MobileTokenizerChange, MobileTokenizerEmits, MobileTokenizerProps, SearchableItem } from './types.js'
import { AlertDialog, BottomSheet, Button, CheckboxIndicator, EmptyState, Field, Icon, Text, TextInput, Token } from '@astryx-vue/core'
import { computed, ref, useId } from 'vue'
import { ListBulletIcon, SearchIcon } from './icons.js'
import { useSheetSearch } from './useSheetSearch.js'
import '../../styles/mobile-tokenizer.css'

defineOptions({ name: 'AstryxMobileTokenizer', inheritAttrs: false })

const props = withDefaults(defineProps<MobileTokenizerProps<T>>(), {
  hasCreate: false,
  isDisabled: false,
  maxMenuItems: 10,
  minQueryLength: 1,
  debounceMs: 150,
  emptySearchResultsText: 'No results found',
})

const emit = defineEmits<MobileTokenizerEmits<T>>()

const CREATABLE_ID_PREFIX = '__xds_create__'

const triggerId = `astryx-mobile-tokenizer-${useId()}`
const isOpen = ref(false)
const isClearConfirmationOpen = ref(false)
const query = ref('')
/** 打开那一刻的选中项，决定列表开头那一段的顺序。 */
const selectedAtOpen = ref<T[]>([]) as Ref<T[]>

const selected = computed<T[]>(() => props.modelValue as T[])
const selectedIds = computed(() => new Set(selected.value.map(item => item.id)))
const isAtMax = computed(() => props.maxEntries != null && selected.value.length >= props.maxEntries)

const sheet = useSheetSearch<T>({
  isOpen: () => isOpen.value,
  query,
  searchSource: () => props.searchSource,
  minQueryLength: () => props.minQueryLength,
  maxMenuItems: () => props.maxMenuItems,
  debounceMs: () => props.debounceMs,
  selectedAtOpen: () => selectedAtOpen.value,
  selectedNow: () => selected.value,
})

const visibleItems = sheet.visibleItems
const renderedItems = sheet.renderedItems

/** 输入的文字还不在任何选项里时，给一行 `Create "…"` 和后面的加一项按钮。 */
const creatableItem = computed<T | null>(() => {
  const trimmed = query.value.trim()
  if (!props.hasCreate || trimmed === '' || isAtMax.value)
    return null
  const lowered = trimmed.toLowerCase()
  const alreadyThere
    = selectedIds.value.has(trimmed)
      || selected.value.some(item => item.label.toLowerCase() === lowered)
      || sheet.results.value.some(item => item.label.toLowerCase() === lowered)
  if (alreadyThere)
    return null
  return { id: `${CREATABLE_ID_PREFIX}${trimmed}`, label: `Create "${trimmed}"` } as unknown as T
})

function commit(items: T[], change: MobileTokenizerChange<T>): void {
  emit('update:modelValue', items)
  emit('change', items, change)
}

function handleAdd(item: T): void {
  if (isAtMax.value || selectedIds.value.has(item.id))
    return
  if (props.hasCreate && item.id.startsWith(CREATABLE_ID_PREFIX)) {
    const created = item.id.slice(CREATABLE_ID_PREFIX.length)
    if (selectedIds.value.has(created))
      return
    const createdItem = { id: created, label: created } as T
    commit([...selected.value, createdItem], { item: createdItem, type: 'create' })
    return
  }
  commit([...selected.value, item], { item, type: 'add' })
}

function handleRemove(item: T): void {
  commit(selected.value.filter(candidate => candidate.id !== item.id), { item, type: 'remove' })
}

function handleClearAll(): void {
  if (selected.value.length === 0)
    return
  commit([], { item: selected.value[selected.value.length - 1] as T, type: 'remove' })
}

function openSheet(): void {
  selectedAtOpen.value = [...selected.value]
  sheet.resetWindow()
  isOpen.value = true
  emit('openChange', true)
}

function handleOpenChange(next: boolean): void {
  isOpen.value = next
  emit('openChange', next)
}

function handleQueryInput(next: string): void {
  query.value = next
  emit('update:query', next)
  emit('changeQuery', next)
}

function handleCreate(): void {
  const item = creatableItem.value
  if (item == null)
    return
  handleAdd(item)
  query.value = ''
  sheet.resetWindow()
}

function handleDone(): void {
  query.value = ''
  handleOpenChange(false)
}

function confirmClear(): void {
  handleClearAll()
  isClearConfirmationOpen.value = false
}
</script>

<template>
  <Field
    :label="label" :description="description" :is-optional="isOptional"
    :is-disabled="isDisabled" :input-id="triggerId"
  >
    <button
      :id="triggerId" type="button" class="astryx-mobile-tokenizer__trigger"
      aria-haspopup="dialog" :aria-expanded="isOpen" :aria-label="label"
      :disabled="isDisabled" @click="openSheet"
    >
      <template v-if="selected.length > 0">
        <Token v-for="item in selected" :key="item.id" :label="item.label" :disabled="isDisabled" />
      </template>
      <span v-else class="astryx-mobile-tokenizer__trigger-placeholder">{{ placeholder ?? '' }}</span>
    </button>

    <BottomSheet
      v-if="!isDisabled" :is-open="isOpen" :label="label" height="tall" :padding="0"
      @open-change="handleOpenChange"
    >
      <div class="astryx-mobile-tokenizer__sheet-body">
        <div class="astryx-mobile-tokenizer__filter-row">
          <TextInput
            :model-value="query" :label="`Search ${label}`" is-label-hidden
            placeholder="Search..." :start-icon="SearchIcon" size="lg" width="100%"
            has-clear control-class="astryx-mobile-tokenizer__filter-input"
            @update:model-value="handleQueryInput"
          />
        </div>

        <div
          class="astryx-mobile-tokenizer__list" role="group" :aria-label="label"
          data-testid="mobile-tokenizer-list"
          :data-rendered-count="renderedItems.length" :data-total-count="visibleItems.length"
          @scroll="sheet.handleScroll"
        >
          <div v-if="creatableItem != null" class="astryx-mobile-tokenizer__create-row" data-testid="mobile-tokenizer-create-row">
            <span class="astryx-mobile-tokenizer__create-label">
              <Text type="body">{{ creatableItem.label }}</Text>
            </span>
            <Button
              :label="`Add ${query.trim()}`" variant="secondary" size="lg"
              @click="handleCreate"
            />
          </div>

          <EmptyState
            v-if="!sheet.isSearching.value && visibleItems.length === 0 && creatableItem == null"
            class="astryx-mobile-tokenizer__empty" is-compact
            :title="query.trim() === '' ? 'No items available' : emptySearchResultsText"
            :description="query.trim() === '' ? 'There are no items to choose from.' : 'Try a different search.'"
          >
            <template #icon>
              <Icon :icon="query.trim() === '' ? ListBulletIcon : 'search'" size="lg" color="secondary" />
            </template>
          </EmptyState>

          <template v-else>
            <button
              v-for="item in renderedItems" :key="item.id" type="button" role="checkbox"
              class="astryx-mobile-tokenizer__row" :aria-checked="selectedIds.has(item.id)"
              :aria-label="item.label" :disabled="!selectedIds.has(item.id) && isAtMax"
              @click="selectedIds.has(item.id) ? handleRemove(item) : handleAdd(item)"
            >
              <span class="astryx-mobile-tokenizer__row-label"><Text type="body">{{ item.label }}</Text></span>
              <CheckboxIndicator
                :state="selectedIds.has(item.id) ? 'checked' : 'unchecked'" size="md"
                :is-disabled="!selectedIds.has(item.id) && isAtMax"
              />
            </button>
          </template>
        </div>

        <div v-if="query.trim() === ''" class="astryx-mobile-tokenizer__footer">
          <Button
            class="astryx-mobile-tokenizer__footer-action" label="Clear all" variant="secondary"
            size="lg" :is-disabled="selected.length === 0" @click="isClearConfirmationOpen = true"
          />
          <Button
            class="astryx-mobile-tokenizer__footer-action" label="Done" variant="primary" size="lg"
            @click="handleDone"
          />
        </div>

        <AlertDialog
          :is-open="isClearConfirmationOpen" title="Clear all selected items?"
          :description="`This removes all selected items from ${label}.`" action-label="Clear selection"
          @open-change="isClearConfirmationOpen = $event" @action="confirmClear"
        />
      </div>
    </BottomSheet>
  </Field>
</template>
