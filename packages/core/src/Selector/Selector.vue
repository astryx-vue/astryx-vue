<script setup lang="ts">
import type { SelectorEmits, SelectorOption, SelectorProps, SelectorSlots } from './types.js'
import { computed, nextTick, onMounted, ref, useId, useSlots, useTemplateRef, watch } from 'vue'
import BottomSheet from '../BottomSheet/BottomSheet.vue'
import { useCombobox } from '../composables/useCombobox.js'
import { useDismiss } from '../composables/useDismiss.js'
import { usePositionedLayer } from '../layer/usePositionedLayer.js'
import { useAstryxMessages } from '../locale/index.js'
import '../../styles/selector.css'
import '../../styles/visually-hidden-utility.css'

defineOptions({ name: 'AstryxSelector', inheritAttrs: false })

const props = withDefaults(defineProps<SelectorProps>(), {
  modelValue: null,
  disabled: false,
  status: 'default',
  size: 'md',
  searchable: false,
  clearable: false,
  presentation: 'popover',
})

const emit = defineEmits<SelectorEmits>()
defineSlots<SelectorSlots>()
const slots = useSlots()

const selectorId = `astryx-selector-${useId()}`
const listboxId = `${selectorId}-listbox`
const messages = useAstryxMessages()
const resolvedPlaceholder = computed(() => props.placeholder ?? messages.value.selector.placeholder)
const resolvedSearchPlaceholder = computed(() => props.searchPlaceholder ?? messages.value.selector.search)
const resolvedClearLabel = computed(() => props.clearLabel ?? messages.value.selector.clear)
const resolvedEmptyText = computed(() => props.emptyText ?? messages.value.selector.empty)
const fieldRef = useTemplateRef<HTMLElement>('fieldRef')
const listboxRef = useTemplateRef<HTMLElement>('listboxRef')
const searchInputRef = useTemplateRef<HTMLInputElement>('searchInputRef')
const sheetSlot = useTemplateRef<HTMLElement>('sheetSlot')
const isSheet = computed(() => props.presentation === 'bottom-sheet')
const sheetLabel = computed(() => props.label || resolvedPlaceholder.value)

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

const sheetOpen = computed({
  get: () => isSheet.value && combobox.isOpen.value,
  set: (open: boolean) => {
    if (!open && combobox.isOpen.value)
      combobox.close()
  },
})
const popoverOpen = computed(() => combobox.isOpen.value && !isSheet.value)
const listboxTarget = computed(() => isSheet.value && sheetSlot.value ? sheetSlot.value : 'body')

const { position } = usePositionedLayer({
  anchor: fieldRef,
  layer: listboxRef,
  isOpen: popoverOpen,
  placement: computed(() => 'below'),
  alignment: computed(() => 'start'),
  gap: 4,
})

useDismiss({
  container: listboxRef,
  trigger: fieldRef,
  isEnabled: popoverOpen,
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
  return selectedOption.value?.label ?? resolvedPlaceholder.value
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

const anchorWidth = ref(0)

function syncAnchorWidth(): void {
  anchorWidth.value = fieldRef.value?.getBoundingClientRect().width ?? 0
}

const listboxStyle = computed(() => isSheet.value
  ? undefined
  : {
      top: `${position.value.top}px`,
      left: `${position.value.left}px`,
      minWidth: anchorWidth.value > 0 ? `${anchorWidth.value}px` : undefined,
    })

watch(combobox.isOpen, (open) => {
  if (open)
    syncAnchorWidth()
}, { flush: 'pre' })

onMounted(syncAnchorWidth)

// 只滚动列表自身，避免把页面滚到尚未定位的浮层上。
watch(() => combobox.activeIndex.value, (index) => {
  if (index >= 0 && combobox.isOpen.value) {
    nextTick(() => {
      const listbox = listboxRef.value
      const optionEl = listbox?.querySelector<HTMLElement>(`#${getOptionId(index)}`)
      if (!listbox || !optionEl)
        return
      const listboxRect = listbox.getBoundingClientRect()
      const optionRect = optionEl.getBoundingClientRect()
      if (optionRect.top < listboxRect.top)
        listbox.scrollTop -= listboxRect.top - optionRect.top
      else if (optionRect.bottom > listboxRect.bottom)
        listbox.scrollTop += optionRect.bottom - listboxRect.bottom
    })
  }
})
</script>

<template>
  <div class="astryx-selector" :class="[`size-${props.size}`, `status-${props.status}`]">
    <div
      ref="fieldRef"
      class="astryx-selector-field"
      :class="{ 'is-open': combobox.isOpen.value, 'is-disabled': props.disabled }"
    >
      <button
        :id="selectorId"
        type="button"
        class="astryx-selector-trigger"
        :class="{ 'is-open': combobox.isOpen.value, 'is-disabled': props.disabled }"
        :disabled="props.disabled"
        aria-haspopup="listbox"
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
      </button>
      <button
        v-if="props.clearable && selectedOption"
        type="button"
        class="astryx-selector-clear"
        :aria-label="resolvedClearLabel"
        @click="onClear"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      </button>
    </div>

    <BottomSheet
      v-if="isSheet"
      v-model:is-open="sheetOpen"
      height="hug"
      :label="sheetLabel"
      :padding="2"
    >
      <div ref="sheetSlot" class="astryx-selector-sheet">
        <div class="astryx-selector-sheet-title">
          {{ sheetLabel }}
        </div>
      </div>
    </BottomSheet>
    <Teleport :to="listboxTarget">
      <div
        v-show="combobox.isOpen.value"
        :id="listboxId"
        ref="listboxRef"
        role="listbox"
        class="astryx-selector-listbox"
        :class="{ 'is-sheet': isSheet }"
        :data-placement="isSheet ? undefined : position.placement"
        :style="listboxStyle"
        tabindex="-1"
      >
        <div v-if="props.searchable" class="astryx-selector-search">
          <input
            :id="`${selectorId}-search`"
            ref="searchInputRef"
            type="text"
            class="astryx-selector-search-input"
            :aria-label="resolvedSearchPlaceholder"
            :placeholder="resolvedSearchPlaceholder"
            :value="combobox.searchQuery.value"
            @input="onSearchInput"
          >
        </div>

        <div v-if="!isEmpty" class="astryx-selector-options">
          <div
            v-for="(option, index) in combobox.filteredOptions.value"
            :id="getOptionId(index)"
            :key="option.value"
            role="option"
            tabindex="0"
            class="astryx-selector-option"
            :class="{
              'is-active': index === combobox.activeIndex.value,
              'is-selected': option.value === props.modelValue,
              'is-disabled': option.disabled,
            }"
            :aria-selected="option.value === props.modelValue"
            :aria-disabled="option.disabled"
            @click="onOptionClick(option)"
            @keydown.enter="onOptionClick(option)"
            @keydown.space.prevent="onOptionClick(option)"
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

        <div v-else class="astryx-selector-empty">
          <slot v-if="slots.empty" name="empty" />
          <template v-else>
            {{ resolvedEmptyText }}
          </template>
        </div>
      </div>
    </Teleport>

    <select
      v-if="props.name"
      :id="`${selectorId}-hidden-select`"
      :name="props.name"
      :value="props.modelValue ?? ''"
      :aria-label="props.label || resolvedPlaceholder"
      tabindex="-1"
      style="position: absolute; left: -9999px; width: 1px; height: 1px;"
    >
      <option value="" />
      <option v-for="option in props.options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </div>
</template>
