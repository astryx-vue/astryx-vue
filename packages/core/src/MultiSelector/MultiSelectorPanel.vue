<script setup lang="ts">
import type { Component } from 'vue'
import type { MultiSelectorRow } from './options.js'
import type { MultiSelectorOptionData } from './types.js'
import { computed, useTemplateRef } from 'vue'
import Icon from '../Icon/Icon.vue'
import { isOptionAction } from '../selectors/optionAction.js'
import { OptionAction } from '../selectors/optionActionView.js'
import { SELECT_ALL_VALUE } from './options.js'

defineOptions({ name: 'AstryxMultiSelectorPanel' })

const props = defineProps<{
  searchable: boolean
  query: string
  searchId: string
  searchPlaceholder: string
  clearLabel: string
  listboxId: string
  activeIndex: number
  activeDescendant?: string
  grid: boolean
  actionIndex: number
  createOption: MultiSelectorOptionData | null
  selectAll: boolean
  selectAllIndex: number
  selectAllLabel: string
  selectAllState: 'checked' | 'unchecked' | 'indeterminate'
  checkboxPosition: 'start' | 'end'
  size: 'sm' | 'md' | 'lg'
  loading: boolean
  realMatchCount: number
  rows: readonly MultiSelectorRow[]
  showEmpty: boolean
  emptyText: string
  emptySearchText: string
  searchKeyboardFocus: boolean
  mark: Component
  isSelected: (value: string | number) => boolean
  checkboxState: (option: MultiSelectorOptionData) => 'checked' | 'unchecked' | 'indeterminate'
  optionIndex: (value: string | number) => number
  optionDomId: (index: number) => string
  actionDomId: (index: number) => string
}>()

const emit = defineEmits<{
  query: [event: Event]
  keydown: [event: KeyboardEvent]
  clearQuery: []
  searchFocus: []
  searchBlur: []
  toggle: [value: string | number]
  highlight: [index: number]
}>()

defineSlots<{
  option?: (props: { option: MultiSelectorOptionData, selected: boolean, active: boolean }) => unknown
  empty?: () => unknown
}>()

const searchRef = useTemplateRef<HTMLInputElement>('searchRef')
const markSize = computed(() => props.size === 'lg' ? 'md' : 'sm')

defineExpose({
  focusSearch: () => searchRef.value?.focus(),
  searchInput: searchRef,
})

function actionOf(option: MultiSelectorOptionData | undefined) {
  return option?.action
}
</script>

<template>
  <div>
    <div v-if="searchable" class="astryx-multi-selector-search" :data-keyboard-focus="searchKeyboardFocus ? 'true' : undefined">
      <Icon class="astryx-multi-selector-search-icon" icon="search" size="sm" />
      <input
        :id="searchId"
        ref="searchRef"
        class="astryx-multi-selector-search-input"
        type="text"
        role="combobox"
        autocomplete="off"
        :aria-label="searchPlaceholder"
        aria-expanded="true"
        :aria-controls="listboxId"
        aria-autocomplete="list"
        :aria-activedescendant="activeDescendant"
        :placeholder="searchPlaceholder"
        :value="query"
        @input="emit('query', $event)"
        @focus="emit('searchFocus')"
        @blur="emit('searchBlur')"
        @keydown="emit('keydown', $event)"
      >
      <button
        v-if="query"
        type="button"
        class="astryx-multi-selector-search-clear"
        :aria-label="clearLabel"
        @click.stop="emit('clearQuery')"
      >
        <Icon icon="close" size="sm" />
      </button>
    </div>
    <!-- eslint-disable-next-line vue-a11y/click-events-have-key-events, vue-a11y/mouse-events-have-key-events -- 创建行不进 Tab 序，方向键和回车由组合框处理。 -->
    <div
      v-if="createOption && !grid"
      :id="optionDomId(0)"
      class="astryx-multi-selector-option is-create"
      :class="{ 'is-active': activeIndex === 0 }"
      role="option"
      :aria-selected="false"
      :data-option-id="String(createOption.value)"
      tabindex="-1"
      @mousedown.prevent
      @mouseenter="emit('highlight', 0)"
      @click="emit('toggle', createOption.value)"
    >
      <span class="astryx-multi-selector-option-label">{{ createOption.label }}</span>
    </div>
    <div
      v-else-if="createOption"
      class="astryx-multi-selector-option is-create"
      :class="{ 'is-active': activeIndex === 0 }"
      role="row"
      :aria-selected="false"
    >
      <!-- eslint-disable-next-line vue-a11y/click-events-have-key-events, vue-a11y/mouse-events-have-key-events -- 创建行不进 Tab 序，方向键和回车由组合框处理。 -->
      <div :id="optionDomId(0)" class="astryx-multi-selector-option-main" role="gridcell" tabindex="-1" :data-option-id="String(createOption.value)" @mousedown.prevent @mouseenter="emit('highlight', 0)" @click="emit('toggle', createOption.value)">
        <span class="astryx-multi-selector-option-label">{{ createOption.label }}</span>
      </div>
      <div :id="actionDomId(0)" class="astryx-multi-selector-option-action" role="gridcell" />
    </div>
    <!-- eslint-disable-next-line vue-a11y/click-events-have-key-events, vue-a11y/mouse-events-have-key-events -- 全选行不进 Tab 序，方向键和空格由组合框处理。 -->
    <div
      v-if="selectAll && !loading && realMatchCount > 0 && !grid"
      :id="optionDomId(selectAllIndex)"
      class="astryx-multi-selector-option is-select-all"
      :class="{ 'is-active': activeIndex === selectAllIndex }"
      role="option"
      :aria-selected="selectAllState === 'checked'"
      :data-option-id="SELECT_ALL_VALUE"
      tabindex="-1"
      @mousedown.prevent
      @mouseenter="emit('highlight', selectAllIndex)"
      @click="emit('toggle', SELECT_ALL_VALUE)"
    >
      <component :is="mark" v-if="checkboxPosition === 'start'" :state="selectAllState" :size="markSize" />
      <span class="astryx-multi-selector-option-label">{{ selectAllLabel }}</span>
      <component :is="mark" v-if="checkboxPosition === 'end'" :state="selectAllState" :size="markSize" />
    </div>
    <div
      v-else-if="selectAll && !loading && realMatchCount > 0"
      class="astryx-multi-selector-option is-select-all"
      :class="{ 'is-active': activeIndex === selectAllIndex }"
      role="row"
      :aria-selected="selectAllState === 'checked'"
    >
      <!-- eslint-disable-next-line vue-a11y/click-events-have-key-events, vue-a11y/mouse-events-have-key-events -- 全选行不进 Tab 序，方向键和空格由组合框处理。 -->
      <div :id="optionDomId(selectAllIndex)" class="astryx-multi-selector-option-main" role="gridcell" tabindex="-1" :data-option-id="SELECT_ALL_VALUE" @mousedown.prevent @mouseenter="emit('highlight', selectAllIndex)" @click="emit('toggle', SELECT_ALL_VALUE)">
        <component :is="mark" v-if="checkboxPosition === 'start'" :state="selectAllState" :size="markSize" />
        <span class="astryx-multi-selector-option-label">{{ selectAllLabel }}</span>
        <component :is="mark" v-if="checkboxPosition === 'end'" :state="selectAllState" :size="markSize" />
      </div>
      <div :id="actionDomId(selectAllIndex)" class="astryx-multi-selector-option-action" role="gridcell" />
    </div>
    <template v-if="!loading">
      <template v-for="row in rows" :key="row.key">
        <div v-if="row.kind === 'divider'" class="astryx-multi-selector-divider" role="separator" />
        <div v-else-if="row.kind === 'heading' && !grid" class="astryx-multi-selector-heading" role="presentation">
          {{ row.label }}
        </div>
        <div v-else-if="row.kind === 'heading'" class="astryx-multi-selector-heading" role="rowgroup" :aria-label="row.label">
          <span aria-hidden="true">{{ row.label }}</span>
        </div>
        <!-- eslint-disable-next-line vue-a11y/click-events-have-key-events, vue-a11y/mouse-events-have-key-events -- 选项不进 Tab 序，方向键和空格由组合框处理。 -->
        <div
          v-else-if="row.option && !grid"
          :id="optionDomId(optionIndex(row.option.value))"
          class="astryx-multi-selector-option"
          :class="{
            'is-active': optionIndex(row.option.value) === activeIndex,
            'is-disabled': row.option.disabled,
          }"
          role="option"
          :aria-selected="isSelected(row.option.value)"
          :aria-disabled="row.option.disabled || undefined"
          :data-option-id="String(row.option.value)"
          tabindex="-1"
          @mousedown.prevent
          @mouseenter="emit('highlight', optionIndex(row.option.value))"
          @click="emit('toggle', row.option.value)"
        >
          <component :is="mark" v-if="checkboxPosition === 'start'" :state="checkboxState(row.option)" :size="markSize" :is-disabled="row.option.disabled" />
          <span class="astryx-multi-selector-option-copy">
            <slot v-if="$slots.option" name="option" :option="row.option" :selected="isSelected(row.option.value)" :active="optionIndex(row.option.value) === activeIndex" />
            <template v-else>
              <span class="astryx-multi-selector-option-label">{{ row.option.label }}</span>
              <span v-if="row.option.description" class="astryx-multi-selector-option-description">{{ row.option.description }}</span>
            </template>
          </span>
          <component :is="mark" v-if="checkboxPosition === 'end'" :state="checkboxState(row.option)" :size="markSize" :is-disabled="row.option.disabled" />
        </div>
        <div
          v-else-if="row.option"
          class="astryx-multi-selector-option"
          :class="{
            'is-active': optionIndex(row.option.value) === activeIndex,
            'is-disabled': row.option.disabled,
          }"
          role="row"
          :aria-selected="isSelected(row.option.value)"
          :aria-disabled="row.option.disabled || undefined"
        >
          <!-- eslint-disable-next-line vue-a11y/click-events-have-key-events, vue-a11y/mouse-events-have-key-events -- 选项不进 Tab 序，方向键和空格由组合框处理。 -->
          <div
            :id="optionDomId(optionIndex(row.option.value))"
            class="astryx-multi-selector-option-main"
            role="gridcell"
            tabindex="-1"
            :data-option-id="String(row.option.value)"
            @mousedown.prevent
            @mouseenter="emit('highlight', optionIndex(row.option.value))"
            @click="emit('toggle', row.option.value)"
          >
            <component :is="mark" v-if="checkboxPosition === 'start'" :state="checkboxState(row.option)" :size="markSize" :is-disabled="row.option.disabled" />
            <span class="astryx-multi-selector-option-copy">
              <slot v-if="$slots.option" name="option" :option="row.option" :selected="isSelected(row.option.value)" :active="optionIndex(row.option.value) === activeIndex" />
              <template v-else>
                <span class="astryx-multi-selector-option-label">{{ row.option.label }}</span>
                <span v-if="row.option.description" class="astryx-multi-selector-option-description">{{ row.option.description }}</span>
              </template>
            </span>
            <component :is="mark" v-if="checkboxPosition === 'end'" :state="checkboxState(row.option)" :size="markSize" :is-disabled="row.option.disabled" />
          </div>
          <div
            :id="isOptionAction(actionOf(row.option)) ? undefined : actionDomId(optionIndex(row.option.value))"
            class="astryx-multi-selector-option-action"
            :class="{ 'is-active': actionIndex === optionIndex(row.option.value) }"
            role="gridcell"
            @mousedown.stop
            @click.stop
          >
            <OptionAction v-if="isOptionAction(actionOf(row.option))" :node="actionOf(row.option)!" :dom-id="actionDomId(optionIndex(row.option.value))" />
          </div>
        </div>
      </template>
    </template>
    <div v-if="showEmpty" class="astryx-multi-selector-empty" role="presentation">
      <slot v-if="!query.trim()" name="empty">
        {{ emptyText }}
      </slot>
      <template v-else>
        {{ emptySearchText }}
      </template>
    </div>
  </div>
</template>
