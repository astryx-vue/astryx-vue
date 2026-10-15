<script setup lang="ts">
import type { AsyncSourceStatus } from '../composables/useAsyncSource.js'
import Spinner from '../Spinner/Spinner.vue'
import TypeaheadItem from './TypeaheadItem.vue'

export interface TypeaheadMenuEntryView {
  id: string
  label: string
  description?: string
  disabled?: boolean
  selected?: boolean
}

defineOptions({ name: 'AstryxTypeaheadMenu' })

const props = defineProps<{
  entries: readonly TypeaheadMenuEntryView[]
  activeIndex: number
  status: AsyncSourceStatus
  listboxId: string
  emptyText: string
  loadingText: string
  errorText: string
}>()

const emit = defineEmits<{
  select: [id: string]
  highlight: [index: number]
}>()

function optionId(index: number): string {
  return `${props.listboxId}-option-${index}`
}

function onOptionClick(id: string, disabled?: boolean): void {
  if (!disabled)
    emit('select', id)
}
</script>

<template>
  <div class="astryx-typeahead-menu" role="presentation">
    <div
      v-if="props.status === 'loading' && props.entries.length === 0"
      class="astryx-typeahead-state"
      role="status"
    >
      <Spinner size="sm" :label="props.loadingText" />
    </div>
    <div v-else-if="props.status === 'error'" class="astryx-typeahead-state" role="alert">
      {{ props.errorText }}
    </div>
    <div v-else-if="props.entries.length === 0" class="astryx-typeahead-state">
      <slot name="empty">
        {{ props.emptyText }}
      </slot>
    </div>
    <div v-else class="astryx-typeahead-options" role="presentation">
      <!-- eslint-disable-next-line vue-a11y/click-events-have-key-events, vue-a11y/mouse-events-have-key-events -- 选项不进 Tab 序，方向键和 Enter 由组合框输入处理。 -->
      <div
        v-for="(entry, index) in props.entries"
        :id="optionId(index)"
        :key="entry.id"
        class="astryx-typeahead-option"
        :class="{
          'is-active': index === props.activeIndex,
          'is-selected': entry.selected,
          'is-disabled': entry.disabled,
        }"
        role="option"
        :aria-selected="entry.selected ? 'true' : 'false'"
        :aria-disabled="entry.disabled || undefined"
        :data-option-id="entry.id"
        tabindex="-1"
        @mousedown.prevent
        @mouseenter="emit('highlight', index)"
        @click="onOptionClick(entry.id, entry.disabled)"
      >
        <span class="astryx-typeahead-option-copy">
          <slot name="item" :entry="entry" :is-active="index === props.activeIndex" :is-selected="Boolean(entry.selected)">
            <TypeaheadItem
              :item="{ id: entry.id, label: entry.label, description: entry.description, disabled: entry.disabled }"
              :is-disabled="entry.disabled"
            />
          </slot>
        </span>
        <svg v-if="entry.selected" class="astryx-typeahead-check" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
    </div>
  </div>
</template>
