<script setup lang="ts">
import type { SelectorEmits, SelectorOption, SelectorProps, SelectorSlots } from './types.js'
import { computed, nextTick, ref, useId, useSlots, useTemplateRef, watch } from 'vue'
import { useCombobox } from '../composables/useCombobox.js'
import { useDismiss } from '../composables/useDismiss.js'
import { usePositionedLayer } from '../layer/usePositionedLayer.js'
import '../../styles/selector.css'

defineOptions({ name: 'AstryxSelector', inheritAttrs: false })

const props = withDefaults(defineProps<SelectorProps>(), {
  modelValue: null,
  placeholder: '请选择',
  disabled: false,
  status: 'default',
  size: 'md',
  searchable: false,
  searchPlaceholder: '搜索...',
  clearable: false,
  clearLabel: '清除',
  emptyText: '无匹配项',
})

const emit = defineEmits<SelectorEmits>()
defineSlots<SelectorSlots>()
const slots = useSlots()

const selectorId = `astryx-selector-${useId()}`
const listboxId = `${selectorId}-listbox`
const triggerRef = useTemplateRef<HTMLElement>('triggerRef')
const listboxRef = useTemplateRef<HTMLElement>('listboxRef')
const searchInputRef = useTemplateRef<HTMLInputElement>('searchInputRef')

const isEnabled = computed(() => !props.disabled)
const isSearchable = computed(() => props.searchable)

const comboboxOptions = computed(() =>
  props.options.map(opt => ({
    value: opt.value,
    label: opt.label,
    disabled: opt.disabled ?? false,
  })),
)

const modelValueRef = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
    emit('change', value)
  },
})

const combobox = useCombobox({
  options: comboboxOptions,
  modelValue: modelValueRef,
  isEnabled,
  isSearchable,
  onChange: (value) => {
    modelValueRef.value = value
  },
  onOpenChange: (isOpen) => {
    if (isOpen && props.searchable) {
      nextTick(() => {
        searchInputRef.value?.focus()
      })
    }
  },
})

const { position } = usePositionedLayer({
  anchor: triggerRef,
  layer: listboxRef,
  isOpen: combobox.isOpen,
  placement: computed(() => 'below'),
  alignment: computed(() => 'start'),
  gap: 4,
})

useDismiss({
  container: listboxRef,
  trigger: triggerRef,
  isEnabled: combobox.isOpen,
  enableEscape: ref(true),
  onDismiss: () => {
    combobox.close()
  },
})

const selectedOption = computed(() => {
  if (props.modelValue == null)
    return null
  return props.options.find(opt => opt.value === props.modelValue) ?? null
})

const displayText = computed(() => {
  return selectedOption.value?.label ?? props.placeholder
})

const isEmpty = computed(() => {
  return combobox.filteredOptions.value.length === 0
})

function onTriggerClick(): void {
  if (isEnabled.value) {
    combobox.toggle()
  }
}

function onTriggerKeyDown(event: KeyboardEvent): void {
  combobox.onKeyDown(event)
}

function onOptionClick(option: SelectorOption): void {
  if (!option.disabled) {
    combobox.select(option.value)
  }
}

function onClear(event: Event): void {
  event.stopPropagation()
  modelValueRef.value = null
  combobox.close()
}

function onSearchInput(event: Event): void {
  const target = event.target as HTMLInputElement
  combobox.setSearchQuery(target.value)
  emit('search', target.value)
}

function getOptionId(index: number): string {
  return `${listboxId}-option-${index}`
}

// 滚动到激活的选项
watch(() => combobox.activeIndex.value, (index) => {
  if (index >= 0 && combobox.isOpen.value) {
    nextTick(() => {
      const optionEl = listboxRef.value?.querySelector(`#${getOptionId(index)}`)
      if (optionEl) {
        optionEl.scrollIntoView({ block: 'nearest' })
      }
    })
  }
})
</script>

<template>
  <div class="astryx-selector" :class="[`size-${props.size}`, `status-${props.status}`]">
    <!-- 触发器 -->
    <button
      :id="selectorId"
      ref="triggerRef"
      type="button"
      class="astryx-selector-trigger"
      :class="{ 'is-open': combobox.isOpen.value, 'is-disabled': props.disabled }"
      :disabled="props.disabled"
      :aria-haspopup="'listbox'"
      :aria-expanded="combobox.isOpen.value"
      :aria-controls="listboxId"
      :aria-label="props.label"
      :aria-activedescendant="combobox.activeIndex.value >= 0 ? getOptionId(combobox.activeIndex.value) : undefined"
      :title="props.disabledReason"
      @click="onTriggerClick"
      @keydown="onTriggerKeyDown"
    >
      <span class="astryx-selector-value" :class="{ 'is-placeholder': !selectedOption }">
        <slot v-if="slots.selected" name="selected" :option="selectedOption" />
        <template v-else>
          {{ displayText }}
        </template>
      </span>
      <span class="astryx-selector-icon" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </span>
      <button
        v-if="props.clearable && selectedOption"
        type="button"
        class="astryx-selector-clear"
        :aria-label="props.clearLabel"
        @click="onClear"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      </button>
    </button>

    <!-- 下拉列表 -->
    <Teleport to="body">
      <div
        v-show="combobox.isOpen.value"
        ref="listboxRef"
        :id="listboxId"
        role="listbox"
        class="astryx-selector-listbox"
        :style="{
          top: `${position.top}px`,
          left: `${position.left}px`,
        }"
        tabindex="-1"
      >
        <!-- 搜索框 -->
        <div v-if="props.searchable" class="astryx-selector-search">
          <input
            ref="searchInputRef"
            type="text"
            class="astryx-selector-search-input"
            :placeholder="props.searchPlaceholder"
            :value="combobox.searchQuery.value"
            @input="onSearchInput"
          >
        </div>

        <!-- 选项列表 -->
        <div v-if="!isEmpty" class="astryx-selector-options">
          <div
            v-for="(option, index) in combobox.filteredOptions.value"
            :key="option.value"
            :id="getOptionId(index)"
            role="option"
            class="astryx-selector-option"
            :class="{
              'is-active': index === combobox.activeIndex.value,
              'is-selected': option.value === props.modelValue,
              'is-disabled': option.disabled,
            }"
            :aria-selected="option.value === props.modelValue"
            :aria-disabled="option.disabled"
            @click="onOptionClick(option)"
          >
            <slot v-if="slots.option" name="option" :option="option" :is-active="index === combobox.activeIndex.value" :is-selected="option.value === props.modelValue" />
            <template v-else>
              <span class="astryx-selector-option-label">{{ option.label }}</span>
              <span v-if="option.description" class="astryx-selector-option-description">
                {{ option.description }}
              </span>
            </template>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else class="astryx-selector-empty">
          <slot v-if="slots.empty" name="empty" />
          <template v-else>
            {{ props.emptyText }}
          </template>
        </div>
      </div>
    </Teleport>

    <!-- 隐藏的原生 select（用于表单提交） -->
    <select v-if="props.name" :name="props.name" :value="props.modelValue ?? ''" tabindex="-1" style="position: absolute; left: -9999px; width: 1px; height: 1px;">
      <option value="" />
      <option v-for="option in props.options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </div>
</template>
