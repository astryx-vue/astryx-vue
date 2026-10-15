<script setup lang="ts">
import type { DropdownMenuRadioGroupEmits, DropdownMenuRadioGroupProps, DropdownMenuRadioGroupSlots } from './types.js'
import { computed, provide } from 'vue'
import { dropdownMenuRadioGroupKey } from './context.js'
import '../../styles/dropdown-menu.css'

defineOptions({ name: 'AstryxDropdownMenuRadioGroup', inheritAttrs: false })

const props = withDefaults(defineProps<Omit<DropdownMenuRadioGroupProps, 'modelValue'>>(), {
  hasCloseOnSelect: true,
})

const emit = defineEmits<DropdownMenuRadioGroupEmits>()
defineSlots<DropdownMenuRadioGroupSlots>()
const selected = defineModel<string | undefined>('modelValue')

provide(dropdownMenuRadioGroupKey, {
  hasCloseOnSelect: computed(() => props.hasCloseOnSelect),
  select: (value: string) => {
    selected.value = value
    emit('change', value)
  },
  value: computed(() => selected.value),
})
</script>

<template>
  <div
    class="astryx-dropdown-menu-radio-group"
    role="group"
    :aria-label="label"
  >
    <slot />
  </div>
</template>
