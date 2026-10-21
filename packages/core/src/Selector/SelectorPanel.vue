<script setup lang="ts">
import type { Component } from 'vue'
import type { SelectorDisplayRow } from './selectorOptions.js'
import type { SelectorIndicatorPosition, SelectorOption } from './types.js'
import { nextTick, useTemplateRef, watch } from 'vue'
import Icon from '../Icon/Icon.vue'
import { isOptionAction } from '../selectors/optionAction.js'
import { OptionAction } from '../selectors/optionActionView.js'

defineOptions({ name: 'AstryxSelectorPanel' })

const props = defineProps<{
  searchable: boolean
  query: string
  placeholder: string
  clearLabel: string
  rows: readonly SelectorDisplayRow[]
  activeIndex: number
  modelValue?: string | number | null
  indicatorPosition: SelectorIndicatorPosition
  grid: boolean
  actionIndex: number
  loading: boolean
  showEmpty: boolean
  searching: boolean
  emptyText: string
  listboxId: string
  isOpen: boolean
  activeDescendant?: string
  mark: Component
}>()

const emit = defineEmits<{
  query: [value: string]
  keydown: [event: KeyboardEvent]
  select: [option: SelectorOption]
}>()

defineSlots<{
  option?: (props: { option: SelectorOption, isActive: boolean, isSelected: boolean }) => unknown
  empty?: () => unknown
}>()

const root = useTemplateRef<HTMLElement>('root')
const searchInput = useTemplateRef<HTMLInputElement>('searchInput')

function optionId(index: number): string {
  return `${props.listboxId}-option-${index}`
}

function actionId(index: number): string {
  return `${props.listboxId}-action-${index}`
}

function selected(option: SelectorOption): boolean {
  return option.value === props.modelValue
}

function active(index: number | undefined): boolean {
  return index === props.activeIndex
}

defineExpose({
  focusSearch: () => searchInput.value?.focus(),
})

function clearQuery(event: Event): void {
  event.stopPropagation()
  emit('query', '')
  searchInput.value?.focus()
}

watch(() => [props.activeIndex, props.isOpen] as const, ([index, open]) => {
  if (!open || index < 0)
    return
  nextTick(() => {
    const listbox = root.value?.parentElement
    const optionEl = listbox?.querySelector<HTMLElement>(`#${CSS.escape(optionId(index))}`)
    if (!listbox || !optionEl)
      return
    const listboxRect = listbox.getBoundingClientRect()
    const optionRect = optionEl.getBoundingClientRect()
    if (optionRect.top < listboxRect.top)
      listbox.scrollTop -= listboxRect.top - optionRect.top
    else if (optionRect.bottom > listboxRect.bottom)
      listbox.scrollTop += optionRect.bottom - listboxRect.bottom
  })
})
</script>

<template>
  <div ref="root">
    <div v-if="searchable" class="astryx-selector-search">
      <Icon class="astryx-selector-search-icon" icon="search" size="sm" />
      <input
        :id="`${listboxId}-search`"
        ref="searchInput"
        type="text"
        class="astryx-selector-search-input"
        role="combobox"
        autocomplete="off"
        :aria-label="placeholder"
        :aria-expanded="isOpen"
        :aria-controls="listboxId"
        aria-autocomplete="list"
        :aria-activedescendant="activeDescendant"
        :placeholder="placeholder"
        :value="query"
        @input="emit('query', ($event.target as HTMLInputElement).value)"
        @keydown="emit('keydown', $event)"
      >
      <button
        v-if="query"
        type="button"
        class="astryx-selector-search-clear"
        :aria-label="clearLabel"
        @click.stop="clearQuery"
      >
        <Icon icon="close" size="sm" />
      </button>
    </div>

    <div v-if="!loading && rows.length > 0" class="astryx-selector-options">
      <template v-for="(row, rowIndex) in rows" :key="row.kind === 'section' ? `section-${rowIndex}` : row.option?.value">
        <div v-if="row.kind === 'section' && !grid" class="astryx-selector-section" role="presentation">
          {{ row.title }}
        </div>
        <div v-else-if="row.kind === 'section'" class="astryx-selector-section" role="rowgroup" :aria-label="row.title">
          <span aria-hidden="true">{{ row.title }}</span>
        </div>
        <div
          v-else-if="row.option && row.index != null && !grid"
          :id="optionId(row.index)"
          role="option"
          tabindex="-1"
          class="astryx-selector-option"
          :class="{
            'is-active': active(row.index),
            'is-selected': selected(row.option),
            'is-disabled': row.option.disabled,
          }"
          :aria-selected="selected(row.option)"
          :aria-disabled="row.option.disabled"
          @click="emit('select', row.option)"
          @keydown.enter="emit('select', row.option)"
          @keydown.space.prevent="emit('select', row.option)"
        >
          <span v-if="indicatorPosition === 'start'" class="astryx-selector-option-mark">
            <component :is="mark" class="astryx-selector-check" :state="selected(row.option) ? 'checked' : 'unchecked'" size="sm" :is-disabled="row.option.disabled" />
          </span>
          <span class="astryx-selector-option-body">
            <slot v-if="$slots.option" name="option" :option="row.option" :is-active="active(row.index)" :is-selected="selected(row.option)" />
            <template v-else>
              <span v-if="row.option.icon" class="astryx-selector-option-icon" :class="row.option.icon" aria-hidden="true" />
              <span class="astryx-selector-option-copy">
                <span class="astryx-selector-option-label">{{ row.option.label }}</span>
                <span v-if="row.option.description" class="astryx-selector-option-description">{{ row.option.description }}</span>
              </span>
            </template>
          </span>
          <span v-if="indicatorPosition === 'end'" class="astryx-selector-option-mark">
            <component :is="mark" class="astryx-selector-check" :state="selected(row.option) ? 'checked' : 'unchecked'" size="sm" :is-disabled="row.option.disabled" />
          </span>
        </div>
        <div
          v-else-if="row.option && row.index != null"
          class="astryx-selector-option"
          :class="{
            'is-active': active(row.index),
            'is-selected': selected(row.option),
            'is-disabled': row.option.disabled,
          }"
          role="row"
          :aria-selected="selected(row.option)"
          :aria-disabled="row.option.disabled || undefined"
        >
          <!-- eslint-disable-next-line vue-a11y/click-events-have-key-events -- 选项格不进 Tab 序，方向键和回车由组合框处理。 -->
          <div
            :id="optionId(row.index)"
            class="astryx-selector-option-main"
            role="gridcell"
            tabindex="-1"
            @click="emit('select', row.option)"
          >
            <span v-if="indicatorPosition === 'start'" class="astryx-selector-option-mark">
              <component :is="mark" class="astryx-selector-check" :state="selected(row.option) ? 'checked' : 'unchecked'" size="sm" :is-disabled="row.option.disabled" />
            </span>
            <span class="astryx-selector-option-body">
              <slot v-if="$slots.option" name="option" :option="row.option" :is-active="active(row.index)" :is-selected="selected(row.option)" />
              <template v-else>
                <span v-if="row.option.icon" class="astryx-selector-option-icon" :class="row.option.icon" aria-hidden="true" />
                <span class="astryx-selector-option-copy">
                  <span class="astryx-selector-option-label">{{ row.option.label }}</span>
                  <span v-if="row.option.description" class="astryx-selector-option-description">{{ row.option.description }}</span>
                </span>
              </template>
            </span>
            <span v-if="indicatorPosition === 'end'" class="astryx-selector-option-mark">
              <component :is="mark" class="astryx-selector-check" :state="selected(row.option) ? 'checked' : 'unchecked'" size="sm" :is-disabled="row.option.disabled" />
            </span>
          </div>
          <div
            :id="isOptionAction(row.option.action) ? undefined : actionId(row.index)"
            class="astryx-selector-option-action"
            :class="{ 'is-active': actionIndex === row.index }"
            role="gridcell"
            @mousedown.stop
            @click.stop
          >
            <OptionAction v-if="isOptionAction(row.option.action)" :node="row.option.action" :dom-id="actionId(row.index)" />
          </div>
        </div>
      </template>
    </div>

    <div v-else-if="showEmpty" class="astryx-selector-empty" role="presentation">
      <slot v-if="!searching && $slots.empty" name="empty" />
      <template v-else>
        {{ emptyText }}
      </template>
    </div>
  </div>
</template>
