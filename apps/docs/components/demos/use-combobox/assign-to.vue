<script setup lang="ts">
import type { ComboboxOption } from '@astryx-vue/core'
import { useCombobox } from '@astryx-vue/core'
import { Card } from '@astryx-vue/core/Card'
import { computed, ref } from 'vue'

const PEOPLE: ComboboxOption[] = [
  { value: 'ana', label: 'Ana Ortiz' },
  { value: 'bo', label: 'Bo Lindqvist' },
  { value: 'chen', label: 'Chen Wei' },
  { value: 'dara', label: 'Dara Okafor', disabled: true },
  { value: 'eli', label: 'Eli Katz' },
]

const assignee = ref<string | number | null>(null)
const isSearchable = ref(true)
const options = ref(PEOPLE)

const combobox = useCombobox({
  options,
  modelValue: assignee,
  isSearchable,
  onChange: (value) => {
    assignee.value = value
  },
})

const assigneeLabel = computed(() => PEOPLE.find(person => person.value === assignee.value)?.label ?? '')
const inputValue = computed(() => (combobox.isOpen.value ? combobox.searchQuery.value : assigneeLabel.value))
const activeId = computed(() => (combobox.isOpen.value && combobox.activeIndex.value >= 0 ? `assign-to-${combobox.activeIndex.value}` : undefined))

function onInput(event: Event): void {
  if (!combobox.isOpen.value)
    combobox.open()
  combobox.setSearchQuery((event.target as HTMLInputElement).value)
}
</script>

<template>
  <Card :width="320" :padding="4">
    <div class="assign-to">
      <span id="assign-to-label" class="assign-to__label">Assign to</span>
      <input
        aria-labelledby="assign-to-label"
        class="assign-to__input"
        role="combobox"
        aria-controls="assign-to-list"
        aria-autocomplete="list"
        :aria-expanded="combobox.isOpen.value"
        :aria-activedescendant="activeId"
        autocomplete="off"
        placeholder="Search people"
        :value="inputValue"
        @click="combobox.open()"
        @input="onInput"
        @keydown="combobox.onKeyDown"
        @blur="combobox.close()"
      >
      <ul v-if="combobox.isOpen.value" id="assign-to-list" class="assign-to__list" role="listbox" aria-label="People">
        <li
          v-for="(option, index) in combobox.filteredOptions.value"
          :id="`assign-to-${index}`"
          :key="option.value"
          class="assign-to__option"
          role="option"
          tabindex="-1"
          :aria-selected="option.value === assignee"
          :aria-disabled="option.disabled || undefined"
          :data-active="index === combobox.activeIndex.value || undefined"
          @mousedown.prevent="!option.disabled && combobox.select(option.value)"
        >
          {{ option.label }}
        </li>
        <li v-if="combobox.filteredOptions.value.length === 0" class="assign-to__empty">
          No matches
        </li>
      </ul>
    </div>
  </Card>
</template>

<style scoped>
.assign-to {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--astryx-spacing-1, 4px);
}

.assign-to__label {
  font: var(--astryx-typography-label, inherit);
  color: var(--astryx-color-text-secondary, inherit);
}

.assign-to__input {
  box-sizing: border-box;
  height: 36px;
  padding: 0 var(--astryx-spacing-3, 12px);
  font: inherit;
  color: var(--astryx-color-text, inherit);
  background: var(--astryx-color-surface, transparent);
  border: 1px solid var(--astryx-color-border, currentColor);
  border-radius: var(--astryx-radius-md, 8px);
}

.assign-to__list {
  position: absolute;
  inset-inline: 0;
  top: 100%;
  z-index: 1;
  margin: var(--astryx-spacing-1, 4px) 0 0;
  padding: var(--astryx-spacing-1, 4px);
  list-style: none;
  background: var(--astryx-color-surface, canvas);
  border: 1px solid var(--astryx-color-border, currentColor);
  border-radius: var(--astryx-radius-md, 8px);
}

.assign-to__option,
.assign-to__empty {
  padding: var(--astryx-spacing-2, 8px);
  border-radius: var(--astryx-radius-sm, 6px);
}

.assign-to__option[data-active] {
  background: var(--astryx-color-surface-hover, rgb(128 128 128 / 20%));
}

.assign-to__option[aria-selected='true'] {
  font-weight: 600;
}

.assign-to__option[aria-disabled='true'] {
  opacity: 0.5;
}

.assign-to__empty {
  color: var(--astryx-color-text-secondary, inherit);
}
</style>
