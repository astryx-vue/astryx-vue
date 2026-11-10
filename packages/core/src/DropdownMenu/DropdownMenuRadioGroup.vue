<script setup lang="ts">
import type { DropdownMenuRadioGroupEmits, DropdownMenuRadioGroupProps, DropdownMenuRadioGroupSlots } from './types.js'
import { computed, provide, useAttrs } from 'vue'
import { dropdownMenuRadioGroupKey } from './context.js'
import '../../styles/dropdown-menu.css'

defineOptions({ name: 'AstryxDropdownMenuRadioGroup', inheritAttrs: false })

const props = withDefaults(defineProps<Omit<DropdownMenuRadioGroupProps, 'modelValue'>>(), {
  hasCloseOnSelect: true,
})

const emit = defineEmits<DropdownMenuRadioGroupEmits>()
defineSlots<DropdownMenuRadioGroupSlots>()
const attrs = useAttrs()
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
    v-bind="attrs"
    class="astryx-dropdown-menu-radio-group"
    role="group"
    :aria-label="label"
  >
    <slot />
  </div>
</template>
