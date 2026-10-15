<script setup lang="ts">
import CheckboxIndicator from '../CheckboxIndicator/CheckboxIndicator.vue'
import '../../styles/dropdown-menu.css'

defineOptions({ name: 'AstryxMenuSelectionMark' })

withDefaults(defineProps<{
  kind: 'checkbox' | 'radio'
  checked: boolean
  size?: 'sm' | 'md'
  isDisabled?: boolean
}>(), {
  size: 'md',
  isDisabled: false,
})
</script>

<template>
  <span class="astryx-dropdown-menu-mark">
    <CheckboxIndicator
      v-if="kind === 'checkbox'"
      :is-disabled="isDisabled"
      :size="size"
      :state="checked ? 'checked' : 'unchecked'"
    />
    <span
      v-else
      class="astryx-dropdown-menu-radio"
      :data-checked="checked ? 'checked' : undefined"
      :data-disabled="isDisabled || undefined"
      :data-size="size"
      aria-hidden="true"
    >
      <span class="astryx-dropdown-menu-radio-dot" />
    </span>
  </span>
</template>
